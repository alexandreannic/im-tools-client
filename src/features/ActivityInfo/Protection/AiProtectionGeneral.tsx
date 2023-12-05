import {Page} from '@/shared/Page'
import React, {useEffect, useMemo, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {endOfDay, endOfMonth, format, startOfMonth, subMonths} from 'date-fns'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Panel} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {AAIconBtn} from '@/shared/IconBtn'
import {AIPreviewActivity, AIPreviewRequest, AIViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {Box} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {ActivityInfoProtectionMapper} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {Utils} from '@/utils/utils'
import {Enum, seq} from '@alexandreannic/ts-utils'
import {AiTypeProtectionRmm} from '@/features/ActivityInfo/Protection/aiProtectionGeneralInterface'
import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'

export const AiProtectionGeneral = () => {
  const {api, conf} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {formatLargeNumber, m} = useI18n()
  const {toastHttpError} = useAaToast()

  const _submit = useAsync((id: string, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  const fetcher = useFetcher(async (period: string) => {
    const [year, month] = period.split('-')
    const filters = {
      start: startOfMonth(new Date(+year, +month - 1, 1)),
      end: endOfDay(endOfMonth(new Date(+year, +month - 1, 1))),
    }
    const mappedData = await Promise.all([
      // searchProtection_pss
      api.kobo.typedAnswers.searchProtection_groupSession({filters}).then(ActivityInfoProtectionMapper.mapGroupSession(period)),
      api.kobo.typedAnswers.searchProtection_communityMonitoring({filters}).then(ActivityInfoProtectionMapper.mapCommunityMonitoring(period)),
      api.kobo.typedAnswers.searchProtection_Hhs2({filters}).then(ActivityInfoProtectionMapper.mapHhs(period)),
    ]).then(_ => _.reduce((acc, curr) => [...acc, ...curr], []))
      .then(_ => _.filter(_ => {
        const hasAlreadyBeenSubmittedManually = period === '2023-09'
          && _.Oblast === 'Dnipropetrovska_Дніпропетровська'
          && (
            _['Protection Indicators'] === '# of key informants reached through community level protection monitoring' ||
            _['Protection Indicators'] === '# of persons who participated in awareness raising activities - GP'
          )
        return !hasAlreadyBeenSubmittedManually
      }))

    // const form: (AiProtectionGeneralType.Data & {
    //   answer: any[]
    // })[] = []
    const form: {
      params: AiTypeProtectionRmm.FormParams
      answers: any[]
      request: ActiviftyInfoRecords
    }[] = []
    let i = 0
    Utils.groupBy({
      data: mappedData,
      groups: [
        {by: _ => _.Oblast ?? ''},
        {by: _ => _.Raion ?? ''},
        {by: _ => _.Hromada ?? ''},
        {by: _ => _['Plan Code'] ?? ''},
        // {by: _ => _['Population Group']},
        // {by: _ => _['Protection Indicators']},
      ],
      finalTransform: (grouped, [Oblast, Raion, Hromada, PlanCode]) => {
        // form.push({
        //   answer: group,
        //   Oblast,
        //   Raion,
        //   Hromada,
        //   'Plan Code': PlanCode,
        //   'Population Group': populationGroup,
        //   'Reporting Month': period,
        //   'Protection Indicators': indicator,
        //   'Adult Men': group.sum(_ => _['Adult Men']),
        //   'Adult Women': group.sum(_ => _['Adult Women']),
        //   'Boys': group.sum(_ => _['Boys']),
        //   'Girls': group.sum(_ => _['Girls']),
        //   'Elderly Women': group.sum(_ => _['Elderly Women']),
        //   'Elderly Men': group.sum(_ => _['Elderly Men']),
        //   'Total Individuals Reached': group.sum(_ => _['Total Individuals Reached']),
        // })
        const activity = {
          Oblast,
          Raion,
          Hromada,
          'Plan Code': PlanCode,
          subActivities: Enum.entries(grouped.groupBy(_ => _['Protection Indicators'])).flatMap(([indicator, byIndicator]) => {
            return Enum.entries(byIndicator.groupBy(_ => _['Population Group'])).map(([group, v]) => {
              return {
                'Protection Indicators': indicator,
                'Population Group': group,
                'Reporting Month': period,
                'Adult Men': v.sum(_ => _['Adult Men']),
                'Adult Women': v.sum(_ => _['Adult Women']),
                'Boys': v.sum(_ => _['Boys']),
                'Girls': v.sum(_ => _['Girls']),
                'Elderly Women': v.sum(_ => _['Elderly Women']),
                'Elderly Men': v.sum(_ => _['Elderly Men']),
                'Total Individuals Reached': v.sum(_ => _['Total Individuals Reached']),
              }
            })
          })
        }
        form.push({
          params: activity,
          request: AiTypeProtectionRmm.makeForm(activity, period, i++),
          answers: grouped.map(_ => _.answer),
        })
      },
    })
    return form
    // return mapped.map((_, i) => ({
    //   ..._,
    //   req: ActivityInfoSdk.makeRequest({
    //     activityIdPrefix: 'drcmpca',
    //     activity: AiTypeMpcaRmm.map(_),
    //     activityIndex: i,
    //     formId: ActivityInfoSdk.formId.mpca,
    //   })
    // }))
  })

  useEffect(() => {
    fetcher.fetch({}, period)
  }, [period])

  const flatData = useMemo(() => fetcher.entity?.flatMap(d => {
    return d.params.subActivities.map(a => {
      return {
        id: d.request.changes[0].recordId,
        Oblast: d.params.Oblast,
        Raion: d.params.Raion,
        Hromada: d.params.Hromada,
        'Plan Code': d.params['Plan Code'],
        ...a,
      }
    })
  }), [fetcher.entity])

  const indexActivity = useMemo(() => {
    const gb = seq(fetcher.entity)?.groupBy(_ => _.request.changes[0].recordId)
    return new Enum(gb).transform((k, v) => {
      if (v.length !== 1) throw new Error('Should contains 1 request by ID.')
      return [k, v[0]]
    }).get()
  }, [fetcher.entity])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          id="ai-prot"
          header={
            <Box sx={{display: 'flex', alignItems: 'center', flex: 1,}}>
              <AaInput helperText={null} sx={{width: 200}} type="month" value={period} onChange={e => setPeriod(e.target.value)}/>
              <AaBtn icon="send" variant="contained" sx={{ml: 'auto'}} onClick={() => {
                if (!fetcher.entity) return
                _submit.call('all', fetcher.entity.map(_ => _.request)).catch(toastHttpError)
              }}>
                {m.submitAll}
              </AaBtn>
            </Box>
          }
          loading={fetcher.loading}
          data={flatData}
          columns={[
            {
              width: 150,
              id: 'actions',
              render: _ => {
                return (
                  <>
                    <AAIconBtn
                      disabled={!_.Hromada} color="primary"
                      onClick={() => {
                        _submit.call(_.id, [indexActivity[_.id]!.request]).catch(toastHttpError)
                      }}
                    >send</AAIconBtn>
                    <AIViewAnswers answers={indexActivity[_.id]!.answers}/>
                    <AIPreviewActivity activity={indexActivity[_.id]!.params}/>
                    <AIPreviewRequest request={indexActivity[_.id]!.request}/>
                  </>
                )
              }
            },
            {
              id: 'id',
              type: 'string',
              head: 'ID',
              render: _ => _.id,
            },
            {head: 'Oblast', id: 'Oblast', type: 'string', render: _ => _.Oblast},
            {head: 'Raion', id: 'Raion', type: 'string', render: _ => _.Raion},
            {head: 'Hromada', id: 'Hromada', type: 'string', render: _ => _.Hromada},
            {head: 'Plan Code', id: 'Plan Code', type: 'string', render: _ => _['Plan Code']},
            {head: 'Population Group', id: 'Population Group', type: 'string', render: _ => _['Population Group']},
            {
              head: 'Protection Indicators',
              id: 'Protection Indicators',
              options: () => seq(flatData).map(_ => _['Protection Indicators']).distinct(_ => _).map(SheetUtils.buildOption),
              type: 'select_one',
              render: _ => _['Protection Indicators'],
            },
            {width: 0, head: 'Adult Men', id: 'Adult Men', type: 'number', render: _ => formatLargeNumber(_['Adult Men'])},
            {width: 0, head: 'Adult Women', id: 'Adult Women', type: 'number', render: _ => formatLargeNumber(_['Adult Women'])},
            {width: 0, head: 'Elderly Men', id: 'Elderly Men', type: 'number', render: _ => formatLargeNumber(_['Elderly Men'])},
            {width: 0, head: 'Elderly Women', id: 'Elderly Women', type: 'number', render: _ => formatLargeNumber(_['Elderly Women'])},
            {width: 0, head: 'Boys', id: 'Boys', type: 'number', render: _ => formatLargeNumber(_['Boys'])},
            {width: 0, head: 'Girls', id: 'Girls', type: 'number', render: _ => formatLargeNumber(_['Girls'])},
            {width: 0, head: 'Total Individuals Reached', id: 'Total Individuals Reached', type: 'number', render: _ => formatLargeNumber(_['Total Individuals Reached'])},
          ]}
        />
      </Panel>
    </Page>
  )
}