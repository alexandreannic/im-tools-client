import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {MPCA_NFI} from '@/core/koboModel/MPCA_NFI/MPCA_NFI'
import {Box, Icon} from '@mui/material'
import {_Arr, Arr, Enum, map} from '@alexandreannic/ts-utils'
import {mapWashRMM, WashRMM} from './ActivitInfoNFIType'
import {MPCA_NFIOptions} from '@/core/koboModel/MPCA_NFI/MPCA_NFIOptions'
import {KoboFormProtHH} from '@/core/koboModel/koboFormProtHH'
import {Datatable} from '@/shared/Datatable/Datatable'
import {ActivityInfoActions} from '../shared/ActivityInfoActions'
import {ActivityInfoHelper} from '../shared/activityInfoHelper'
import {format, subMonths} from 'date-fns'
import {useI18n} from '@/core/i18n'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {Panel} from '@/shared/Panel'
import {AaInput} from '@/shared/ItInput/AaInput'
import {BNREOptions} from '@/core/koboModel/BNRE/BNREOptions'

interface Person {
  age: number
  gender: 'male' | 'female'
}

interface Answer {
  id: string
  start: Date
  oblast: keyof typeof MPCA_NFIOptions['oblast'] | undefined
  raion: keyof typeof MPCA_NFIOptions['raion'] | undefined
  hromada: keyof typeof MPCA_NFIOptions['hromada'] | undefined
  settlement: string,
  HKF_: NonNullable<MPCA_NFI['HKF_']>
  HKMV_: NonNullable<MPCA_NFI['HKMV_']>
  BK1: NonNullable<MPCA_NFI['BK_Baby_Kit_']>
  BK2: NonNullable<MPCA_NFI['BK_Baby_Kit']>
  BK3: NonNullable<MPCA_NFI['BK_Baby_Kit_001']>
  BK4: NonNullable<MPCA_NFI['BK_Baby_Kit_002']>
  hh_char_hh_det?: Partial<Person>[]
}

// export const getLocation = <K extends string>(loc: Record<K, string>, name: string, type: string, rows: any): K => {
//   if (name === 'Cnernivetskyi') {
//     name = 'Chernivetskyi'
//   }
//   const mapped = Enum.keys(loc).find(_ => _.includes(name))
//   if (!mapped) {
//     console.error(`Cannot find location ${type} ${name}`, rows)
//   }
//   return mapped!
// }

interface Row {
  rows: Answer[],
  activity: WashRMM
  request: any
}

