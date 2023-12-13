import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {AaInput} from '@/shared/ItInput/AaInput'
import {format, subMonths} from 'date-fns'
import {PeriodHelper} from '@/core/type'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {AAIconBtn} from '@/shared/IconBtn'
import {AIPreviewActivity, AIPreviewRequest, AIViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {AiShelterData} from '@/features/ActivityInfo/Snfi/aiSnfiData'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {useAsync} from '@/alexlib-labo/useAsync'

export const AiSnfi = () => {
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()
  const fetcher = useFetcher(AiShelterData.reqRepairs(api))
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {m} = useI18n()

  useEffect(() => {
    fetcher.fetch({}, PeriodHelper.fromyyyMM(period))
  }, [period])

  const _submit = useAsync((id: string, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  // console.log(fetcher.entity?.map(_ => _.nta).compact().map(_ => {
  //   const a = Utils.add(
  //     _.total_apt_damage_light,
  //     _.total_apt_damage_medium,
  //     _.total_damage_heavy,
  //     _.total_damage_light,
  //     _.total_damage_medium
  //   )
  //   if (a === 0) return _.id
  // }))

  return (
    <Page width="full">
      <Panel>
        <Sheet
          header={
            <>
              <AaInput type="month" sx={{width: 200, mr: 1}} helperText={null} value={period} onChange={_ => setPeriod(_.target.value)}/>
              <AaBtn
                loading={_submit.anyLoading}
                icon="send"
                variant="contained"
                sx={{ml: 'auto'}}
                onClick={() => {
                  if (!fetcher.entity) return
                  _submit.call('all', fetcher.entity.map(_ => _.request)).catch(toastHttpError)
                }}
              >
                {m.submitAll}
              </AaBtn>
            </>
          }
          defaultLimit={100} id="ai-shelter" data={fetcher.entity} loading={fetcher.loading} columns={[
          {
            id: 'actions', width: 160, head: '', render: _ => (
              <>
                <AAIconBtn
                  disabled={!_.activity.Hromada} color="primary"
                  onClick={() => {
                    // _submit.call(_.id, [indexActivity[_.id]!.request]).catch(toastHttpError)
                  }}
                >send</AAIconBtn>
                <AIViewAnswers answers={_.all}/>
                <AIPreviewActivity activity={_.activity}/>
                <AIPreviewRequest request={_.request}/>
              </>
            )
          },
          {type: 'select_one', id: 'Report to a planned project', head: 'Report to a planned project', render: row => row.activity['Report to a planned project']},
          {type: 'select_one', id: 'Plan Code', head: 'Plan Code', render: row => row.activity['Plan Code']},
          {type: 'select_one', id: 'SNFI indictors', head: 'SNFI indictors', render: row => row.activity['SNFI indictors']},
          {type: 'select_one', id: 'Oblast', head: 'Oblast', render: row => row.activity['Oblast']},
          {type: 'select_one', id: 'Raion', head: 'Raion', render: row => row.activity['Raion']},
          {type: 'select_one', id: 'Hromada', head: 'Hromada', render: row => row.activity['Hromada']},
          {type: 'select_one', id: 'Implementation status', head: 'Implementation status', render: row => row.activity['Implementation status']},
          {type: 'select_one', id: 'Population Group', head: 'Population Group', render: row => row.activity['Population Group']},
          {type: 'number', id: 'Indicator Value (HHs reached, buildings, etc.)', head: 'Indicator Value (HHs reached, buildings, etc.)', render: row => row.activity['Indicator Value (HHs reached, buildings, etc.)']},
          {type: 'number', id: '# Individuals Reached', head: '# Individuals Reached', render: row => row.activity['# Individuals Reached']},
          {type: 'number', id: 'Girls (0-17)', head: 'Girls (0-17)', render: row => row.activity['Girls (0-17)']},
          {type: 'number', id: 'Boys (0-17)', head: 'Boys (0-17)', render: row => row.activity['Boys (0-17)']},
          {type: 'number', id: 'Women (18-59)', head: 'Women (18-59)', render: row => row.activity['Women (18-59)']},
          {type: 'number', id: 'Men (18-59)', head: 'Men (18-59)', render: row => row.activity['Men (18-59)']},
          {type: 'number', id: 'Elderly Women (60+)', head: 'Elderly Women (60+)', render: row => row.activity['Elderly Women (60+)']},
          {type: 'number', id: 'Elderly Men (60+)', head: 'Elderly Men (60+)', render: row => row.activity['Elderly Men (60+)']},
          {type: 'number', id: 'People with disability', head: 'People with disability', render: row => row.activity['People with disability']},
        ]}/>
      </Panel>
    </Page>
  )
}