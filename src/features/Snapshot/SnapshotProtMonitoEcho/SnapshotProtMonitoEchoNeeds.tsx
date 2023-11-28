import React from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {ChartTools} from '@/core/chartTools'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {Lazy} from '@/shared/Lazy'
import {toPercent} from '@/utils/utils'
import {snapShotDefaultPieProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'


export const SnapshotProtMonitoEchoNeeds = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()

  return (
    <PdfSlide>
      <SlideHeader>{m.snapshotProtMonito.basicNeeds}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt>
              <Lazy deps={[data]} fn={() => {
                return {
                  barriersRural: toPercent(ChartTools.percentage({
                    data: data.filter(_ => _.type_of_site === 'rural_area'),
                    value: _ => _.do_you_have_access_to_health_care_in_your_current_location !== 'yes',
                  }).percent, 0),
                  barriersUrban: toPercent(ChartTools.percentage({
                    data: data.filter(_ => _.type_of_site === 'urban_area'),
                    value: _ => _.do_you_have_access_to_health_care_in_your_current_location !== 'yes',
                  }).percent, 0),
                  healthPn: toPercent(ChartTools.percentage({
                    data: data.filter(_ => _.what_is_your_1_priority !== 'unable_unwilling_to_answer'),
                    value: _ => _.what_is_your_1_priority?.includes('health_1_2')
                      || _.what_is_your_2_priority?.includes('health_1_2')
                      || _.what_is_your_3_priority?.includes('health_1_2'),
                  }).percent, 0)
                }
              }}>
                {_ =>
                  <p dangerouslySetInnerHTML={{
                    __html: m.snapshotProtMonito.echo.needs(_)
                  }}/>
                }
              </Lazy>
            </SlideTxt>
            <SlidePanel>
              <KoboPieChartIndicator
                {...snapShotDefaultPieProps}
                sx={{mb: 0}}
                title={m.protHHS2.barriersToAccessHealth}
                compare={{before: computed.lastMonth}}
                question="do_you_have_access_to_health_care_in_your_current_location"
                filter={_ => _ !== 'yes'}
                filterBase={_ => _ !== 'unable_unwilling_to_answer'}
                data={data}
              />
              <ProtHHS2BarChart
                data={data}
                limit={5}
                questionType="multiple"
                question="what_are_the_barriers_to_accessing_health_services"
                filterValue={['unable_unwilling_to_answer']}
              />
            </SlidePanel>
            <SlidePanel>
              <KoboPieChartIndicator
                {...snapShotDefaultPieProps}
                sx={{mb: 0}}
                title={m.protHHS2.unregisteredDisability}
                question="do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov"
                filter={_ => _ !== 'yes_all'}
                compare={{before: computed.lastMonth}}
                filterBase={_ => _ !== 'unable_unwilling_to_answer'}
                data={data}
              />
              <ProtHHS2BarChart
                data={data}
                question="why_dont_they_have_status"
                filterValue={['unable_unwilling_to_answer']}
                overrideLabel={{
                  status_registration_not_requested: 'Disability status not applied for',
                  status_registration_rejected_not_meeting_the_criteria_as_per_ukrainian_procedure: 'Status registration rejected',
                }}
                mergeOptions={{
                  delays_in_registration_process: 'other_specify',
                  unaware_ofnot_familiar_with_the_procedure: 'other_specify',
                }}
              />
            </SlidePanel>
          </Div>
          <Div column>
            <SlidePanel>
              <KoboPieChartIndicator
                {...snapShotDefaultPieProps}
                compare={{before: computed.lastMonth}}
                title={m.protHHS2.mainConcernsRegardingHousing}
                question="what_are_your_main_concerns_regarding_your_accommodation"
                filter={_ => !_.includes('none')}
                data={data}
                sx={{mb: 0}}
              />
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                question="what_are_your_main_concerns_regarding_your_accommodation"
                filterValue={['unable_unwilling_to_answer', 'none']}
              />
            </SlidePanel>
            <SlidePanel>
              <SlidePanelTitle>{m.accommodationCondition}</SlidePanelTitle>
              <ProtHHS2BarChart
                data={data}
                question="what_is_the_general_condition_of_your_accommodation"
                sortBy={ChartTools.sortBy.custom([
                  'sound_condition',
                  'partially_damaged',
                  'severely_damaged',
                  'destroyed',
                  'unfinished',
                ])}
                filterValue={['unable_unwilling_to_answer']}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}