const toFormData = ({
  answers,
  period,
  formId,
}: {
  formId: string
  answers: _Arr<Answer>
  period: string
}) => {
  const activities: Row[] = []
  let index = 0

  const pushActivity = (
    rows: Answer[],
    a: Pick<WashRMM,
      'WASH - APM' |
      'Boys' |
      'Oblast' |
      'Raion' |
      'Hromada' |
      'Settlement' |
      'Girls' |
      'Men' |
      'Women' |
      'Elderly Women' |
      'Elderly Men' |
      'People with disability' |
      'Total Reached (No Disaggregation)'
    >,
  ) => {
    if (a['Total Reached (No Disaggregation)'] === 0) return
    index++
    const activity = Object.freeze({
      'Reporting Month': 'yyyy-MM',
      'Reporting Against a plan?': 'Yes',
      'Location Type': 'Individuals/households',
      'Population Group': 'Overall (all groups)',
      'Activities & Indicators': '# of individuals benefiting from hygiene kit/items distribution (in-kind)',
      'Breakdown known?': 'Yes',
      'Implementing Partner': 'Danish Refugee Council',
      Organisation: 'Danish Refugee Council',
      'Disaggregation by population group, gender and age known?': 'Yes',
      ...a,
    })
    activities.push({
      rows,
      activity,
      request: ActivityInfoHelper.generateRequest({
        activity: mapWashRMM(activity),
        formId,
        activityIdPrefix: 'drcnfi' + period + 'i',
        activityIndex: index
      })
    })
  }

  console.log(answers.groupBy(_ => _.oblast))
  Enum.entries(answers.groupBy(_ => _.oblast)).forEach(([oblast, byOblast]) => {
    const enOblast = BNREOptions.ben_det_prev_oblast[oblast]
    Enum.entries(byOblast.groupBy(_ => _.raion)).forEach(([raion, byRaion]) => {
      const enRaion = BNREOptions.ben_det_raion[raion]
      Enum.entries(byRaion.groupBy(_ => _.hromada)).forEach(([hromada, byHromada]) => {
        const enHromada = BNREOptions.ben_det_hromada[hromada]
        Enum.entries(byHromada.groupBy(_ => _.settlement)).forEach(([settlement, bySettlement]) => {
          const bySettlementWithPerson = bySettlement.map(_ => ({
            ..._,
            hh_char_hh_det: (_.hh_char_hh_det ?? []).filter(_ => _.age && _.gender)
          })) as _Arr<Omit<Answer, 'hh_char_hh_det'> & {hh_char_hh_det: Person[]}>
          const planBK = bySettlementWithPerson.filter(_ => _.BK1 > 0 || _.BK2 > 0 || _.BK3 > 0 || _.BK4 > 0)
          const planHK = bySettlementWithPerson.filter(_ => _.HKMV_ > 0 || _.HKF_ > 0)
          const planBKPersons = planBK.flatMap(_ => _.hh_char_hh_det).filter(_ => _ && _.age && _.gender)
            .filter(_ => _.age < 3)
          const planHKPersons = planHK.flatMap(_ => _.hh_char_hh_det).filter(_ => _ && _.age && _.gender)
          const location = {
            Oblast: AILocationHelper.findOblast(enOblast) ?? '⚠️' + enOblast,
            Raion: AILocationHelper.findRaion(enOblast, enRaion)?._5w ?? '⚠️' + enRaion,
            Hromada: AILocationHelper.findHromada(enOblast, enRaion, enHromada)?._5w ?? '⚠️' + enHromada,
            Settlement: AILocationHelper.findSettlement(enOblast, enRaion, enHromada, settlement)?._5w ?? '⚠️' + settlement,
          }
          pushActivity(planBK, {
            ...location,
            'WASH - APM': 'DRC-00003',
            'Boys': planBKPersons.filter(_ => _.gender === 'male').length,
            'Girls': planBKPersons.filter(_ => _.gender === 'female').length,
            'Men': 0,
            'Women': 0,
            'Elderly Women': 0,
            'Elderly Men': 0,
            'People with disability': planBK.length,
            'Total Reached (No Disaggregation)': planBKPersons.length,
          })
          pushActivity(planHK, {
            ...location,
            'WASH - APM': 'DRC-00001',
            'Total Reached (No Disaggregation)': planHKPersons.length,
            'Boys': planHKPersons.count(_ => _.age < 18 && _.gender === 'male'),
            'Girls': planHKPersons.count(_ => _.age < 18 && _.gender === 'female'),
            'Men': planHKPersons.count(_ => _.age >= 18 && _.age < KoboFormProtHH.elderlyLimitIncluded && _.gender === 'male'),
            'Women': planHKPersons.count(_ => _.age >= 18 && _.age < KoboFormProtHH.elderlyLimitIncluded && _.gender === 'female'),
            'Elderly Men': planHKPersons.count(_ => _.age >= KoboFormProtHH.elderlyLimitIncluded && _.gender === 'male'),
            'Elderly Women': planHKPersons.count(_ => _.age >= KoboFormProtHH.elderlyLimitIncluded && _.gender === 'female'),
            'People with disability': planHK.length,
          })
        })
      })
    })
  })
  return activities
}

