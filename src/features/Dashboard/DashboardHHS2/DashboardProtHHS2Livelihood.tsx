import {SlideContainer, SlidePanel} from '../../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '@/utils/utils'
import {PieChartIndicator} from '../../../shared/PieChartIndicator'
import {UkraineMap} from '../../../shared/UkraineMap/UkraineMap'
import {KoboLineChart} from '../shared/KoboLineChart'
import {_Arr} from '@alexandreannic/ts-utils'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'

export const DashboardProtHHS2Livelihood = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  return (
    <SlideContainer column>
      <SlideContainer>
        <SlidePanel sx={{flex: 1}}>
          <Lazy deps={[data]} fn={() => ChartTools.percentage({
            value: _ => _.what_is_the_average_month_income_per_household === 'no_income',
            data,
            base: _ => _ !== undefined,
          })}>
            {_ => <PieChartIndicator title={m.hhWithoutIncome} percent={_.percent}/>}
          </Lazy>
        </SlidePanel>
        <SlidePanel sx={{flex: 1}}>
          <Lazy deps={[data]} fn={() => ChartTools.percentage({
            value: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes',
            data,
            base: _ => _ !== undefined,
          })}>
            {_ => <PieChartIndicator title={m.hhOutOfWork} percent={_.percent}/>}
          </Lazy>
        </SlidePanel>
        <SlidePanel sx={{flex: 1}}>
          <Lazy deps={[data]} fn={() => ChartTools.percentage({
            value: _ => _.do_you_and_your_hh_members_receive_the_idp_allowance === 'yes',
            data,
            base: _ => _.do_you_identify_as_any_of_the_following === 'idp',
          })}>
            {_ => <PieChartIndicator title={m.idpWithAllowance} percent={_.percent}/>}
          </Lazy>
        </SlidePanel>
        <SlidePanel sx={{flex: 1}}>
          <Lazy deps={[data]} fn={() => ChartTools.percentage({
            value: _ => _.are_there_gaps_in_meeting_your_basic_needs === 'yes_somewhat' || _.are_there_gaps_in_meeting_your_basic_needs === 'yes_a_lot',
            data,
          })}>
            {_ => <PieChartIndicator title={m.hhWithGapMeetingBasicNeeds} percent={_.percent}/>}
          </Lazy>
        </SlidePanel>
      </SlideContainer>
      <SlideContainer alignItems="flex-start">
        <SlideContainer column sx={{flex: 1}}>
          <SlidePanel>
            <Lazy deps={[data, computed.currentMonth, computed.lastMonth]} fn={(d: _Arr<ProtHHS_2_1>) => ChartTools.percentage({
              value: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes',
              data: d,
              base: _ => _ !== undefined,
            })}>
              {(_, curr, last) => <PieChartIndicator title={m.protHHS2.hhOutOfWorkAndSeekingEmployment} percent={_.percent}/>}
            </Lazy>
            <KoboLineChart
              question="including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment"
              data={data}
              displayedValues={['yes']}
            />
          </SlidePanel>
          <SlidePanel title={m.monthlyIncomePerHH}>
            <Lazy deps={[data]} fn={() => chain(ChartTools.single({
              filterValue: ['no_income', 'unable_unwilling_to_answer'],
              data: data.map(_ => _.what_is_the_average_month_income_per_household).compact(),
            }))
              .map(ChartTools.setLabel(ProtHHS_2_1Options.what_is_the_average_month_income_per_household))
              .map(ChartTools.sortBy.custom(Object.keys(ProtHHS_2_1Options.what_is_the_average_month_income_per_household)))
              .get
            }>
              {_ =>
                <HorizontalBarChartGoogle data={_}/>
              }
            </Lazy>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column sx={{flex: 1}}>
          <SlidePanel title={m.unemployedMemberByOblast}>
            <Lazy deps={[data]} fn={() => ChartTools.byCategory({
              categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
              data,
              filter: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes'
            })}>
              {_ => <UkraineMap data={_} fillBaseOn="percent" sx={{mx: 3}}/>}
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
        </SlideContainer>
      </SlideContainer>
    </SlideContainer>
  )
}