import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'
import {ChartTools} from '@/shared/chart/chartHelper'
import {ChartPieWidgetByKey} from '@/shared/chart/ChartPieWidgetByKey'
import {ChartBarSingleBy} from '@/shared/chart/ChartBarSingleBy'
import {Protection_Hhs2_1Options} from '@/core/generatedKoboInterface/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {ChartBarMultipleBy} from '@/shared/chart/ChartBarMultipleBy'

export const DashboardProtHHS2Housing = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <Div responsive>
        <Div column>
          <SlidePanel title={m.housingStructure}>
            <ChartBarSingleBy
              data={data}
              by={_ => _.what_is_your_current_housing_structure}
              filter={_ => _.what_is_your_current_housing_structure !== 'unable_unwilling_to_answer'}
            />
          </SlidePanel>
          <SlidePanel>
            <ChartPieWidgetByKey
              compare={{before: computed.lastMonth}}
              title={m.protHHSnapshot.noAccommodationDocument}
              property="do_you_have_formal_rental_documents_to_stay_in_your_accommodation"
              filter={_ => _ !== 'yes_i_have_a_written_lease_agreement' && _ !== 'yes_i_have_state_assigned_shelter_with_proving_documents'}
              filterBase={_ => _ !== 'unable_unwilling_to_answer'}
              data={data}
              sx={{mb: 2}}
            />
            <ChartBarSingleBy
              data={data}
              by={_ => _.do_you_have_formal_rental_documents_to_stay_in_your_accommodation}
              filter={_ => _.do_you_have_formal_rental_documents_to_stay_in_your_accommodation !== 'unable_unwilling_to_answer'}
              label={Protection_Hhs2_1Options.do_you_have_formal_rental_documents_to_stay_in_your_accommodation}
            />
          </SlidePanel>
        </Div>
        <Div column>
          <SlidePanel>
            <ChartPieWidgetByKey
              compare={{before: computed.lastMonth}}
              title={m.protHHS2.mainConcernsRegardingHousing}
              property="what_are_your_main_concerns_regarding_your_accommodation"
              filter={_ => !_?.includes('none')}
              data={data}
              sx={{mb: 1}}
            />
            <ChartBarMultipleBy
              data={data}
              by={_ => _.what_are_your_main_concerns_regarding_your_accommodation}
              filterValue={['unable_unwilling_to_answer', 'none']}
              label={Protection_Hhs2_1Options.what_are_your_main_concerns_regarding_your_accommodation}
            />
          </SlidePanel>
          <SlidePanel title={m.accommodationCondition}>
            <ChartBarSingleBy
              data={data}
              by={_ => _.what_is_the_general_condition_of_your_accommodation}
              sortBy={ChartTools.sortBy.custom([
                'sound_condition',
                'partially_damaged',
                'severely_damaged',
                'destroyed',
                'unfinished',
              ])}
              filter={_ => _.what_is_the_general_condition_of_your_accommodation === 'unable_unwilling_to_answer'}
            />
          </SlidePanel>
        </Div>
      </Div>
    </>
  )
}