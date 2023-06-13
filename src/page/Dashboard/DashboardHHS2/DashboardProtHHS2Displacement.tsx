import {SlideContainer, SlidePanel} from '../../../shared/PdfLayout/Slide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {Box, Icon, useTheme} from '@mui/material'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {ScLineChart} from '../../../shared/Chart/ScLineChart'
import {Txt} from 'mui-extension'
import {map} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'
import {UkraineMap} from '../../../shared/UkraineMap/UkraineMap'
import {PieChartIndicator} from '../../../shared/PieChartIndicator'
import {KoboLineChart} from '../shared/KoboLineChart'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {KoboLineChartDate} from '../shared/KoboLineChartDate'
import {KoboPieChartIndicatorMultiple, PieChartIndicatorKobo} from '../shared/KoboPieChartIndicator'


export const DashboardProtHHS2Displacement = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  return (
    <>
      <SlideContainer>
        <SlideContainer column>
          <SlidePanel>
            <KoboLineChartDate
              data={data}
              question={['when_did_you_first_leave_your_area_of_origin', 'when_did_you_return_to_your_area_of_origin']}
              label={[m.departureFromAreaOfOrigin, m.returnToOrigin]}
              end={computed.end}
            />
          </SlidePanel>
          <SlidePanel title={m.idpPopulationByOblast}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <UkraineMap sx={{flex: 1}} data={computed.byOriginOblast} base={computed.flatData.length} title={m.originOblast}/>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
              </Box>
              <UkraineMap sx={{flex: 1}} data={computed.byCurrentOblast} base={computed.flatData.length} legend={false} title={m.currentOblast}/>
            </Box>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.residentialIntentionsByHousehold}>
            <ProtHHS2BarChart
              data={data}
              filterValue={['unable_unwilling_to_answer']}
              question="what_are_your_households_intentions_in_terms_of_place_of_residence"
            />
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel>
            <Lazy deps={[data]} fn={() => ChartTools.percentage({
              value: _ => _.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns?.includes('none') === false,
              data,
              base: _ => _.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns !== undefined
                && !_.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns.includes('unable_unwilling_to_answer'),
            })}>
              {_ => (
                <PieChartIndicator sx={{mb: 1}} percent={_.percent} title={m.protHHS2.safetyOrSecurityConcernsDuringDisplacement}/>
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
    </>
  )
}