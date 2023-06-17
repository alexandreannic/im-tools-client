import {SlideContainer, SlidePanel} from '@/shared/PdfLayout/Slide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'
import {KoboPieChartIndicator} from '../shared/KoboPieChartIndicator'
import {ChartTools} from '../../../core/chartTools'

export const DashboardProtHHS2Housing = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.housingStructure}>
            <ProtHHS2BarChart
              data={data}
              question="what_is_your_current_housing_structure"
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
          <SlidePanel>
            <KoboPieChartIndicator
              compare={{now: computed.currentMonth, before: computed.lastMonth}}
              title={m.protHHSnapshot.noAccommodationDocument}
              question="do_you_have_formal_rental_documents_to_stay_in_your_accommodation"
              filter={_ => _ !== 'yes_i_have_a_written_lease_agreement' && _ !== 'yes_i_have_state_assigned_shelter_with_proving_documents'}
              filterBase={_ => _ !== 'unable_unwilling_to_answer'}
              data={data.filter(_ => _.do_you_have_formal_rental_documents_to_stay_in_your_accommodation !== undefined)}
              sx={{mb: 2}}
            />
            <ProtHHS2BarChart
              data={data}
              question="do_you_have_formal_rental_documents_to_stay_in_your_accommodation"
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel>
            <KoboPieChartIndicator
              compare={{now: computed.currentMonth, before: computed.lastMonth}}
              title={m.protHHS2.mainConcernsRegardingHousing}
              question="what_are_your_main_concerns_regarding_your_accommodation"
              filter={_ => !_.includes('none')}
              data={data}
              sx={{mb: 1}}
            />
            <ProtHHS2BarChart
              questionType="multiple"
              data={data}
              question="what_are_your_main_concerns_regarding_your_accommodation"
              filterValue={['unable_unwilling_to_answer', 'none']}
            />
          </SlidePanel>
          <SlidePanel title={m.accommodationCondition}>
            <ProtHHS2BarChart
              data={data}
              questionType="multiple"
              question="what_is_the_general_condition_of_your_accommodation"
              sortBy={ChartTools.sortBy.custom([
                'sound_condition',
                'partially_damaged',
                'severely_damaged',
                'destroyed',
                'unfinished',
              ])}
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
    </>
  )
}