export const ActivityInfoNFI = () => {
  const {api} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))

  const _data = useFetcher((p) => {
    const [year, month] = p.split('-')
    const filters = (year === '2023' && month === '04') ? undefined : {
      start: new Date(parseInt(year), parseInt(month) - 1),
      end: new Date(parseInt(year), parseInt(month)),
    }
    return api.kobo.answer.searchBnre({filters})
      .then(_ => {
        return _.data.filter(_ => !!_.ben_det_settlement).map(_ => ({
          id: _.id,
          oblast: _.ben_det_oblast,
          raion: _.ben_det_raion,
          hromada: _.ben_det_hromada,
          settlement: _.ben_det_settlement,
          start: _.start,
          HKF_: _.nfi_dist_hkf ?? 0,
          HKMV_: _.nfi_dist_hkmv ?? 0,
          BK1: (_.nfi_dist_wkb1 ?? 0) + (_.nfi_dist_bk ?? 0),
          BK2: _.nfi_dist_wkb2 ?? 0,
          BK3: _.nfi_dist_wkb3 ?? 0,
          BK4: _.nfi_dist_wkb4 ?? 0,
          hh_char_hh_det: [
            ...(_.hh_char_hhh_age || _.hh_char_res_gender) ? [{age: _.hh_char_hhh_age, gender: _.hh_char_res_gender}] : [],
            ...(_.hh_char_hh_det ?? []).map(p => ({
              age: p.hh_char_hh_det_age,
              gender: p.hh_char_hh_det_gender,
            }))
          ],
        }))
      })
      .then(_ => toFormData({
        formId: 'crvtph7lg6d5dhq2',
        answers: Arr(_),
        period,
      }))
  })

  useEffect(() => {
    _data.fetch({clean: false}, period)
  }, [period])

  return (
    <Page width={1200} loading={_data.loading}>
      <AaInput type="month" sx={{minWidth: 200, width: 200}} value={period} onChange={_ => setPeriod(_.target.value)}/>
      {map(_data.entity, _ => (
        <_ActivityInfo data={_}/>
      ))}
    </Page>
  )
}

const _ActivityInfo = ({
  data,
  // period,
}: {
  data: Row[]
  // period: Date
}) => {
  const {toastHttpError} = useAaToast()
  const {formatDate} = useI18n()
  const {api} = useAppSettings()
  const {m} = useI18n()
  const _submit = useAsync((i: number, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })
  return (
    <>
      <Box sx={{display: 'flex', mb: 3, alignItems: 'center', justifyContent: 'space-between'}}>
        <AaBtn icon="send" color="primary" variant="contained" loading={_submit.getLoading(-1)} onClick={() => {
          _submit.call(-1, data.map(_ => _.request)).catch(toastHttpError)
        }}>
          {m.submitAll} {Arr(data).map(_ => _.activity['Total Reached (No Disaggregation)']).sum()}
        </AaBtn>
      </Box>
      <Panel>
        <Datatable<Row> data={data} columns={[
          {
            id: 'actions', head: '', render: (_, i) =>
              <>
                <AaBtn
                  tooltip="Submit 🚀"
                  loading={_submit.getLoading(i)}
                  variant="contained"
                  size="small"
                  sx={{minWidth: 50, mr: .5}}
                  onClick={() => {
                    _submit.call(i, [_.request]).catch(toastHttpError)
                  }}
                >
                  <Icon>send</Icon>
                </AaBtn>
                <ActivityInfoActions
                  answers={_.rows}
                  activity={_.activity}
                  requestBody={_.request}
                />
              </>
          },
          {id: 'wash', head: 'WASH - APM', render: _ => <>{_.activity['WASH - APM']}</>},
          {id: 'Oblast', head: 'Oblast', render: _ => <>{AILocationHelper.print5w(_.activity['Oblast'])}</>},
          {id: 'Raion', head: 'Raion', render: _ => <>{AILocationHelper.print5w(_.activity['Raion'])}</>},
          {id: 'Hromada', head: 'Hromada', render: _ => <>{AILocationHelper.print5w(_.activity['Hromada'])}</>},
          {id: 'Settlement', head: 'Settlement', render: _ => <>{AILocationHelper.print5w(_.activity['Settlement'])}</>},
          {id: 'location', head: 'Location Type', render: _ => <>{_.activity['Location Type']}</>},
          {id: 'population', head: 'Population Group', render: _ => <>{_.activity['Population Group']}</>},
          {id: 'boys', head: 'Boys', render: _ => <>{_.activity['Boys']}</>},
          {id: 'girls', head: 'Girls', render: _ => <>{_.activity['Girls']}</>},
          {id: 'women', head: 'Women', render: _ => <>{_.activity['Women']}</>},
          {id: 'men', head: 'Men', render: _ => <>{_.activity['Men']}</>},
          {id: 'elderly', head: 'Elderly Women', render: _ => <>{_.activity['Elderly Women']}</>},
          {id: 'elderly', head: 'Elderly Men', render: _ => <>{_.activity['Elderly Men']}</>},
          {id: 'people', head: 'People with disability', render: _ => <>{_.activity['People with disability']}</>},
          {id: 'total', head: 'Total Reached (No Disaggregation)', render: _ => <>{_.activity['Total Reached (No Disaggregation)']}</>},
        ]}/>
      </Panel>
    </>
  )
}
