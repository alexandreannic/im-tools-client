import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {_Arr, Arr, Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {KoboFormProtHH} from '@/core/koboModel/koboFormProtHH'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {AiProtectionHhs} from '@/features/ActivityInfo/HHS_2_1/activityInfoInterface'
import {chain} from '@/utils/utils'
import {Page} from '@/shared/Page'
import {IconBtn, Txt} from 'mui-extension'
import {Panel} from '@/shared/Panel'
import {AaInput} from '@/shared/ItInput/AaInput'
import {Box, Icon, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from '@mui/material'
import {Confirm} from 'mui-extension/lib/Confirm'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {aiOblasts} from '@/core/uaLocation/aiOblasts'
import {AaSelect} from '@/shared/Select/Select'
import {AnswerTable} from '../shared/AnswerTable'
import {useAaToast} from '@/core/useToast'
import {Donor} from '../../Dashboard/DashboardHHS2/DashboardProtHHS2'
import {ProtHHS_2_1Options} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {useI18n} from '@/core/i18n'
import {alreadySentKobosInApril} from './missSubmittedData'
import {format, subMonths} from 'date-fns'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'

const mapPopulationGroup = (s: (keyof typeof ProtHHS_2_1Options['do_you_identify_as_any_of_the_following']) | undefined): any => fnSwitch(s!, {
  returnee: 'Returnees',
  non_displaced: 'Non-Displaced',
  idp: 'IDPs',
  refugee: 'Non-Displaced',
}, _ => 'Non-Displaced')

const planCode: Record<Donor, AiProtectionHhs.GET<'Plan Code'>> = {
  // [Donor.ECHO_UKR000322]: 'GP-DRC-00001',//ECHO
  [Donor.NN2_UKR000298]: 'GP-DRC-00002',//Novo Nordisk ------
  [Donor.BHA_UKR000284]: 'GP-DRC-00003',//BHA OK
  [Donor.OKF_UKR000309]: 'GP-DRC-00004',//OKF ------
  [Donor.UHF_IV_UKR000314]: 'GP-DRC-00005',//UHF
  [Donor.ECHO_UKR000322]: 'GP-DRC-00006',//ECHO
  // [Donor.D] MoF: 'GP-DRC-00007',//Danish
}

export const ActivityInfoHHS2 = () => {
  const {api} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))

  const request = (period: string) => {
    const [year, month] = period.split('-')
    const filters = (year === '2023' && month === '04') ? undefined : {
      start: new Date(parseInt(year), parseInt(month) - 1),
      end: new Date(parseInt(year), parseInt(month)),
    }
    return api.kobo.answer.searchProtHhs({filters}).then(_ => Arr(_.data.map(enrichProtHHS_2_1))).then(_ => {
      return _.filter(_ => {
        const isPartOfAprilSubmit = alreadySentKobosInApril.has(_.id)
        return year === '2023' && month === '04' ? isPartOfAprilSubmit : !isPartOfAprilSubmit
      })
    })
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
    <Page width={1200} loading={_hhCurrent.loading}>
      <AaInput type="month" sx={{minWidth: 200}} value={period} onChange={_ => setPeriod(_.target.value)}/>
      {map(_hhCurrent.entity, _ => <_ActivityInfo
        data={_}
        period={period}
        setPeriod={setPeriod}
      />)}
    </Page>
  )
}

interface Row {
  rows: ProtHHS2Enrich[],
  activity: AiProtectionHhs.FormParams
  request: any
}

