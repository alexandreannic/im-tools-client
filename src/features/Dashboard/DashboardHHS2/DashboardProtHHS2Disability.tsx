import {SlideContainer, SlidePanel, SlidePanelTitle} from '@/shared/PdfLayout/Slide'
import React, {useMemo} from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {KoboUkraineMap} from '../shared/KoboUkraineMap'
import {KoboPieChartIndicator, KoboPieChartIndicatorMultiple} from '../shared/KoboPieChartIndicator'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {chain, forceArrayStringInference} from '@/utils/utils'
import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Panel} from '@/shared/Panel'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'

export const DashboardProtHHS2Disability = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  return (
    <SlideContainer responsive>
      <SlideContainer column>
        <SlidePanel>
          <KoboPieChartIndicator
            title={m.protHHS2.hhWithMemberHavingDifficulties}
            question="do_you_have_a_household_member_that_has_a_lot_of_difficulty"
            filter={_ => !_.includes('no')}
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
      </SlideContainer>
      <SlideContainer column>
        <SlidePanel>
          <KoboPieChartIndicator
            title={m.protHHS2.barriersToAccessHealth}
            sx={{mb: 2}}
            compare={{before: computed.lastMonth}}
            question="do_you_have_access_to_health_care_in_your_current_location"
            filter={_ => _ !== 'yes'}
            filterBase={_ => _ !== 'unable_unwilling_to_answer'}
            data={data}
          />
          <ProtHHS2BarChart
            data={data}
            questionType="multiple"
            question="what_are_the_barriers_to_accessing_health_services"
            filterValue={['unable_unwilling_to_answer']}
          />
        </SlidePanel>

      </SlideContainer>
    </SlideContainer>
  )
}