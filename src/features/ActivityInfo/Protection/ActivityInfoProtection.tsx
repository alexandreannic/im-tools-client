import {Page} from '@/shared/Page'
import React, {useEffect, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {endOfDay, endOfMonth, format, startOfMonth, subMonths} from 'date-fns'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {Utils} from '@/utils/utils'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {Sheet} from '@/shared/Sheet/Sheet'
import {AiTypeMpcaRmm} from '@/features/ActivityInfo/Mpca/AiTypeMpcaRmm'
import {Panel} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {AAIconBtn} from '@/shared/IconBtn'
import {AIPreviewActivity, AIPreviewRequest} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {Box} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {Txt} from 'mui-extension'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'

export const ActivityInfoProtection = () => {
  const {api, conf} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {formatLargeNumber, m} = useI18n()
  const {toastHttpError} = useAaToast()

  const _submit = useAsync((i: number, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  const fetcher = useFetcher(async (period: string) => {
    const [year, month] = period.split('-')
    const filters = {
      start: startOfMonth(new Date(+year, +month - 1, 1)),
      end: endOfDay(endOfMonth(new Date(+year, +month - 1, 1))),
    }

    return api.kobo.answer.searchProtection_communityMonitoring({filters}).then(res => {
      // searchProtection_communityMonitoring
      // searchProtection_pss
      // searchProtection_groupSession
      const mapped: (AiTypeMpcaRmm.Type & {oblast?: string, raion?: string})[] = []
      Utils.groupBy({
        data: res.data.filter(_ => _.submissionTime.getTime() >= filters.start.getTime() && _.submissionTime.getTime() <= filters.end.getTime()),
        groups: [
          {by: (_) => OblastIndex.koboOblastIndex[_.ben_det_oblast!] ?? ''},
          {by: (_, [oblast,]) => _.ben_det_raion && AILocationHelper.findRaion(oblast, _.raion)?.en || ''},
          {by: (_, [oblast, raion]) => _.hromada && AILocationHelper.findHromada(oblast, raion, _.hromada)?.en || ''},
          {
            by: _ => fnSwitch(_.benefStatus!, {
              idp: 'IDPs',
              long_res: 'Non-Displaced',
              ret: 'Returnees',
              ref_asy: 'Returnees',
            }, () => 'Unknown')
          },
        ],
        finalTransform: (group, [oblast, raion, Hromada, populationGroup]) => {
          return 1
        },
      })
      return mapped.map((_, i) => ({
        ..._,
        req: ActivityInfoSdk.makeRequest({
          activityIdPrefix: 'drcmpca',
          activity: AiTypeMpcaRmm.map(_),
          activityIndex: i,
          formId: ActivityInfoSdk.formId.mpca,
        })
      }))
    })
  })

  useEffect(() => {
    fetcher.fetch({}, period)
  }, [period])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          header={
            <Box sx={{display: 'flex', alignItems: 'center', flex: 1,}}>
              <AaInput helperText={null} sx={{width: 200}} type="month" value={period} onChange={e => setPeriod(e.target.value)}/>
              <Txt color="hint" sx={{ml: 1}}>
                USD to UAH: <b>{conf.uahToUsd}</b>
              </Txt>
              <AaBtn icon="send" variant="contained" sx={{ml: 'auto'}} onClick={() => {
                if (!fetcher.entity) return
                _submit.call(-1, fetcher.entity.filter(_ => !!_.Hromada).map((_, i) => ActivityInfoSdk.makeRequest({
                  activityIdPrefix: 'drcmpca',
                  activity: AiTypeMpcaRmm.map(_),
                  activityIndex: i,
                  formId: ActivityInfoSdk.formId.mpca,
                }))).catch(toastHttpError)
              }}>
                {m.submitAll}
              </AaBtn>
            </Box>
          }
          loading={fetcher.loading}
          data={fetcher.entity}
          columns={[
            // {id: 'oblast', type: 'string', render: _ => _.oblast},
            // {id: 'raion', type: 'string', render: _ => _.raion},
            {
              width: 120,
              id: 'actions',
              render: (_, i) => {
                return (
                  <>
                    <AAIconBtn disabled={!_.Hromada} color="primary">send</AAIconBtn>
                    <AIPreviewActivity activity={_}/>
                    <AIPreviewRequest request={_.req}/>
                  </>
                )
              }
            },
            {
              id: 'id',
              type: 'string',
              head: 'Record ID',
              render: (_, i) => _.req.changes[0].recordId,
            },
            {head: 'oblast', id: 'oblast', type: 'string', render: _ => _.oblast},
            {head: 'raion', id: 'raion', type: 'string', render: _ => _.raion},
            {head: 'Hromada', id: 'Hromada', type: 'string', render: _ => _.Hromada},
            {head: 'Partner Organization', id: 'Partner Organization', type: 'string', render: _ => _['Partner Organization']},
            {head: 'Population Group', id: 'Population Group', type: 'string', render: _ => _['Population Group']},
            {
              head: 'Amount (USD)',
              id: 'Amount USD',
              type: 'number',
              renderValue: _ => _['Amount of cash in USD distributed through multi-purpose cash assistance'],
              render: _ => formatLargeNumber(_['Amount of cash in USD distributed through multi-purpose cash assistance'], {maximumFractionDigits: 0})
            },
            {width: 0, head: 'Durations', id: 'Durations', type: 'number', render: _ => _['Durations']},
            {width: 0, head: 'Total', id: 'Total', type: 'number', render: _ => formatLargeNumber(_['Total # of people assisted with multi-purpose cash assistance'])},
            {width: 0, head: 'Adult Men', id: 'Adult Men', type: 'number', render: _ => formatLargeNumber(_['Adult Men'])},
            {width: 0, head: 'Adult Women', id: 'Adult Women', type: 'number', render: _ => formatLargeNumber(_['Adult Women'])},
            {width: 0, head: 'Elderly Men', id: 'Elderly Men', type: 'number', render: _ => formatLargeNumber(_['Elderly Men'])},
            {width: 0, head: 'Elderly Women', id: 'Elderly Women', type: 'number', render: _ => formatLargeNumber(_['Elderly Women'])},
            {width: 0, head: 'Boys', id: 'Boys', type: 'number', render: _ => formatLargeNumber(_['Boys'])},
            {width: 0, head: 'Girls', id: 'Girls', type: 'number', render: _ => formatLargeNumber(_['Girls'])},
            {width: 0, head: 'People with disability', id: 'People with disability', type: 'number', render: _ => formatLargeNumber(_['People with disability'])},
          ]}
        />
      </Panel>
    </Page>
  )
}