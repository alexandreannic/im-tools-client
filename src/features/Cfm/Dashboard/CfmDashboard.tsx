import {Page} from '@/shared/Page'
import {useCfmContext} from '@/features/Cfm/CfmContext'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import React, {useMemo, useState} from 'react'
import {Period, PeriodHelper} from '@/core/type/period'
import {Panel, PanelBody} from '@/shared/Panel'
import {UaMapBy} from '@/features/DrcUaMap/UaMapBy'
import {Div} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'

export const CfmDashboard = () => {
  const ctx = useCfmContext()
  const [period, setPeriod] = useState<Partial<Period>>({})
  const {m} = useI18n()

  const filteredByDateData = useMemo(() => {
    return ctx.mappedData.filter(_ => PeriodHelper.isDateIn(period, _.date))
  }, [period, ctx.mappedData])

  const filteredData = useMemo(() => {
    return filteredByDateData
  }, [filteredByDateData])

  return (
    <Page width="lg">
      <Div>
        <Div column>
          <Panel savableAsImg expendable title={m.category}>
            <PanelBody>
              <ChartBarSingleBy data={filteredData} by={_ => _.category} label={{
                'apprec_com': `Appreciation or compliments`,
                'request_info': `Request for information`,
                'request_assistance': `Request for support or assistance`,
                'non_s_feedback': `Non-sensitive programmatic feedback`,
                'sen_feedback': `Sensitive - Protection issue reported`,
                'coc': `Sensitive CoC violation by DRC staff and representatives`,
                'violation_other': `Sensitive - Seriously violation by other humanitarian actor (non-DRC staff)`,
                'sen_safety': `Sensitive - Safety and security threat.`
              }}/>
            </PanelBody>
          </Panel>
          <Panel savableAsImg expendable title={m.program}>
            <PanelBody>
              <ChartBarSingleBy data={filteredData} by={_ => _.tags?.program}/>
            </PanelBody>
          </Panel>
        </Div>
        <Div column>
          <Panel savableAsImg expendable title={m._cfm.requestByOblast}>
            <PanelBody>
              <UaMapBy
                sx={{ml: 1, mt: 2}}
                fillBaseOn="value"
                data={ctx.mappedData}
                value={_ => true}
                getOblast={_ => _.oblastIso!}
                base={_ => _.oblastIso !== undefined}
              />
            </PanelBody>
          </Panel>
        </Div>
      </Div>
    </Page>
  )
}