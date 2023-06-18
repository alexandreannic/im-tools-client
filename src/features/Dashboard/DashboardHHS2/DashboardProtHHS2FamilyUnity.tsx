import {SlideContainer, SlidePanel} from '@/shared/PdfLayout/Slide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {Box, Icon, useTheme} from '@mui/material'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {ScLineChart} from '@/shared/Chart/ScLineChart'
import {Txt} from 'mui-extension'
import {map} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {KoboLineChart} from '../shared/KoboLineChart'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {KoboLineChartDate} from '../shared/KoboLineChartDate'
import {KoboPieChartIndicatorMultiple, KoboPieChartIndicator} from '../shared/KoboPieChartIndicator'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {chain} from '@/utils/utils'


export const DashboardProtHHS2FamilyUnity = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  return (
    <>
      <SlideContainer responsive>
        <SlideContainer column>
          <SlidePanel>
            <KoboPieChartIndicator
              compare={{before: computed.lastMonth}}
              title={m.protHHS2.familyMemberSeparated}
              question="are_you_separated_from_any_of_your_households_members"
              filter={_ => !_.includes('no') && !_.includes('unable_unwilling_to_answer')}
              sx={{mb: 1}}
              data={data}/>
            <ProtHHS2BarChart
              data={data}
              questionType="multiple"
              question="are_you_separated_from_any_of_your_households_members"
              filterValue={['unable_unwilling_to_answer', 'no']}/>
          </SlidePanel>

        </SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.protHHS2.locationOfSeparatedFamilyMembers}>
            <Lazy deps={[data]} fn={() => chain(ChartTools.single({
              data: data.flatMap(_ => [
                _.where_is_your_partner,
                _.where_is_your_child_lt_18,
                _.where_is_your_child_gte_18,
                _.where_is_your_mother,
                _.where_is_your_father,
                _.where_is_your_caregiver,
                _.where_is_your_other_relative,
              ]).compact(),
              filterValue: ['unable_unwilling_to_answer']
            })).map(ChartTools.setLabel(ProtHHS_2_1Options.where_is_your_partner)).get
            }>
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.reasonForRemainInOrigin}>
            <Lazy deps={[data]} fn={() => chain(ChartTools.single({
              data: data.flatMap(_ => [
                _.where_is_your_partner_remain_behind_in_the_area_of_origin,
                _.where_is_your_child_lt_18_remain_behind_in_the_area_of_origin,
                _.where_is_your_child_gte_18_remain_behind_in_the_area_of_origin,
                _.where_is_your_mother_remain_behind_in_the_area_of_origin,
                _.where_is_your_father_remain_behind_in_the_area_of_origin,
                _.where_is_your_caregiver_remain_behind_in_the_area_of_origin,
                _.where_is_your_other_relative_remain_behind_in_the_area_of_origin,
              ]).compact(),
              filterValue: ['unable_unwilling_to_answer']
            })).map(ChartTools.setLabel(ProtHHS_2_1Options.where_is_your_partner_remain_behind_in_the_area_of_origin)).get
            }>
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
    </>
  )
}