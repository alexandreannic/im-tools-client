import React from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {ChartHelperOld} from '@/shared/charts/chartHelperOld'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {Lazy} from '@/shared/Lazy'
import {toPercent} from '@/utils/utils'
import {snapShotDefaultPieProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {Txt} from 'mui-extension'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {ChartPieWidgetByKey} from '@/shared/charts/ChartPieWidgetByKey'
import {Protection_Hhs2} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2'


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
                  barriersRural: toPercent(ChartHelperOld.percentage({
                    data: data.filter(_ => _.type_of_site === 'rural_area'),
                    value: _ => _.do_you_have_access_to_health_care_in_your_current_location !== 'yes',
                  }).percent, 1),
                  barriersUrban: toPercent(ChartHelperOld.percentage({
                    data: data.filter(_ => _.type_of_site === 'urban_area'),
                    value: _ => _.do_you_have_access_to_health_care_in_your_current_location !== 'yes',
                  }).percent, 1),
                  healthPnCount: data.filter(_ => _.what_is_your_1_priority?.includes('health_1_2') ||
                    _.what_is_your_2_priority?.includes('health_1_2') ||
                    _.what_is_your_3_priority?.includes('health_1_2')).length,
                  healthPn: toPercent(ChartHelperOld.percentage({
                    data: data
                    // .filter(_ => _.what_is_your_1_priority !== 'unable_unwilling_to_answer')
                    ,
                    value: _ => !!(
                      _.what_is_your_1_priority?.includes('health_1_2') ||
                      _.what_is_your_2_priority?.includes('health_1_2') ||
                      _.what_is_your_3_priority?.includes('health_1_2')
                    ),
                  }).percent, 1),
                  healthPnUrban: toPercent(ChartHelperOld.percentage({
                    data: data.filter(_ => _.type_of_site === 'urban_area')
                    // .filter(_ => _.what_is_your_1_priority !== 'unable_unwilling_to_answer')
                    ,
                    value: _ => !!(
                      _.what_is_your_1_priority?.includes('health_1_2') ||
                      _.what_is_your_2_priority?.includes('health_1_2') ||
                      _.what_is_your_3_priority?.includes('health_1_2')
                    ),
                  }).percent, 1),
                  healthPnRural: toPercent(ChartHelperOld.percentage({
                    data: data.filter(_ => _.type_of_site === 'rural_area')
                    // .filter(_ => _.what_is_your_1_priority !== 'unable_unwilling_to_answer')
                    ,
                    value: _ => !!(
                      _.what_is_your_1_priority?.includes('health_1_2') ||
                      _.what_is_your_2_priority?.includes('health_1_2') ||
                      _.what_is_your_3_priority?.includes('health_1_2')
                    ),
                  }).percent, 1)
                }
              }}>
                {_ =>
                  <p>
                    <div>healthPnCount: {_.healthPnCount}</div>
                    <div>healthPn: {_.healthPn}</div>
                    <div>healthPnRural: {_.healthPnRural}</div>
                    <div>healthPnUrban: {_.healthPnUrban}</div>
                    <div>barriersRural: {_.barriersRural}</div>
                    <div>barriersUrban: {_.barriersUrban}</div>
                    Risk of eviction is the top priority concern of IDP respondents (<b>34%</b>). The risk of closure of collective sites in the coming months <Txt color="hint">(Resolution
                    #930)</Txt>, coupled
                    with the rising cost of housing and utilities, are likely to increase precariousness and hardship among IDP communities at the onset of winter.
                  </p>
                }
              </Lazy>
            </SlideTxt>
            <SlidePanel>
              <ChartPieWidgetBy
                {...snapShotDefaultPieProps}
                sx={{mb: 0}}
                title={m.protHHS2.barriersToAccessHealth}
                compare={{before: computed.lastMonth}}
                filter={_ => _.do_you_have_access_to_health_care_in_your_current_location !== 'yes'}
                filterBase={_ => _.do_you_have_access_to_health_care_in_your_current_location !== 'unable_unwilling_to_answer'}
                data={data}
              />
              <ChartBarMultipleBy
                data={data}
                by={_ => _.what_are_the_barriers_to_accessing_health_services}
                label={Protection_Hhs2.options.what_are_the_barriers_to_accessing_health_services}
                filterValue={['unable_unwilling_to_answer']}
                limit={5}
              />
            </SlidePanel>
            <SlidePanel>
              <ChartPieWidgetBy
                {...snapShotDefaultPieProps}
                sx={{mb: 0}}
                title={m.protHHS2.unregisteredDisability}
                filter={_ => _.do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov !== 'yes_all'}
                filterBase={_ => _.do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov !== 'unable_unwilling_to_answer'}
                compare={{before: computed.lastMonth}}
                data={data}
              />
              <ChartBarSingleBy
                data={data}
                by={_ => _.why_dont_they_have_status}
                filter={_ => _.why_dont_they_have_status !== 'unable_unwilling_to_answer'}
                label={{
                  ...Protection_Hhs2.options.why_dont_they_have_status,
                  inability_to_access_registration_safety_risks: 'Inability to access registration',
                  status_registration_not_requested: 'Disability status not applied for',
                  status_registration_rejected_not_meeting_the_criteria_as_per_ukrainian_procedure: 'Status registration rejected',
                }}
                mergeOptions={{
                  inability_to_access_registration_costly_andor_lengthy_procedure: 'inability_to_access_registration_safety_risks',
                  inability_to_access_registration_distance_andor_lack_of_transportation: 'inability_to_access_registration_safety_risks',
                  delays_in_registration_process: 'other_specify',
                  unaware_ofnot_familiar_with_the_procedure: 'other_specify',
                  status_renewal_rejected: 'other_specify',
                }}
              />
            </SlidePanel>
          </Div>
          <Div column>
            <SlidePanel>
              <ChartPieWidgetByKey
                {...snapShotDefaultPieProps}
                compare={{before: computed.lastMonth}}
                title={m.protHHS2.mainConcernsRegardingHousing}
                property="what_are_your_main_concerns_regarding_your_accommodation"
                filter={_ => !_.includes('none')}
                data={data}
                sx={{mb: 0}}
              />
              <ChartBarMultipleBy
                data={data}
                by={_ => _.what_are_your_main_concerns_regarding_your_accommodation}
                label={Protection_Hhs2.options.what_are_your_main_concerns_regarding_your_accommodation}
                filterValue={['unable_unwilling_to_answer', 'none']}
              />
            </SlidePanel>
            <SlidePanel>
              <SlidePanelTitle>{m.accommodationCondition}</SlidePanelTitle>
              <ChartBarSingleBy
                data={data}
                by={_ => _.what_is_the_general_condition_of_your_accommodation}
                sortBy={ChartHelperOld.sortBy.custom([
                  'sound_condition',
                  'partially_damaged',
                  'severely_damaged',
                  'destroyed',
                  'unfinished',
                ])}
                label={Protection_Hhs2.options.what_is_the_general_condition_of_your_accommodation}
                filter={_ => _.what_is_the_general_condition_of_your_accommodation !== 'unable_unwilling_to_answer'}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}