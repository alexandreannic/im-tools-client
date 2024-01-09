import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useMemo, useState} from 'react'
import {format, subMonths} from 'date-fns'
import {useI18n} from '@/core/i18n'
import {useAaToast} from '@/core/useToast'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {PeriodHelper, Person} from '@/core/type'
import {AiBundle} from '@/features/ActivityInfo/shared/AiType'
import {Utils} from '@/utils/utils'
import {Enum, fnSwitch, Seq, seq} from '@alexandreannic/ts-utils'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {Panel} from '@/shared/Panel'
import {Page} from '@/shared/Page'
import {AiGbvInterface} from '@/features/ActivityInfo/Gbv/aiGbvInterface'
import {DrcProject} from '@/core/drcUa'
import {Sheet} from '@/shared/Sheet/Sheet'
import {AaInput} from '@/shared/ItInput/AaInput'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {AAIconBtn} from '@/shared/IconBtn'
import {AIPreviewActivity, AIPreviewRequest, AiSendBtn, AIViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {AaBtn} from '@/shared/Btn/AaBtn'

type AiGbvBundle = AiBundle<AiGbvInterface.Type>

export const AiGbv = () => {
  const {api, conf} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {formatLargeNumber, m} = useI18n()
  const {toastHttpError} = useAaToast()

  const _submit = useAsync((id: string, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  const req = (periodStr: string) => {
    const period = PeriodHelper.fromYYYYMM(periodStr)
    return api.kobo.typedAnswers.searchProtection_gbv({filters: period}).then(_ => {
      const mapped: AiGbvBundle[] = []
      let index = 0
      const flatData = seq(_.data).flatMap(_ => {
        return _.hh_char_hh_det?.map(hh => ({
          ...getAiLocation(_),
          ..._,
          ...hh,
        }))
      }).compact()
      Utils.groupBy({
        data: flatData,
        groups: [
          {by: _ => _.Oblast!},
          {by: _ => _.Raion!},
          {by: _ => _.Hromada!},
          {by: _ => _.project!},
          {by: _ => _.activity!},
        ],
        finalTransform: (grouped, [Oblast, Raion, Hromada, project]) => {
          const subActivities: AiGbvInterface.SubActivity[] = []
          Utils.groupBy({
            data: grouped.filter(_ => !!_.activity && _.activity !== 'other'),
            groups: [
              {by: _ => _.hh_char_hh_det_status ?? 'non-displaced'},
              {by: _ => _.activity!},
            ],
            finalTransform: (byActivity, [status, activity]) => {
              const persons: Seq<Person.Person> = byActivity
                .filter(_ => _.hh_char_hh_det_gender && _.hh_char_hh_det_age)
                .map(_ => ({
                  age: _.hh_char_hh_det_age,
                  gender: fnSwitch(_.hh_char_hh_det_gender!, {
                    male: Person.Gender.Male,
                    female: Person.Gender.Female,
                  }, () => {
                    throw new Error('Should be filtered.')
                  })
                }))
              const disaggregation = Person.groupByGenderAndGroup(Person.ageGroup.UNHCR)(persons)
              subActivities.push({
                  'Protection Indicators': fnSwitch(activity, {
                    'pssac': `# of GBV survivors and people at risk provided with specialized GBV PSS assistance that meet minimum standards`,
                    'wgss': `# of women and girls who received recreational and livelihood skills including vocational education sessions in women and girls safe spaces`,
                    'ddk': `# of women and girls who received dignity kits`,
                    'gbvis': `# of persons received information on GBV services, referrals, preventive and risk mitigation action`,
                    'ngbv': `Non-GBV actors trained on GBV`,
                    'gbva': `GBV actors trained in GBV`,
                    'gcva': `GBV survivors and those at risk supported with cash/voucher assistance.`,
                    'glac': `GBV survivors and those at risk supported with legal assistance and counselling.`,
                    'other': `Other`
                  }, () => 'TODO') as any,
                  'Population Group': fnSwitch(status!, {
                    idp: 'IDPs',
                    'non-displaced': 'Non-Displaced',
                    'returnee': 'Returnees',
                  }, () => 'Non-Displaced'),
                  'Reporting Month': periodStr,
                  'Total Individuals Reached': persons.length,
                  'Elderly Women': disaggregation['60+'].Female,
                  'Elderly Men': disaggregation['60+'].Male,
                  'Adult Women': disaggregation['18 - 59'].Female,
                  'Adult Men': disaggregation['18 - 59'].Male,
                  'Girls': disaggregation['0 - 17'].Female,
                  'Boys': disaggregation['0 - 17'].Male,
                  'People with disability': 0,
                }
              )
            }
          })
          const activity: AiGbvInterface.Type = {
            Oblast, Raion, Hromada,
            'Plan Code': fnSwitch(project!, {
              bha: DrcProject['UKR-000345 BHA2'],
              danida: DrcProject['UKR-000347 DANIDA'],
              sdc: 'TODO' as any,
            }),
            'Partner Organization': 'Danish Refugee Council',
            'Sub Activities': subActivities,
          }
          mapped.push({
            data: grouped,
            activity,
            requestBody: ActivityInfoSdk.makeRecordRequests({
              activityIdPrefix: 'drcgbv',
              activity: AiGbvInterface.map(activity),
              activityIndex: index++,
              activityYYYYMM: periodStr.replace('-', ''),
              formId: 'cdabzugldwuqqzo2',
              subformId: 'czyzhrldwuqqzp3',
              subActivities: activity['Sub Activities'].map(AiGbvInterface.mapSubActivities)
            })
          })
        }
      })
      return mapped
    })
  }

  const fetcher = useFetcher(req)

  useEffect(() => {
    fetcher.fetch({}, period)
  }, [period])

  const flatData = useMemo(() => {
    return fetcher.entity?.flatMap(d => {
      return d.activity['Sub Activities'].map(a => {
        return {
          id: d.requestBody.changes[0].recordId,
          Oblast: d.activity.Oblast,
          Raion: d.activity.Raion,
          Hromada: d.activity.Hromada,
          planCode: d.activity['Plan Code'],
          responseTheme: d.activity['Response Theme'],
          ...a,
        }
      })
    })
  }, [fetcher.entity])

  const indexActivity = useMemo(() => {
    const gb = seq(fetcher.entity)?.groupBy(_ => _.requestBody.changes[0].recordId)
    return new Enum(gb).transform((k, v) => {
      if (v.length !== 1) throw new Error('Should contains 1 request by ID.')
      return [k, v[0]]
    }).get()
  }, [fetcher.entity])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          id="ai-gbv"
          loading={fetcher.loading}
          data={flatData}
          header={
            <>
              <AaInput helperText={null} sx={{width: 200}} type="month" value={period} onChange={e => setPeriod(e.target.value)}/>
              <AaBtn icon="send" variant="contained" sx={{ml: 'auto'}} onClick={() => {
                if (!fetcher.entity) return
                _submit.call('all', fetcher.entity.map(_ => _.requestBody)).catch(toastHttpError)
              }}>
                {m.submitAll}
              </AaBtn>
            </>
          }
          columns={[
            {
              width: 120,
              id: 'actions',
              render: _ => {
                return (
                  <>
                    <AiSendBtn
                      disabled={!_.Hromada}
                      onClick={() => {
                        _submit.call(_.id, [indexActivity[_.id]!.requestBody]).catch(toastHttpError)
                      }}
                    />
                    <AIViewAnswers answers={indexActivity[_.id]!.data}/>
                    <AIPreviewActivity activity={indexActivity[_.id]!.activity}/>
                    <AIPreviewRequest request={indexActivity[_.id]!.requestBody}/>
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
            {head: 'Oblast', id: 'Oblast', type: 'select_one', render: _ => _.Oblast},
            {head: 'Raion', id: 'Raion', type: 'select_one', render: _ => _.Raion},
            {head: 'Hromada', id: 'Hromada', type: 'select_one', render: _ => _.Hromada},
            {head: 'Plan Code', id: 'Plan Code', type: 'select_one', render: _ => _.planCode},
            {width: 0, head: 'Reponse theme', id: 'responseTheme', type: 'select_one', render: _ => _.responseTheme},
            {head: 'Population Group', id: 'Population Group', type: 'select_one', render: _ => _['Population Group']},
            {head: 'Protection Indicators', id: 'Protection Indicators', type: 'select_one', render: _ => _['Protection Indicators']},
            {width: 0, head: 'Adult Men', id: 'Adult Men', type: 'number', render: _ => formatLargeNumber(_['Adult Men'])},
            {width: 0, head: 'Adult Women', id: 'Adult Women', type: 'number', render: _ => formatLargeNumber(_['Adult Women'])},
            {width: 0, head: 'Elderly Men', id: 'Elderly Men', type: 'number', render: _ => formatLargeNumber(_['Elderly Men'])},
            {width: 0, head: 'Elderly Women', id: 'Elderly Women', type: 'number', render: _ => formatLargeNumber(_['Elderly Women'])},
            {width: 0, head: 'Boys', id: 'Boys', type: 'number', render: _ => formatLargeNumber(_['Boys'])},
            {width: 0, head: 'Girls', id: 'Girls', type: 'number', render: _ => formatLargeNumber(_['Girls'])},
            {width: 0, head: 'People with disability', id: 'People with disability', type: 'number', render: _ => formatLargeNumber(_['People with disability'])},
            {width: 0, head: 'Total Individuals Reached', id: 'Total Individuals Reached', type: 'number', render: _ => formatLargeNumber(_['Total Individuals Reached'])},
          ]}
        />
      </Panel>
    </Page>
  )
}