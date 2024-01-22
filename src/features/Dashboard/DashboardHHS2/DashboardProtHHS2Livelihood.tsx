import {Div, SlidePanel, SlidePanelTitle} from '@/shared/PdfLayout/PdfSlide'
import {ChartBar} from '@/shared/chart/ChartBar'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {Protection_Hhs2_1Options} from '@/core/generatedKoboInterface/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {Lazy} from '@/shared/Lazy'
import {ChartHelperOld} from '@/shared/chart/chartHelperOld'
import {chain} from '@/utils/utils'
import {ChartPieWidget} from '@/shared/chart/ChartPieWidget'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {ChartLineByKey} from '@/shared/chart/ChartLineByKey'
import {Divider} from '@mui/material'
import {ChartBarMultipleBy} from '@/shared/chart/ChartBarMultipleBy'
import { Obj } from '@alexandreannic/ts-utils'

export const DashboardProtHHS2Livelihood = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  return (
    <Div column>
      <Div responsive>
        <Div>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.lastMonth]} fn={d => ChartHelperOld.percentage({
              value: _ => _.what_is_the_average_month_income_per_household === 'no_income',
              data: d,
              base: _ => _ !== undefined,
            })}>
              {(_, last) => {
                return <ChartPieWidget title={m.hhWithoutIncome} value={_.value} base={_.base} evolution={_.percent - last.percent}/>
              }
              }
            </Lazy>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.lastMonth]} fn={d => ChartHelperOld.percentage({
              value: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes',
              data: d,
              base: _ => _ !== undefined,
            })}>
              {(_, last) => <ChartPieWidget title={m.hhOutOfWork} value={_.value} base={_.base} evolution={_.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
        </Div>
        <Div>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.lastMonth]} fn={d => ChartHelperOld.percentage({
              value: _ => _.do_you_and_your_hh_members_receive_the_idp_allowance === 'yes',
              data: d,
              base: _ => _.do_you_identify_as_any_of_the_following === 'idp',
            })}>
              {(_, last) => <ChartPieWidget title={m.idpWithAllowance} value={_.value} base={_.base} evolution={_.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <Lazy deps={[data, computed.lastMonth]} fn={d => ChartHelperOld.percentage({
              value: _ => _.are_there_gaps_in_meeting_your_basic_needs === 'yes_somewhat' || _.are_there_gaps_in_meeting_your_basic_needs === 'yes_a_lot',
              data: d,
            })}>
              {(_, last) => <ChartPieWidget title={m.hhWithGapMeetingBasicNeeds} value={_.value} base={_.base} evolution={_.percent - last.percent}/>}
            </Lazy>
          </SlidePanel>
        </Div>
      </Div>
      <Div responsive alignItems="flex-start">
        <Div column sx={{flex: 1}}>
          <SlidePanel title={m.protHHS2.hhOutOfWorkAndSeekingEmployment}>
            <ChartLineByKey
              question="including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment"
              data={data}
              displayedValues={['yes']}
            />
            <Divider sx={{mb: 3, mt: 2}}/>
            <SlidePanelTitle>{m.unemployedMemberByOblast}</SlidePanelTitle>
            <Lazy deps={[data]} fn={() => ChartHelperOld.byCategory({
              categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
              data,
              filter: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes'
            })}>
              {_ => <UkraineMap data={_} fillBaseOn="percent" sx={{mx: 3}}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.unemploymentFactors}>
            <ChartBarMultipleBy
              data={data}
              by={_ => _.what_are_the_reasons_for_being_out_of_work}
              label={Protection_Hhs2_1Options.what_are_the_reasons_for_being_out_of_work}
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
        </Div>
        <Div column sx={{flex: 1}}>
          <SlidePanel title={m.monthlyIncomePerHH}>
            <Lazy deps={[data]} fn={() => {
              const income = chain(ChartHelperOld.single({
                filterValue: ['no_income', 'unable_unwilling_to_answer'],
                data: data.map(_ => _.what_is_the_average_month_income_per_household).compact(),
              }))
                .map(ChartHelperOld.setLabel(Protection_Hhs2_1Options.what_is_the_average_month_income_per_household))
                .map(ChartHelperOld.sortBy.custom(Object.keys(Protection_Hhs2_1Options.what_is_the_average_month_income_per_household)))
                .get

              const hhSize = ChartHelperOld.sumByCategory({
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
              {res => <ChartBar data={res.income} descs={Obj.mapValues(res.hhSize, _ => m.protHHSnapshot.avgHhSize(_.value / (_.base ?? 1)))}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.mainSourceOfIncome}>
            <ChartBarMultipleBy
              by={_ => _.what_are_the_main_sources_of_income_of_your_household}
              data={data}
              filterValue={['unable_unwilling_to_answer']}
              limit={4}
              label={Protection_Hhs2_1Options.what_are_the_main_sources_of_income_of_your_household}
            />
          </SlidePanel>

          <SlidePanel title={m.copyingMechanisms}>
            <ChartBarMultipleBy
              data={data}
              by={_ => _.what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges}
              label={{
                ...Protection_Hhs2_1Options.what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges,
                reducing_consumption_of_food: m.protHHS2.reducing_consumption_of_food,
              }}
              filterValue={['unable_unwilling_to_answer']}
            />
          </SlidePanel>
        </Div>
      </Div>
    </Div>
  )
}