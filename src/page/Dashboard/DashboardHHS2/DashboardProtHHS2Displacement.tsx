import {SlideContainer, SlidePanel} from '../../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, DashboardProtHHS2BarChart} from './DashboardProtHHS2'
import {Box, useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {ScLineChart} from '../../../shared/Chart/ScLineChart'
import {Txt} from 'mui-extension'
import {map} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'

export const DashboardProtHHS2Displacement = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer>
        <SlideContainer flexDirection="column">
          <SlidePanel title={m.departureFromAreaOfOrigin}>
            <Lazy deps={[data]} fn={() => ChartTools.groupByDate({
              data: data
                .map(_ => _.when_did_you_first_leave_your_area_of_origin)
                .compact()
                .map(_ => format(_, 'yyyy-MM-dd'))
                .filter(_ => _ > '2021-11' && _ < format(filters.end, 'yyyy-MM'))
                .sort(),
              getDate: _ => _.replace(/-\d{2}$/, ''),
            })}>
              {_ => (
                <>
                  <ScLineChart height={220} hideLabelToggle curves={[
                    {label: m.departureFromAreaOfOrigin, key: 'dateOfDeparture', curve: _},
                  ]}/>
                  <Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>
                    {map(_.head, start => <Box>{start.label}</Box>)}
                    {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
                  </Txt>
                </>
              )}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.protHHS2.safetyOrSecurityConcernsDuringDisplacement}>
            <DashboardProtHHS2BarChart
              questionType="multiple"
              data={data}
              question="did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns"
            />
          </SlidePanel>
          <SlidePanel title={m.protHHS2.poc}>
            <DashboardProtHHS2BarChart
              data={data}
              question="what_are_your_households_intentions_in_terms_of_place_of_residence"
            />
            {/*<Lazy deps={[data]} fn={() => chain(ChartTools.multiple({*/}
            {/*  data: data.map(_ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household).compact(),*/}
            {/*}))*/}
            {/*  .map(ChartTools.sortBy.value)*/}
            {/*  .map(ChartTools.setLabel(ProtHHS_2_1Options.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household))*/}
            {/*  .get}*/}
            {/*>*/}
            {/*  {_ => <HorizontalBarChartGoogle data={_}/>}*/}
            {/*</Lazy>*/}
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
    </>
  )
}