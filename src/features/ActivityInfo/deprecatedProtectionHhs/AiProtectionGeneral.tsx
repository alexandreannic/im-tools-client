import {Enum, map, seq, Seq} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState} from 'react'
import {AiTypeProtectionRmm} from '@/features/ActivityInfo/Protection/aiProtectionGeneralInterface'
import {Page} from '@/shared/Page'
import {Txt} from 'mui-extension'
import {Panel} from '@/shared/Panel'
import {IpInput} from '@/shared/Input/Input'
import {Box, Icon, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material'
import {IpBtn} from '@/shared/Btn'
import {AaSelect} from '@/shared/Select/Select'
import {useIpToast} from '@/core/useToast'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {useI18n} from '@/core/i18n'
import {alreadySentKobosInApril} from './missSubmittedData'
import {format, subMonths} from 'date-fns'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Protection/DashboardMonito/dashboardHelper'
import {ActivityInfoActions} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {AiProtectionGeneralType} from '@/features/ActivityInfo/Protection/aiProtectionGeneralType'
import {useAsync} from '@/shared/hook/useAsync'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Person} from '@/core/type/person'
import {PeriodHelper} from '@/core/type/period'
import {Protection_Hhs2} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2'

export const AiProtectionGeneral = () => {
  const {api} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const [selectedOblast, setSelectedOblast] = useState<string | undefined>()

  const request = (period: string) => {
    const filters = period === '2023-04' ? undefined : PeriodHelper.fromYYYYMM(period)
    return api.kobo.typedAnswers.searchProtection_Hhs2({filters}).then(_ => seq(_.data.map(enrichProtHHS_2_1))).then(res => {
      return res
        .filter(_ => {
          const isPartOfAprilSubmit = alreadySentKobosInApril.has(_.id)
          return period === '2023-04' ? isPartOfAprilSubmit : !isPartOfAprilSubmit
        })
    })
  }

  // c
  // onst request = (period: string) => {
  //   const [year, month] = period.split('-')
  //   return api.koboModel.getAnswers(serverId, formId, {
  //     start: new Date(parseInt(year), parseInt(month) - 1),
  //     end: new Date(parseInt(year), parseInt(month)),
  //   }).then(_ => seq(_.data.map(KoboFormProtHH.mapAnswers)))
  // }
  const _hhCurrent = useFetcher(request)

  useEffect(() => {
    _hhCurrent.fetch({clean: false}, period)
  }, [period])

  const filteredData = useMemo(() => {
    return _hhCurrent.get?.filter(_ => !selectedOblast || _.staff_to_insert_their_DRC_office === selectedOblast)
  }, [selectedOblast, _hhCurrent.get])

  return (
    <Page width={1200} loading={_hhCurrent.loading}>
      {map(filteredData, _ => <_ActivityInfo
        action={
          <>
            <IpInput type="month" sx={{width: 200, mr: 1}} value={period} onChange={_ => setPeriod(_.target.value)}/>
            <AaSelect
              sx={{width: 200}}
              label="Oblast"
              defaultValue={selectedOblast?.split('_')[0] ?? ''}
              onChange={_ => setSelectedOblast(_)}
              options={Object.keys(Protection_Hhs2.options.staff_to_insert_their_DRC_office).map(_ => ({value: _, children: _.split('_')[0]}))}
            />
          </>

        }
        data={_}
        period={period}
        setPeriod={setPeriod}
      />)}
    </Page>
  )
}

interface Row {
  rows: ProtHHS2Enrich[],
  activity: AiTypeProtectionRmm.FormParams
  request: any
}

