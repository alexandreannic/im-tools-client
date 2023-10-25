import React from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/core/chartTools'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {chain, mapObjectValue, toPercent} from '@/utils/utils'
import {Protection_Hhs2_1Options} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {snapShotDefaultPieProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'

export const SnapshotProtMonitoEchoLivelihood = () => {
  const {data, computed, periodFilter} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()

  return (
    <PdfSlide>
      <SlideHeader>{m.snapshotProtMonito.livelihood}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt>
              <Lazy deps={[data, computed.lastMonth]} fn={d => ChartTools.percentage({
                value: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes',
                data: d,
                base: _ => _ !== undefined,
              })}>
                {_ =>
                  <p
                    // dangerouslySetInnerHTML={{
                    // __html: m.snapshotProtMonito.echo.livelihood({
                    //   outOfWork: toPercent(_.percent, 0),
                  >
                    The percentage of surveyed individuals out of work and seeking employment
                    remains quite high at 18% of responses. The primary factors contributing to unemployment
                    were reported to be lack of available jobs, lack of childcare, and skills not matching
                    the demand. As a result of the limited livelihood opportunities or challenges in accessing
                    livelihoods, a considerable proportion of the surveyed population is currently dependent on
                    social protection schemes and humanitarian assistance.
                  </p>
                }
              </Lazy>
            </SlideTxt>
            <SlidePanel>
              <SlidePanelTitle>{m.monthlyIncomePerHH}</SlidePanelTitle>
              <Lazy deps={[data]} fn={() => {
                const income = chain(ChartTools.single({
                  filterValue: ['no_income', 'unable_unwilling_to_answer'],
                  data: data.map(_ => _.what_is_the_average_month_income_per_household).compact(),
                }))
                  .map(ChartTools.setLabel(Protection_Hhs2_1Options.what_is_the_average_month_income_per_household))
                  .map(ChartTools.sortBy.custom(Object.keys(Protection_Hhs2_1Options.what_is_the_average_month_income_per_household)))
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
          </Div>
          <Div column>
            <Div>
              <SlidePanel sx={{flex: 1}}>
                <Lazy deps={[data, computed.lastMonth]} fn={d => ChartTools.percentage({
                  value: _ => _.including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment === 'yes',
                  data: d,
                  base: _ => _ !== undefined,
                })}>
                  {(_, last) => <PieChartIndicator
                    title={m.hhOutOfWork}
                    value={_.value}
                    base={_.base} evolution={_.percent - last.percent}
                    {...snapShotDefaultPieProps}
                  />}
                </Lazy>
              </SlidePanel>

              <SlidePanel sx={{flex: 1}}>
                <Lazy deps={[data, computed.lastMonth]} fn={d => ChartTools.percentage({
                  value: _ => _.are_there_gaps_in_meeting_your_basic_needs === 'yes_somewhat' || _.are_there_gaps_in_meeting_your_basic_needs === 'yes_a_lot',
                  data: d,
                })}>
                  {(_, last) => <PieChartIndicator
                    title={m.hhWithGapMeetingBasicNeeds}
                    value={_.value}
                    base={_.base}
                    evolution={_.percent - last.percent}
                    {...snapShotDefaultPieProps}
                  />}
                </Lazy>
              </SlidePanel>
            </Div>

            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.mainSourceOfIncome}</SlidePanelTitle>
              <ProtHHS2BarChart
                question="what_are_the_main_sources_of_income_of_your_household"
                data={data}
                filterValue={['unable_unwilling_to_answer']}
                questionType="multiple"
                limit={4}
              />
            </SlidePanel>
            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.unemploymentFactors}</SlidePanelTitle>
              <ProtHHS2BarChart
                data={data}
                question="what_are_the_reasons_for_being_out_of_work"
                questionType="multiple"
                filterValue={['unable_unwilling_to_answer']}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}