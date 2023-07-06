import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
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
import {addMonths, format, startOfMonth} from 'date-fns'
import {useI18n} from '@/core/i18n'
import {fixLocations} from './activityInfoNFIFix'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {Panel} from '@/shared/Panel'
import {Txt} from 'mui-extension'

interface Answer {
  file: string
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
  group_in3fh72: NonNullable<MPCA_NFI['group_in3fh72']>
}

export const getLocation = <K extends string>(loc: Record<K, string>, name: string, type: string, rows: any): K => {
  if (name === 'Cnernivetskyi') {
    name = 'Chernivetskyi'
  }
  const mapped = Enum.keys(loc).find(_ => _.includes(name))
  if (!mapped) {
    console.error(`Cannot find location ${type} ${name}`, rows)
  }
  return mapped!
}

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
  period: Date
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
      'Reporting Month': format(period, 'yyyy-MM'),
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
        activityIdPrefix: 'drcnfi' + format(period, 'yyyyMM') + 'i',
        activityIndex: index
      })
    })
  }

  Enum.entries(answers.groupBy(_ => _.oblast)).forEach(([oblast, byOblast]) => {
    const enOblast = MPCA_NFIOptions.oblast[oblast]
    Enum.entries(byOblast.groupBy(_ => _.raion)).forEach(([raion, byRaion]) => {
      const enRaion = MPCA_NFIOptions.raion[raion]
      Enum.entries(byRaion.groupBy(_ => _.hromada)).forEach(([hromada, byHromada]) => {
        const enHromada = MPCA_NFIOptions.hromada[hromada]
        Enum.entries(byHromada.groupBy(_ => _.settlement)).forEach(([settlement, bySettlement]) => {
          const planBK = bySettlement.filter(_ => _.BK1 > 0 || _.BK2 > 0 || _.BK3 > 0 || _.BK4 > 0)
          const planHK = bySettlement.filter(_ => _.HKMV_ > 0 || _.HKF_ > 0)
          const planBKPersons = planBK.flatMap(_ => _.group_in3fh72)
            .filter(_ => _.AgeHH !== undefined && _.AgeHH < 3 && _.GenderHH !== undefined) as _Arr<{
            AgeHH: number,
            GenderHH: keyof typeof MPCA_NFIOptions['GenderHH']
          }>
          const planHKPersons = planHK.flatMap(_ => _.group_in3fh72)
            .filter(_ => _.AgeHH !== undefined && _.GenderHH !== undefined) as _Arr<{
            AgeHH: number,
            GenderHH: keyof typeof MPCA_NFIOptions['GenderHH']
          }>
          const location = {
            Oblast: AILocationHelper.findOblast(enOblast) ?? '⚠️' + enOblast,
            Raion: AILocationHelper.findRaion(enOblast, enRaion)?._5w ?? '⚠️' + enRaion,
            Hromada: AILocationHelper.findHromada(enOblast, enRaion, enHromada)?._5w ?? '⚠️' + enHromada,
            Settlement: AILocationHelper.findSettlement(enOblast, enRaion, enHromada, settlement)?._5w ?? '⚠️' + settlement,
          }
          pushActivity(planBK, {
            ...location,
            'WASH - APM': 'DRC-00003',
            'Boys': planBKPersons.filter(_ => _.GenderHH === 'male').length,
            'Girls': planBKPersons.filter(_ => _.GenderHH === 'female').length,
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
            'Boys': planHKPersons.count(_ => _.AgeHH < 18 && _.GenderHH === 'male'),
            'Girls': planHKPersons.count(_ => _.AgeHH < 18 && _.GenderHH === 'female'),
            'Men': planHKPersons.count(_ => _.AgeHH >= 18 && _.AgeHH < KoboFormProtHH.elderlyLimitIncluded && _.GenderHH === 'male'),
            'Women': planHKPersons.count(_ => _.AgeHH >= 18 && _.AgeHH < KoboFormProtHH.elderlyLimitIncluded && _.GenderHH === 'female'),
            'Elderly Men': planHKPersons.count(_ => _.AgeHH >= KoboFormProtHH.elderlyLimitIncluded && _.GenderHH === 'male'),
            'Elderly Women': planHKPersons.count(_ => _.AgeHH >= KoboFormProtHH.elderlyLimitIncluded && _.GenderHH === 'female'),
            'People with disability': planHK.length,
          })
        })
      })
    })
  })
  return activities
}

