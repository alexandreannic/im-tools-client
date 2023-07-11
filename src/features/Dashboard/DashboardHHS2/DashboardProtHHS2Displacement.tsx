import {SlideContainer, SlidePanel} from '@/shared/PdfLayout/Slide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {Box, Icon} from '@mui/material'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {KoboLineChartDate} from '../shared/KoboLineChartDate'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {chain} from '@/utils/utils'


export const DashboardProtHHS2Displacement = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  return (
    <SlideContainer responsive>
      <SlideContainer column>
        <SlidePanel title={m.idpPopulationByOblast}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <UkraineMap sx={{flex: 1}} data={computed.byOriginOblast} base={data.length} title={m.originOblast}/>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
              <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
              <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
            </Box>
            <UkraineMap sx={{flex: 1}} data={computed.byCurrentOblast} base={data.length} legend={false} title={m.currentOblast}/>
          </Box>
        </SlidePanel>
        <SlidePanel title={m.displacementAndReturn}>
          <KoboLineChartDate
            data={data}
            start={new Date(2022, 0, 1)}
            question={['when_did_you_leave_your_area_of_origin', 'when_did_you_return_to_your_area_of_origin']}
            label={[m.departureFromAreaOfOrigin, m.returnToOrigin]}
            translations={{
              when_did_you_leave_your_area_of_origin: m.departureFromAreaOfOrigin,
              when_did_you_return_to_your_area_of_origin: m.returnToOrigin,
            }}
            end={computed.end}
          />
        </SlidePanel>
        <SlidePanel title={m.protHHS2.hhsAffectedByMultipleDisplacement}>
          <Lazy deps={[data]} fn={() => chain(ChartTools.byCategory({
            data,
            categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
            filter: _ => _.have_you_been_displaced_prior_to_your_current_displacement === 'yes_after_2014' || _.have_you_been_displaced_prior_to_your_current_displacement === 'yes_after_february_24_2022',
            filterBase: _ => _.have_you_been_displaced_prior_to_your_current_displacement && _.have_you_been_displaced_prior_to_your_current_displacement !== 'unable_unwilling_to_answer'
          })).get}>
            {_ => <UkraineMap data={_} sx={{mx: 2}}/>}
          </Lazy>
        </SlidePanel>
        <SlidePanel title={m.intentions}>
          <ProtHHS2BarChart
            data={data}
            filterValue={['unable_unwilling_to_answer']}
            question="what_are_your_households_intentions_in_terms_of_place_of_residence"
            overrideLabel={{
              return_to_the_area_of_origin: m.returnToThePlaceOfHabitualResidence
            }}
          />
        </SlidePanel>
      </SlideContainer>
      <SlideContainer column>
        <SlidePanel title={m.protHHS2.reasonForLeaving}>
          <ProtHHS2BarChart
            data={data}
            question="why_did_you_leave_your_area_of_origin"
            questionType="multiple"
            filterValue={['unable_unwilling_to_answer']}
          />
        </SlidePanel>
        <SlidePanel>
          <Lazy deps={[data, computed.lastMonth]} fn={(d) => ChartTools.percentage({
            value: _ => _.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns?.includes('none') === false,
            data: d,
            base: _ => _.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns !== undefined
              && !_.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns.includes('unable_unwilling_to_answer'),
          })}>
            {(_, last) => (
              <PieChartIndicator sx={{mb: 1}} percent={_.percent} evolution={_.percent - last.percent} title={m.protHHS2.safetyOrSecurityConcernsDuringDisplacement}/>
            )}
          </Lazy>
          <ProtHHS2BarChart
            questionType="multiple"
            data={data}
            filterValue={['unable_unwilling_to_answer', 'none', 'other_specify']}
            question="did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns"
          />
        </SlidePanel>
      </SlideContainer>
    </SlideContainer>
  )
}