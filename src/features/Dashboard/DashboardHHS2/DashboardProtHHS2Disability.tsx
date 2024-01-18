import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {ChartPieIndicator} from '@/shared/chart/KoboPieChartIndicator'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'

export const DashboardProtHHS2Disability = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  return (
    <Div responsive>
      <Div column>
        <SlidePanel>
          <ChartPieIndicator
            title={m.protHHS2.hhWithMemberHavingDifficulties}
            filter={_ => !_.do_you_have_a_household_member_that_has_a_lot_of_difficulty.includes('no')}
            compare={{before: computed.lastMonth}}
            data={data}
            sx={{mb: 1}}
          />
          <ProtHHS2BarChart
            data={data}
            question="do_you_have_a_household_member_that_has_a_lot_of_difficulty"
            questionType="multiple"
            overrideLabel={{
              wg_using_your_usual_language_have_difficulty_communicating: m.protHHS2.wg_using_your_usual_language_have_difficulty_communicating,
            }}
            filterValue={['no', 'unable_unwilling_to_answer']}
          />
        </SlidePanel>
        <SlidePanel>
          <ChartPieIndicator
            title={m.protHHS2.unregisteredDisability}
            filter={_ => _.do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov !== 'yes_all'}
            compare={{before: computed.lastMonth}}
            filterBase={_ => _.do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov !== 'unable_unwilling_to_answer'}
            data={data}
            sx={{mb: 1}}
          />
          <ProtHHS2BarChart data={data} question="why_dont_they_have_status"/>
        </SlidePanel>
      </Div>
      <Div column>
        <SlidePanel>
          <ChartPieIndicator
            title={m.protHHS2.barriersToAccessHealth}
            sx={{mb: 2}}
            compare={{before: computed.lastMonth}}
            filter={_ => _.do_you_have_access_to_health_care_in_your_current_location !== 'yes'}
            filterBase={_ => _.do_you_have_access_to_health_care_in_your_current_location !== 'unable_unwilling_to_answer'}
            data={data}
          />
          <ProtHHS2BarChart
            data={data}
            questionType="multiple"
            question="what_are_the_barriers_to_accessing_health_services"
            filterValue={['unable_unwilling_to_answer']}
          />
        </SlidePanel>
      </Div>
    </Div>
  )
}