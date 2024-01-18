import React from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/shared/chart/chartHelper'
import {toPercent} from '@/utils/utils'
import {KoboPieChartIndicator} from '@/shared/chart/KoboPieChartIndicator'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {snapShotDefaultPieProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'

export const SnapshotProtMonitoNN2Safety = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()

  return (
    <PdfSlide>
      <SlideHeader>{m.snapshotProtMonito.safetyProtectionIncidents}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt>
              <Lazy deps={[data]} fn={() => {
                return {
                  fearOfShelling: toPercent(ChartTools.percentage({
                    data: data.map(_ => _.what_are_the_main_factors_that_make_this_location_feel_unsafe).compact(),
                    value: _ => _.includes('bombardment_shelling_or_threat_of_shelling'),
                    base: _ => !_.includes('unable_unwilling_to_answer'),
                  }).percent, 0),
                  barrierToMovement: toPercent(ChartTools.percentage({
                    data: data.map(_ => _.do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area).compact(),
                    value: _ => !_.includes('no'),
                    base: _ => !_.includes('unable_unwilling_to_answer'),
                  }).percent, 0),
                }
              }}>
                {_ =>
                  <p
                    //   dangerouslySetInnerHTML={{
                    //   __html: m.snapshotProtMonito.nn2.safety(_)
                    // }}
                  >
                    96% of respondents indicating feeling unsafe or very unsafe reported shelling/threat of shelling as the main factor. Families with members serving with the
                    military in the frontlines, as well as isolated elderly and persons with disabilities who were unable to flee because of age or physical impairment and/or lack
                    of financial resources and who suffer from the breakdown of their usual support system, are particularly prone to high levels of anxiety and loneliness.
                  </p>
                }
              </Lazy>
            </SlideTxt>
            <SlidePanel>
              <SlidePanelTitle>{m.majorStressFactors}</SlidePanelTitle>
              <ProtHHS2BarChart
                data={data}
                questionType="multiple"
                filterValue={['unable_unwilling_to_answer']}
                question="what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members"
              />
            </SlidePanel>
          </Div>
          <Div column>
            <SlidePanel>
              <KoboPieChartIndicator
                title={m.protHHS2.poorSenseOfSafety}
                question="please_rate_your_sense_of_safety_in_this_location"
                filter={_ => _ === '_2_unsafe' || _ === '_1_very_unsafe'}
                filterBase={_ => _ !== 'unable_unwilling_to_answer'}
                compare={{before: computed.lastMonth}}
                data={data}
                {...snapShotDefaultPieProps}
              />
              <ProtHHS2BarChart
                questionType="single"
                data={data}
                sortBy={ChartTools.sortBy.custom([
                  '_1_very_unsafe',
                  '_2_unsafe',
                  '_3_safe',
                  '_4_very_safe',
                ])}
                question="please_rate_your_sense_of_safety_in_this_location"
                filterValue={['unable_unwilling_to_answer']}
              />
              <SlidePanelTitle sx={{mt: 4}}>{m.influencingFactors}</SlidePanelTitle>
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                question="what_are_the_main_factors_that_make_this_location_feel_unsafe"
                filterValue={['unable_unwilling_to_answer']}
              />
            </SlidePanel>
            <SlidePanel>
              <KoboPieChartIndicator
                title={m.protHHS2.freedomOfMovement}
                question="do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area"
                filter={_ => !_.includes('no')}
                filterBase={_ => !_.includes('unable_unwilling_to_answer')}
                compare={{before: computed.lastMonth}}
                data={data}
                {...snapShotDefaultPieProps}
              />
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                question="do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area"
                filterValue={['no', 'unable_unwilling_to_answer']}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}