const _ActivityInfo = ({
  data,
  period,
  setPeriod,
  action,
}: {
  action?: ReactNode
  data: Seq<ProtHHS2Enrich>
  period: string
  setPeriod: Dispatch<SetStateAction<string>>
}) => {
  const enrichedData = data

  const {api} = useAppSettings()
  const _submit = useAsync((i: number, p: AiTypeProtectionRmm.FormParams[]) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  const formParams = useMemo(() => {
    const activities: Row[] = []
    let index = 0
    Enum.entries(enrichedData.groupBy(_ => {
      if (!_.tags?.ai) {
        console.warn('No donor', _)
        // throw new Error('No donor')
      }
      return 'OLD'
    })).forEach(([planCode, byPlanCode]) => {
      Enum.entries(byPlanCode.groupBy(_ => _.where_are_you_current_living_oblast)).forEach(([oblast, byOblast]) => {
        Enum.entries(byOblast.filter(_ => _.where_are_you_current_living_raion !== undefined).groupBy(_ => _.where_are_you_current_living_raion)).forEach(([raion, byRaion]) => {
          Enum.entries(byRaion.groupBy(_ => _.where_are_you_current_living_hromada)).forEach(([hromada, byHromada]) => {
            const enOblast = Protection_Hhs2.options.what_is_your_area_of_origin_oblast[oblast]
            const enRaion = Protection_Hhs2.options.what_is_your_area_of_origin_raion[raion]
            const enHromada = Protection_Hhs2.options.what_is_your_area_of_origin_hromada[hromada]
            const activity: AiTypeProtectionRmm.FormParams = {
              'Plan Code': planCode as any,
              Oblast: AILocationHelper.findOblast(enOblast) ?? (('⚠️' + oblast) as any),
              Raion: AILocationHelper.findRaion(enOblast, enRaion)?._5w ?? (('⚠️' + enRaion) as any),
              Hromada: AILocationHelper.findHromada(enOblast, enRaion, enHromada)?._5w ?? (('⚠️' + enHromada) as any),
              subActivities: Enum.entries(byHromada.groupBy(_ => AiProtectionGeneralType.mapStatus(_.do_you_identify_as_any_of_the_following))).map(([populationGroup, byPopulationGroup]) => {
                try {
                  const persons = byPopulationGroup.flatMap(_ => _.persons).compactBy('age').compactBy('gender')
                  const childs = persons.filter(_ => _.age < 18)
                  const adults = persons.filter(_ => _.age >= 18 && !Person.isElderly(_.age))
                  const elderly = persons.filter(_ => Person.isElderly(_.age))
                  return {
                    'Protection Indicators': '# of persons reached through protection monitoring',
                    'Reporting Month': period,
                    'Total Individuals Reached': persons.length,
                    'Population Group': populationGroup as any,
                    'Adult Men': adults.count(_ => _.gender === 'Male'),
                    'Adult Women': adults.count(_ => _.gender === 'Female'),
                    'Boys': childs.count(_ => _.gender === 'Male'),
                    'Girls': childs.count(_ => _.gender === 'Female'),
                    'Elderly Women': elderly.count(_ => _.gender === 'Female'),
                    'Elderly Men': elderly.count(_ => _.gender === 'Male'),
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
              request: AiTypeProtectionRmm.makeForm(activity, period, index++)
            })
          })
        })
      })
    })
    return activities
  }, [data])

  const {m} = useI18n()
  const {toastHttpError} = useIpToast()

  return (
    <div>
      <Box sx={{mb: 2, display: 'flex', alignItems: 'center'}}>
        <IpBtn sx={{marginRight: 'auto'}} icon="send" color="primary" variant="contained" loading={_submit.loading[-1]} onClick={() => {
          _submit.call(-1, formParams.map((_, i) => _.request)).catch(toastHttpError)
        }}>
          {m.submitAll} {data.length} {data.sum(_ => _.how_many_ind ?? 0)}
        </IpBtn>
        {action}
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
            {formParams.map((a, i) => a.activity.subActivities.map((sa, j) =>
              <TableRow key={j}>
                {j === 0 && (
                  <>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{width: 0, whiteSpace: 'nowrap'}}>
                      <IpBtn
                        tooltip="Submit 🚀"
                        loading={_submit.loading[i]}
                        variant="contained"
                        size="small"
                        sx={{minWidth: 50, mr: .5}}
                        onClick={() => {
                          _submit.call(i, [a.request]).catch(toastHttpError)
                        }}
                      >
                        <Icon>send</Icon>
                      </IpBtn>
                      <ActivityInfoActions
                        data={a.rows}
                        activity={a.activity}
                        requestBody={a.request}
                      />
                    </TableCell>
                    <TableCell rowSpan={a.activity.subActivities.length} sx={{whiteSpace: 'nowrap',}}>
                      {AILocationHelper.get5w(a.activity.Oblast)}
                      <Icon sx={{verticalAlign: 'middle'}} color="disabled">chevron_right</Icon>
                      {AILocationHelper.get5w(a.activity.Raion)}
                      <Icon sx={{verticalAlign: 'middle'}} color="disabled">chevron_right</Icon>
                      {AILocationHelper.get5w(a.activity.Hromada)}
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
