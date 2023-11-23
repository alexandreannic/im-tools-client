import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Bn_OldMpcaNfi} from '@/core/koboModel/Bn_OldMpcaNfi/Bn_OldMpcaNfi'
import {Box, Icon} from '@mui/material'
import {Enum, map, seq, Seq} from '@alexandreannic/ts-utils'
import {mapWashRMM, WashRMM} from './ActivitInfoNFIType'
import {bn_OldMpcaNfiOptions} from '@/core/koboModel/Bn_OldMpcaNfi/Bn_OldMpcaNfiOptions'
import {ActivityInfoActions} from '../shared/ActivityInfoActions'
import {format, subMonths} from 'date-fns'
import {useI18n} from '@/core/i18n'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {Panel} from '@/shared/Panel'
import {AaInput} from '@/shared/ItInput/AaInput'
import {Sheet} from '@/shared/Sheet/Sheet'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {Person} from '@/core/type'
import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'
import {Bn_ReOptions} from '@/core/koboModel/Bn_Re/Bn_ReOptions'

interface Person {
  age: number
  gender: 'male' | 'female'
}

interface Answer {
  id: KoboAnswerId
  start: Date
  oblast: keyof typeof bn_OldMpcaNfiOptions['oblast'] | undefined
  raion: keyof typeof bn_OldMpcaNfiOptions['raion'] | undefined
  hromada: keyof typeof bn_OldMpcaNfiOptions['hromada'] | undefined
  settlement: string,
  HKF_: NonNullable<Bn_OldMpcaNfi['HKF_']>
  HKMV_: NonNullable<Bn_OldMpcaNfi['HKMV_']>
  BK1: NonNullable<Bn_OldMpcaNfi['BK_Baby_Kit_']>
  BK2: NonNullable<Bn_OldMpcaNfi['BK_Baby_Kit']>
  BK3: NonNullable<Bn_OldMpcaNfi['BK_Baby_Kit_001']>
  BK4: NonNullable<Bn_OldMpcaNfi['BK_Baby_Kit_002']>
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
  request: ActiviftyInfoRecords
}

const toFormData = ({
  answers,
  period,
  formId,
}: {
  formId: string
  answers: Seq<Answer>
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
      'Reporting Month': period,
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
      request: ActivityInfoSdk.makeRecordRequest({
        activity: mapWashRMM(activity),
        formId,
        activityIdPrefix: 'drcnfi' + period.replace('-', '') + 'i',
        activityIndex: index
      })
    })
  }

  Enum.entries(answers.groupBy(_ => _.oblast!)).forEach(([oblast, byOblast]) => {
    const enOblast = Bn_ReOptions.ben_det_prev_oblast[oblast]!
    Enum.entries(byOblast.groupBy(_ => _.raion!)).forEach(([raion, byRaion]) => {
      const enRaion = Bn_ReOptions.ben_det_raion[raion]!
      Enum.entries(byRaion.groupBy(_ => _.hromada!)).forEach(([hromada, byHromada]) => {
        const enHromada = Bn_ReOptions.ben_det_hromada[hromada]!
        Enum.entries(byHromada.groupBy(_ => _.settlement)).forEach(([settlement, bySettlement]) => {
          const bySettlementWithPerson = bySettlement.map(_ => ({
            ..._,
            hh_char_hh_det: (_.hh_char_hh_det ?? []).filter(_ => _.age && _.gender)
          })) as Seq<Omit<Answer, 'hh_char_hh_det'> & {hh_char_hh_det: Person[]}>
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
            'Men': planHKPersons.count(_ => _.age >= 18 && _.age < Person.elderlyLimitIncluded && _.gender === 'male'),
            'Women': planHKPersons.count(_ => _.age >= 18 && _.age < Person.elderlyLimitIncluded && _.gender === 'female'),
            'Elderly Men': planHKPersons.count(_ => _.age >= Person.elderlyLimitIncluded && _.gender === 'male'),
            'Elderly Women': planHKPersons.count(_ => _.age >= Person.elderlyLimitIncluded && _.gender === 'female'),
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
    return api.kobo.typedAnswers.searchBn_Re({filters})
      .then(_ => {
        return _.data.filter(_ => !!_.ben_det_settlement).map((_, i) => ({
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
        answers: seq(_),
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
          {m.submitAll} {seq(data).map(_ => _.activity['Total Reached (No Disaggregation)']).sum()}
        </AaBtn>
      </Box>
      <Panel>
        <Sheet<Row> id="ai-nfi" data={data} columns={[
          {
            id: 'actions', head: '', width: 200, render: _ =>
              <>
                <AaBtn
                  tooltip="Submit 🚀"
                  loading={_submit.getLoading(-1)}
                  variant="contained"
                  size="small"
                  sx={{minWidth: 50, mr: .5}}
                  onClick={() => {
                    _submit.call(-1, [_.request]).catch(toastHttpError)
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
          {type: 'string', id: 'Oblast', head: 'Oblast', render: _ => <>{AILocationHelper.get5w(_.activity['Oblast'])}</>},
          {type: 'string', id: 'Raion', head: 'Raion', render: _ => <>{AILocationHelper.get5w(_.activity['Raion'])}</>},
          {type: 'string', id: 'Hromada', head: 'Hromada', render: _ => <>{AILocationHelper.get5w(_.activity['Hromada'])}</>},
          {type: 'string', id: 'Settlement', head: 'Settlement', render: _ => <>{AILocationHelper.get5w(_.activity['Settlement'])}</>},
          {type: 'string', id: 'location', head: 'Location Type', render: _ => <>{_.activity['Location Type']}</>},
          {type: 'string', id: 'population', head: 'Population Group', render: _ => <>{_.activity['Population Group']}</>},
          {type: 'number', id: 'boys', head: 'Boys', render: _ => <>{_.activity['Boys']}</>},
          {type: 'number', id: 'girls', head: 'Girls', render: _ => <>{_.activity['Girls']}</>},
          {type: 'number', id: 'women', head: 'Women', render: _ => <>{_.activity['Women']}</>},
          {type: 'number', id: 'men', head: 'Men', render: _ => <>{_.activity['Men']}</>},
          {type: 'number', id: 'elderly', head: 'Elderly Women', render: _ => <>{_.activity['Elderly Women']}</>},
          {type: 'number', id: 'elderly', head: 'Elderly Men', render: _ => <>{_.activity['Elderly Men']}</>},
          {type: 'number', id: 'people', head: 'People with disability', render: _ => <>{_.activity['People with disability']}</>},
          {type: 'number', id: 'total', head: 'Total Reached (No Disaggregation)', render: _ => <>{_.activity['Total Reached (No Disaggregation)']}</>},
        ]}/>
      </Panel>
    </>
  )
}
