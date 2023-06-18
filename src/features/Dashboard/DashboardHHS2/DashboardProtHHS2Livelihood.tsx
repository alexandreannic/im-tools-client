import {SlideContainer, SlidePanel, SlidePanelTitle} from '@/shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain, mapObjectValue} from '@/utils/utils'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {KoboLineChart} from '../shared/KoboLineChart'
import {_Arr} from '@alexandreannic/ts-utils'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {Divider} from '@mui/material'

export const DashboardProtHHS2Livelihood = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  return (
    <SlideContainer column>
      <SlideContainer responsive>
        <SlideContainer>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.currentMonth, computed.lastMonth]} fn={d => ChartTools.percentage({
              value: _ => _.what_is_the_average_month_income_per_household === 'no_income',
              data: d,
              base: _ => _ !== undefined,
            })}>
              {(_, curr, last) => <PieChartIndicator title={m.hhWithoutIncome} percent={_.percent} evolution={curr.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.currentMonth, computed.lastMonth]} fn={d => ChartTools.percentage({
              value: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes',
              data: d,
              base: _ => _ !== undefined,
            })}>
              {(_, curr, last) => <PieChartIndicator title={m.hhOutOfWork} percent={_.percent} evolution={curr.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.currentMonth, computed.lastMonth]} fn={d => ChartTools.percentage({
              value: _ => _.do_you_and_your_hh_members_receive_the_idp_allowance === 'yes',
              data: d,
              base: _ => _.do_you_identify_as_any_of_the_following === 'idp',
            })}>
              {(_, curr, last) => <PieChartIndicator title={m.idpWithAllowance} percent={_.percent} evolution={curr.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.currentMonth, computed.lastMonth]} fn={d => ChartTools.percentage({
              value: _ => _.are_there_gaps_in_meeting_your_basic_needs === 'yes_somewhat' || _.are_there_gaps_in_meeting_your_basic_needs === 'yes_a_lot',
              data: d,
            })}>
              {(_, curr, last) => <PieChartIndicator title={m.hhWithGapMeetingBasicNeeds} percent={_.percent} evolution={curr.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
      <SlideContainer responsive alignItems="flex-start">
        <SlideContainer column sx={{flex: 1}}>
          <SlidePanel title={m.protHHS2.hhOutOfWorkAndSeekingEmployment}>
            <KoboLineChart
              question="including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment"
              data={data}
              displayedValues={['yes']}
            />
            <Divider sx={{mb: 3, mt: 2}}/>
            <SlidePanelTitle>{m.unemployedMemberByOblast}</SlidePanelTitle>
            <Lazy deps={[data]} fn={() => ChartTools.byCategory({
              categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
              data,
              filter: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes'
            })}>
              {_ => <UkraineMap data={_} fillBaseOn="percent" sx={{mx: 3}}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.unemploymentFactors}>
            <ProtHHS2BarChart
              data={data}
              question="what_are_the_reasons_for_being_out_of_work"
              questionType="multiple"
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column sx={{flex: 1}}>
          <SlidePanel title={m.monthlyIncomePerHH}>
            <Lazy deps={[data]} fn={() => {

              const income = chain(ChartTools.single({
                filterValue: ['no_income', 'unable_unwilling_to_answer'],
                data: data.map(_ => _.what_is_the_average_month_income_per_household).compact(),
              }))
                .map(ChartTools.setLabel(ProtHHS_2_1Options.what_is_the_average_month_income_per_household))
                .map(ChartTools.sortBy.custom(Object.keys(ProtHHS_2_1Options.what_is_the_average_month_income_per_household)))
                .get

              const hhSize = ChartTools.sumByCategory({
                data,
                categories: {
                  // no_income: _ => _.what_is_the_average_month_income_per_household === 'no_income',
                  up_to_3000_UAH: _ => _.what_is_the_average_month_income_per_household === 'up_to_3000_UAH',
                  between_3001_6000_UAH: _ => _.what_is_the_average_month_income_per_household === 'between_3001_6000_UAH',
                  between_6001_9000_UAH: _ => _.what_is_the_average_month_income_per_household === 'between_6001_9000_UAH',
                  between_9001_12000_UAH: _ => _.what_is_the_average_month_income_per_household === 'between_9001_12000_UAH',
                  between_12001_15000_UAH: _ => _.what_is_the_average_month_income_per_household === 'between_12001_15000_UAH',
                  more_than_15000_UAH: _ => _.what_is_the_average_month_income_per_household === 'more_than_15000_UAH',
                },
                filter: _ => _.how_many_ind ?? 0,
              })
              return {income, hhSize}
            }}>
              {res => <HorizontalBarChartGoogle data={res.income} descs={mapObjectValue(res.hhSize, _ => m.protHHSnapshot.avgHhSize(_.value / (_.base ?? 1)))}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.mainSourceOfIncome}>
            <ProtHHS2BarChart
              question="what_are_the_main_sources_of_income_of_your_household"
              data={data}
              filterValue={['unable_unwilling_to_answer']}
              questionType="multiple"
              limit={4}
            />
          </SlidePanel>

          <SlidePanel title={m.copyingMechanisms}>
            <ProtHHS2BarChart
              data={data}
              question="what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges"
              questionType="multiple"
              overrideLabel={{
                reducing_consumption_of_food: m.protHHS2.reducing_consumption_of_food,
              }}
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
    </SlideContainer>
  )
}