const computePeriod = (date: Date) => {
  const start = startOfMonth(date)
  return {
    start,
    end: addMonths(start, 1)
  }
}

export const ActivityInfoNFI = () => {
  const [period, setPeriod] = useState(new Date(2023, 4, 1))
  const {api} = useAppSettings()
  const filters = computePeriod(period)

  const _data = useFetcher((period: Date) => {
    return Promise.all([
      api.koboApi.getAnswersMPCA_NFI_Myko({filters}).then(_ => {
        return _.data.map(_ => ({
          file: 'Myko',
          id: _.id,
          oblast: 'mykolaivska' as any,
          raion: undefined as any,
          hromada: undefined as any,
          settlement: undefined!,
          start: _.start,
          HKF_: _.HKF_ ?? 0,
          HKMV_: _.HKMV_ ?? 0,
          BK1: _.BK4_How_many ?? 0,
          BK2: _.BK4_How_many ?? 0,
          BK3: _.BK4_How_many ?? 0,
          BK4: _.BK4_How_many ?? 0,
          group_in3fh72: _.group_in3fh72,
        }))
      }),
      api.koboApi.getAnswersMPCA_NFI_NAA({filters}).then(_ => {
        return _.data.map(_ => ({
          file: 'NAA',
          id: _.id,
          oblast: 'kharkivska' as any,
          raion: 'kharkivskyi' as any,
          hromada: 'kharkivska_2' as any,
          settlement: undefined!,
          start: _.start,
          HKF_: _.HKF_ ?? 0,
          HKMV_: _.HKMV_ ?? 0,
          BK1: _.BK1_How_many ?? 0,
          BK2: _.BK2_How_many ?? 0,
          BK3: _.BK3_How_many ?? 0,
          BK4: _.BK4_How_many ?? 0,
          group_in3fh72: _.group_in3fh72,
        }))
      }),
      api.koboApi.getAnswersMPCA_NFI({filters})
        .then(_ => fixLocations(_.data))
        .then(_ => {
          return _.map(_ => ({
            file: 'Main',
            id: _.id,
            oblast: _.oblast,
            hromada: _.hromada,
            raion: _.raion,
            settlement: _.settlement!,
            start: _.start,
            HKF_: _.HKF_ ?? 0,
            HKMV_: _.HKMV_ ?? 0,
            BK1: _.BK_Baby_Kit_ ?? 0,
            BK2: _.BK_Baby_Kit ?? 0,
            BK3: _.BK_Baby_Kit_001 ?? 0,
            BK4: _.BK_Baby_Kit_002 ?? 0,
            group_in3fh72: _.group_in3fh72,
          }))
        }),
    ]).then(([myko, naa, main]) => toFormData({
      formId: 'crvtph7lg6d5dhq2',
      answers: Arr([
        ...myko,
        ...main,
        ...naa
      ]),
      period,
    }))
  })

  useEffect(() => {
    _data.fetch({clean: false}, period)
  }, [period])

  return (
    <Page width={1200} loading={_data.loading}>
      {map(_data.entity, _ => (
        <_ActivityInfo
          data={_}
          period={period}
          setPeriod={setPeriod}
        />
      ))}
    </Page>
  )
}

const _ActivityInfo = ({
  data,
  period,
  setPeriod,
}: {
  data: Row[]
  period: Date
  setPeriod: Dispatch<SetStateAction<Date>>
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
        <Txt bold fontSize="big">
          {formatDate(computePeriod(period).start)}
          {' - '}
          {formatDate(computePeriod(period).end)}
        </Txt>
        <AaBtn icon="send" color="primary" variant="contained" loading={_submit.getLoading(-1)} onClick={() => {
          _submit.call(-1, data.map(_ => _.request)).catch(toastHttpError)
        }}>
          {m.submitAll}
        </AaBtn>
      </Box>
      <Panel>
        <Datatable<Row> data={data} columns={[
          {
            id: 'actions', head: '', render: (_, i) =>
              <>
                <AaBtn
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
