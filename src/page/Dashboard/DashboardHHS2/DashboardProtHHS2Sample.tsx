import {SlideContainer, SlidePanel, SlideWidget} from '../../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '../../../shared/UkraineMap/UkraineMap'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {AAStackedBarChart} from '../../../shared/Chart/AaStackedBarChart'
import {PieChartIndicator} from '../../../shared/PieChartIndicator'
import {Panel} from '../../../shared/Panel'
import {KoboPieChartIndicator} from '../shared/KoboPieChartIndicator'

export const DashboardProtHHS2Sample = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <SlideContainer column>
      <SlideContainer alignItems="flex-start">
        <SlideContainer column>
          <SlideContainer>
            <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
              {formatLargeNumber(data.length)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
              {formatLargeNumber(computed.individuals)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
              {(computed.individuals / data.length).toFixed(1)}
            </SlideWidget>
          </SlideContainer>
        </SlideContainer>
        <SlideContainer column>
          <SlideContainer>
            <SlideWidget sx={{flex: 1}} icon="elderly" title={m.avgAge}>
              <Lazy deps={[data]} fn={() => computed.flatData.map(_ => _.age).compact().sum() / computed.flatData.length}>
                {_ => _.toFixed(1)}
              </Lazy>
            </SlideWidget>
            <Panel sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Lazy deps={[data]} fn={() => ChartTools.percentage({
                data: computed.flatData,
                value: _ => _.gender === 'female'
              })}>
                {_ => (
                  <PieChartIndicator percent={_.percent} title={m.women}/>
                )}
              </Lazy>
            </Panel>
            <Panel sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <KoboPieChartIndicator
                title={m.uaCitizen}
                data={data}
                filterBase={_ => _ !== 'unable_unwilling_to_answer'}
                filter={_ => _ === 'no'}
                question="if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group"
              />
              {/*<Lazy deps={[data]} fn={() => ChartTools.percentage({*/}
              {/*  data,*/}
              {/*  value: _ => _.if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group === 'no'*/}
              {/*})}>*/}
              {/*  {_ => (*/}
              {/*    <PieChartIndicator value={_.percent} title={m.uaCitizenShip}/>*/}
              {/*  )}*/}
              {/*</Lazy>*/}
            </Panel>

            {/*<SlideWidget sx={{flex: 1}} icon="my_location" title={m.coveredOblasts}>*/}
            {/*  <Lazy deps={[data]} fn={() => data.distinct(_ => _.where_are_you_current_living_oblast).length}>*/}
            {/*    {_ => _}*/}
            {/*  </Lazy>*/}
            {/*</SlideWidget>*/}
          </SlideContainer>
        </SlideContainer>
      </SlideContainer>
      <SlideContainer alignItems="flex-start">
        <SlideContainer column>
          <SlidePanel title={m.HHsLocation}>
            <UkraineMap data={computed.byCurrentOblast} sx={{mx: 3}} base={data.length}/>
          </SlidePanel>
          <SlidePanel title={m.ageGroup}>
            <AAStackedBarChart data={computed.ageGroup} height={250}/>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.protHHS2.poc}>
            <Lazy
              deps={[data]}
              fn={() => chain(ChartTools.single({
                data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
              }))
                .map(ChartTools.sortBy.value)
                .map(ChartTools.setLabel(ProtHHS_2_1Options.do_you_identify_as_any_of_the_following))
                .get}
            >
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel>
            <Lazy deps={[data]} fn={() => ChartTools.percentage({
              data: data
                .map(_ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household)
                .compact()
                .filter(_ => !_.includes('unable_unwilling_to_answer')),
              value: _ => !_.includes('no_specific_needs'),
            })}>
              {_ => <PieChartIndicator sx={{mb: 2}} title={m.protHHS2.HHSwSN} percent={_.percent}/>}
            </Lazy>
            <ProtHHS2BarChart
              data={data}
              question="do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household"
              questionType="multiple"
              filterValue={['no_specific_needs', 'unable_unwilling_to_answer', 'other_specify']}
            />
          </SlidePanel>

          {/*<SlidePanel title={m.protHHS2.ethnicMinorities}>*/}
            {/*<DashboardProtHHS2BarChart*/}
            {/*  data={data}*/}
            {/*  question="if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group"*/}
            {/*  filterValue={[*/}
            {/*    'no',*/}
            {/*    'unable_unwilling_to_answer'*/}
            {/*  ]}*/}
            {/*/>*/}
          {/*</SlidePanel>*/}
        </SlideContainer>
      </SlideContainer>
    </SlideContainer>
  )
}