const _ActivityInfo = ({
  data,
  period,
  setPeriod,
}: {
  data: _Arr<ProtHHS2Enrich>
  period: string
  setPeriod: Dispatch<SetStateAction<string>>
}) => {
  const enrichedData = data

  const {api} = useAppSettings()
  const _submit = useAsync((i: number, p: AiProtectionHhs.FormParams[]) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  const formParams = useMemo(() => {
    const activities: Row[] = []
    let index = 0
    Enum.entries(enrichedData.groupBy(_ => {
      if(!_.tags?.ai){
        console.warn('No donor', _)
        throw new Error('No donor')
      }
      return planCode[_.tags.ai]
    })).forEach(([planCode, byPlanCode]) => {
      Enum.entries(byPlanCode.groupBy(_ => _.where_are_you_current_living_oblast)).forEach(([oblast, byOblast]) => {
        Enum.entries(byOblast.filter(_ => _.where_are_you_current_living_raion !== undefined).groupBy(_ => _.where_are_you_current_living_raion)).forEach(([raion, byRaion]) => {
          Enum.entries(byRaion.groupBy(_ => _.where_are_you_current_living_hromada)).forEach(([hromada, byHromada]) => {
            const enOblast = ProtHHS_2_1Options.what_is_your_area_of_origin_oblast[oblast]
            const enRaion = ProtHHS_2_1Options.what_is_your_area_of_origin_raion[raion]
            const enHromada = ProtHHS_2_1Options.what_is_your_area_of_origin_hromada[hromada]
            const activity: AiProtectionHhs.FormParams = {
              'Plan Code': planCode,
              Oblast: AILocationHelper.findOblast(enOblast) ?? (('⚠️' + oblast) as any),
              Raion: AILocationHelper.findRaion(enOblast, enRaion)?._5w ?? (('⚠️' + enRaion) as any),
              Hromada: AILocationHelper.findHromada(enOblast, enRaion, enHromada)?._5w ?? (('⚠️' + enHromada) as any),
              subActivities: Enum.entries(byHromada.groupBy(_ => mapPopulationGroup(_.do_you_identify_as_any_of_the_following))).map(([populationGroup, byPopulationGroup]) => {
                try {
                  const persons = byPopulationGroup.flatMap(_ => _.persons) as _Arr<{age: number, gender: KoboFormProtHH.Gender}>
                  const childs = persons.filter(_ => _.age < 18)
                  const adults = persons.filter(_ => _.age >= 18 && !KoboFormProtHH.isElderly(_.age))
                  const elderly = persons.filter(_ => KoboFormProtHH.isElderly(_.age))
                  return {
                    'Reporting Month': period,
                    'Total Individuals Reached': persons.length,
                    'Population Group': populationGroup as any,
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
            activities.push({
              rows: byHromada,
              activity,
              request: AiProtectionHhs.makeForm(activity, period, index++)
            })
          })
        })
      })
    })
    return activities
  }, [data])

  const {m} = useI18n()
  const [selectedOblast, setSelectedOblast] = useState<string | undefined>()
  const {toastHttpError} = useAaToast()

  return (
    <div>
      <Box sx={{mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box sx={{display: 'flex', '& > *': {mr: 1}}}>
          <AaSelect
            sx={{minWidth: 200}}
            label="Oblast"
            value={selectedOblast?.split('_')[0] ?? ''}
            onChange={_ => setSelectedOblast(_)}
            options={Object.keys(aiOblasts).map(_ => ({value: _, children: _.split('_')[0]}))}
          />
        </Box>
        <AaBtn icon="send" color="primary" variant="contained" loading={_submit.getLoading(-1)} onClick={() => {
          _submit.call(-1, formParams.map((_, i) => _.request)).catch(toastHttpError)
        }}>
          {m.submitAll} {data.length}
        </AaBtn>
      </Box>
      <Panel sx={{overflowX: 'auto'}}>
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
            {formParams.filter(_ => !selectedOblast || _.activity.Oblast === selectedOblast).map((a, i) => a.activity.subActivities.map((sa, j) =>
              <TableRow key={j}>
                {j === 0 && (
                  <>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{width: 0, whiteSpace: 'nowrap'}}>
                      <Tooltip title="Submit!!">
                        <AaBtn
                          loading={_submit.getLoading(i)}
                          variant="contained"
                          size="small"
                          sx={{minWidth: 50, mr: .5}}
                          onClick={() => {
                            _submit.call(i, [a.request]).catch(toastHttpError)
                          }}
                        >
                          <Icon>send</Icon>
                        </AaBtn>
                      </Tooltip>
                      <Confirm
                        maxWidth={'lg'}
                        title="DatabaseLayout data"
                        content={<AnswerTable answers={a.rows}/>}>
                        <Tooltip title="DatabaseLayout data">
                          <AaBtn icon="table_view" variant="outlined" size="small">{m.viewData}</AaBtn>
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
                        <pre>{JSON.stringify(a.request, null, 2)}</pre>
                      }>
                        <Tooltip title="Preview request body code">
                          <IconBtn color="primary">
                            <Icon>data_object</Icon>
                          </IconBtn>
                        </Tooltip>
                      </Confirm>
                    </TableCell>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{whiteSpace: 'nowrap',}}>
                      {AILocationHelper.print5w(a.activity.Oblast)}
                      <Icon sx={{verticalAlign: 'middle'}} color="disabled">chevron_right</Icon>
                      {AILocationHelper.print5w(a.activity.Raion)}
                      <Icon sx={{verticalAlign: 'middle'}} color="disabled">chevron_right</Icon>
                      {AILocationHelper.print5w(a.activity.Hromada)}
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
