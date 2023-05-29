import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {_Arr, Arr, Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {KoboFormProtHH} from '../../../core/koboModel/koboFormProtHH'
import {useConfig} from '../../../core/context/ConfigContext'
import {Period, UUID} from '../../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {AiProtectionHhs} from '../../../core/activityInfo/AiProtectionHhs'
import {koboHromadaMapping} from './koboHromadaMapping'
import {chain, groupByAndTransform} from '../../../utils/utils'
import {Page} from '../../../shared/Page'
import {IconBtn, Txt} from 'mui-extension'
import {Panel} from '../../../shared/Panel'
import {AaInput} from '../../../shared/ItInput/AaInput'
import {Box, Icon, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from '@mui/material'
import {Confirm} from 'mui-extension/lib/Confirm'
import {AaBtn} from '../../../shared/Btn/AaBtn'
import {aiOblasts} from '../../../core/uaLocation/aiOblasts'
import {ItSelect} from 'shared/Select/Select'
import {AnswerTable} from '../shared/AnswerTable'
import {useItToast} from '../../../core/useToast'
import {format} from 'date-fns'
import {Layout} from '../../../shared/Layout'
import {AILocationHelper} from '../../../core/uaLocation/_LocationHelper'
import Answer = KoboFormProtHH.Answer

const mapPopulationGroup = (s: KoboFormProtHH.Status): any => fnSwitch(s, {
  idp: 'IDPs',
  conflict_affected_person: 'Non-Displaced',
  host_community_member: 'Non-Displaced',
  idp_returnee: 'Returnees'
}, _ => 'Non-Displaced')

export const ActivityInfoHHS0 = ({
  serverId = '746f2270-d15a-11ed-afa1-0242ac120002',
  formId = 'aFU8x6tHksveU2c3hK7RUG',
}: {
  serverId?: UUID,
  formId?: string,
  period?: Period
}) => {
  const [period, setPeriod] = useState('2023-03')
  const {api} = useConfig()
  const request = (period?: string) => {
    const filters = period ? (() => {
      const [year, month] = period.split('-')
      return {
        start: new Date(parseInt(year), parseInt(month) - 1),
        end: new Date(parseInt(year), parseInt(month)),
      }
    })() : undefined
    return api.koboForm.getLocalFormAnswers(filters).then(_ => Arr(_.map(KoboFormProtHH.mapAnswers) as Answer[]))
  }
  // const request = (period: string) => {
  //   const [year, month] = period.split('-')
  //   return api.koboModel.getAnswers(serverId, formId, {
  //     start: new Date(parseInt(year), parseInt(month) - 1),
  //     end: new Date(parseInt(year), parseInt(month)),
  //   }).then(_ => Arr(_.data.map(KoboFormProtHH.mapAnswers)))
  // }
  const _hhCurrent = useFetcher(request)

  useEffect(() => {
    _hhCurrent.fetch({clean: false}, period)
  }, [period])

  return (
    <Layout>
      <Page width={1200} loading={_hhCurrent.loading}>
        {map(_hhCurrent.entity, _ => <_ActivityInfo
          data={_}
          period={period}
          setPeriod={setPeriod}
        />)}
      </Page>
    </Layout>
  )
}

const _ActivityInfo = ({
  data,
  period,
  setPeriod,
}: {
  data: KoboFormProtHH.Answer[]
  period: string
  setPeriod: Dispatch<SetStateAction<string>>
}) => {
  const flattedData = data.flatMap(row => {
    return row.persons.map(_ => ({
      ...row,
      ..._,
    }))
  })
  const res = groupByAndTransform(flattedData, [
      _ => _.B_Interviewer_to_in_ert_their_DRC_office ?? 'undef',
      _ => format(_.end, 'yyyy-MM'),
      // _ => _.gender,
      // _ => KoboFormProtHH.groupByAgeGroup(_) ?? 'undef',
    ],
    (_: any[]) => _.length
  )

  const enrichedData = useMemo(() => {
    return chain(Arr(data))
      // .map(fillMissingSexOrGender)
      .map(x => x?.map(_ => ({..._})))
      .map(data => data.map(_ => ({..._, ...koboHromadaMapping[_.id]})))
      .get
  }, [data])

  const {api} = useConfig()
  const _submit = useAsync((i: number, p: AiProtectionHhs.FormParams[]) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  const formParams = useMemo(() => {
    const activities: {rows: Answer[], activity: AiProtectionHhs.FormParams}[] = []
    Enum.entries(enrichedData.groupBy(_ => _._4_What_oblast_are_you_from)).forEach(([oblast, byOblast]) => {
      const middle = Math.ceil(byOblast.length / 2)
      Enum.entries({
        'GP-DRC-00001': Arr([...byOblast].splice(0, Math.ceil(middle))),
        'GP-DRC-00003': Arr([...byOblast].splice(Math.ceil(middle), Math.ceil(byOblast.length))),
      }).forEach(([planCode, byPlanCode]) => {
        Enum.entries(byPlanCode.groupBy(_ => _._4_1_What_raion_currently_living_in)).forEach(([raion, byRaion]) => {
          Enum.entries(byRaion.groupBy(_ => _.hromada)).forEach(([hromada, byHromada]) => {
            if ([oblast, raion, hromada].every(_ => _ === 'undefined')) {
              return
            }
            activities.push({
              rows: byHromada,
              activity: {
                'Plan Code': planCode,
                Oblast: AILocationHelper.findOblast(oblast) ?? (('⚠️' + oblast) as any),
                Raion: AILocationHelper.findRaion(oblast, raion)?._5w ?? AILocationHelper.searchRaionByHromada(hromada) ?? (('⚠️' + raion) as any),
                Hromada: AILocationHelper.findHromada(oblast, raion, hromada)?._5w ?? (('⚠️' + hromada) as any),
                subActivities: Enum.entries(byHromada.groupBy(_ => _._12_Do_you_identify_as_any_of)).map(([populationGroup, byPopulationGroup]) => {
                  try {
                    const persons = byPopulationGroup.flatMap(_ => _.persons) as _Arr<{age: number, gender: KoboFormProtHH.Gender}>
                    const childs = persons.filter(_ => _.age < 18)
                    const adults = persons.filter(_ => _.age >= 18 && !KoboFormProtHH.isElderly(_.age))
                    const elderly = persons.filter(_ => KoboFormProtHH.isElderly(_.age))
                    return {
                      'Reporting Month': period,
                      'Total Individuals Reached': persons.length,
                      'Population Group': mapPopulationGroup(populationGroup),
                      'Adult Men': adults.count(_ => _.gender === 'male'),
                      'Adult Women': adults.count(_ => _.gender === 'female'),
                      'Boys': childs.count(_ => _.gender === 'male'),
                      'Girls': childs.count(_ => _.gender === 'female'),
                      'Elderly Women': elderly.count(_ => _.gender === 'female'),
                      'Elderly Men': elderly.count(_ => _.gender === 'male'),
                    }
                  } catch (e: unknown) {
                    console.error(byPopulationGroup)
                    throw new Error(byPopulationGroup.map(_ => _.id).join(',') + ' ' + (e as Error).message)
                  }
                })
              }
            })
          })
        })
      })
    })
    return activities
  }, [data])

  // const tableData: _Arr<{rows: Answer[], activity: Omit<AiProtectionHhs.FormParams, 'subActivities'> & AiProtectionHhs.FormParams['subActivities'][0]}> = useMemo(() => {
  //   return Arr(formParams.flatMap(({activity: {subActivities, ...rest}, rows}) => subActivities.map(a => ({
  //     rows,
  //     activity: {
  //       ...rest,
  //       ...a
  //     }
  //   }))))
  // }, [formParams])

  const [selectedOblast, setSelectedOblast] = useState<string | undefined>()
  const {toastError} = useItToast()

  return (
    <div>
      <Box sx={{mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box>
          <AaInput type="month" value={period} onChange={_ => setPeriod(_.target.value)}/>
          <ItSelect
            label="Oblast"
            value={selectedOblast?.split('_')[0] ?? ''}
            onChange={_ => setSelectedOblast(_)}
            options={Object.keys(aiOblasts).map(_ => ({value: _, children: _.split('_')[0]}))}
          />
        </Box>
        <AaBtn icon="send" color="primary" variant="contained" loading={_submit.getLoading(-1)} onClick={() => {
          _submit.call(-1, formParams.map(_ => _.activity)).catch(toastError)
        }}>
          Submit all
        </AaBtn>
      </Box>
      <Panel>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Plan Code</TableCell>
              <TableCell>Population Group</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Boys</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Girls</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Adult Women</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Adult Men</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Elderly Women</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Elderly Men</TableCell>
              <TableCell sx={{textAlign: 'right'}}>Total Individuals Reached</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formParams.filter(_ => !selectedOblast || _.activity.Oblast === selectedOblast).map(a => a.activity.subActivities.map((sa, i) =>
              <TableRow>
                {i === 0 && (
                  <>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{width: 0, whiteSpace: 'nowrap'}}>
                      <Tooltip title="Submit!!">
                        <AaBtn
                          loading={_submit.getLoading(i)}
                          variant="contained"
                          size="small"
                          sx={{minWidth: 50, mr: .5}}
                          onClick={() => {
                            _submit.call(i, [a.activity]).catch(toastError)
                          }}
                        >
                          <Icon>send</Icon>
                        </AaBtn>
                      </Tooltip>
                      <Confirm
                        maxWidth={'lg'}
                        title="Kobo data"
                        PaperProps={{}}
                        content={<AnswerTable answers={a.rows}/>}>
                        <Tooltip title="Kobo data">
                          <AaBtn icon="table_view" variant="outlined" size="small">View data</AaBtn>
                        </Tooltip>
                      </Confirm>
                      <Confirm title="Preview activity" content={
                        <pre>{JSON.stringify(a.activity, null, 2)}</pre>
                      }>
                        <Tooltip title="Preview parsed data">
                          <IconBtn color="primary">
                            <Icon>preview</Icon>
                          </IconBtn>
                        </Tooltip>
                      </Confirm>
                      <Confirm title="Preview request body code" content={
                        <pre>{JSON.stringify(AiProtectionHhs.makeForm(a.activity, period, i), null, 2)}</pre>
                      }>
                        <Tooltip title="Preview request body code">
                          <IconBtn color="primary">
                            <Icon>data_object</Icon>
                          </IconBtn>
                        </Tooltip>
                      </Confirm>
                    </TableCell>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{whiteSpace: 'nowrap',}}>
                      {a.activity.Oblast?.split('_')[0] ?? a.activity.Oblast}
                      <Icon sx={{verticalAlign: 'middle'}} color="disabled">chevron_right</Icon>
                      {a.activity.Raion?.split('_')[0] ?? a.activity.Raion}
                      <Icon sx={{verticalAlign: 'middle'}} color="disabled">chevron_right</Icon>
                      {a.activity.Hromada?.split('_')[0] ?? a.activity.Hromada}
                    </TableCell>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{whiteSpace: 'nowrap',}}>
                      {a.activity['Plan Code']}
                    </TableCell>
                  </>
                )}
                <TableCell>{sa['Population Group']}</TableCell>
                <TableCell sx={{textAlign: 'right'}}>{sa.Boys}</TableCell>
                <TableCell sx={{textAlign: 'right'}}>{sa.Girls}</TableCell>
                <TableCell sx={{textAlign: 'right'}}>{sa['Adult Women']}</TableCell>
                <TableCell sx={{textAlign: 'right'}}>{sa['Adult Men']}</TableCell>
                <TableCell sx={{textAlign: 'right'}}>{sa['Elderly Women']}</TableCell>
                <TableCell sx={{textAlign: 'right'}}>{sa['Elderly Men']}</TableCell>
                <TableCell sx={{textAlign: 'right'}}><Txt bold>{sa['Total Individuals Reached']}</Txt></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
