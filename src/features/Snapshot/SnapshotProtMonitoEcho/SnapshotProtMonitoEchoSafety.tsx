import React, {useMemo} from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/core/chartTools'
import {chain, toPercent} from '@/utils/utils'
import {Protection_Hhs2_1Options} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {KoboUkraineMap} from '@/features/Dashboard/shared/KoboUkraineMap'
import {snapShotDefaultPieProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {Protection_Hhs2_1} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'

export const SnapshotProtMonitoEchoSafety = () => {
  const {data, computed, periodFilter} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()

  const groupedIndividualsType = useMemo(() => {
    const res = {
      type: Arr() as _Arr<Protection_Hhs2_1['what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence']>,
      when: Arr() as _Arr<Protection_Hhs2_1['when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence']>,
      who: Arr() as _Arr<Protection_Hhs2_1['who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence']>,
    }
    data.forEach(_ => {
      res.type.push(...[
        _.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_boy_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_girl_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_other_member_experienced_violence,
      ])
      res.when.push(...[
        _.when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_boy_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_girl_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_other_member_experienced_violence,
      ])
      res.who.push(...[
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence,
      ])
    })
    return res
  }, [data])

  return (
    <PdfSlide>
      <SlideHeader>{m.snapshotProtMonito.safetyProtectionIncidents}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt>
              <Lazy deps={[data]} fn={() => {
                return {
                  senseOfSafety: ChartTools.percentage({
                    data: data.map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  poorSafetyChernihiv: ChartTools.percentage({
                    data: data.filter(_ => _.where_are_you_current_living_oblast === OblastIndex.findISOByName('Chernihivska')).map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  poorSafetySumy: ChartTools.percentage({
                    data: data.filter(_ => _.where_are_you_current_living_oblast === OblastIndex.findISOByName('Sumska')).map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  senseOfSafetyUrban: ChartTools.percentage({
                    data: data.filter(_ => _.type_of_site === 'urban_area').map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  senseOfSafetyRural: ChartTools.percentage({
                    data: data.filter(_ => _.type_of_site === 'rural_area').map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  incidents: ChartTools.percentage({
                    data,
                    value: _ => _.has_any_adult_male_member_experienced_violence === 'yes'
                      || _.has_any_adult_female_member_experienced_violence === 'yes'
                      || _.has_any_boy_member_experienced_violence === 'yes'
                      || _.has_any_girl_member_experienced_violence === 'yes'
                      || _.has_any_other_member_experienced_violence === 'yes',
                  })
                }
              }}>
                {_ =>
                  <p dangerouslySetInnerHTML={{
                    __html: m.snapshotProtMonito.echo.safety({
                      poorSafety: toPercent(_.senseOfSafety.percent, 0),
                      poorSafetyChernihiv: toPercent(_.poorSafetyChernihiv.percent, 0),
                      poorSafetySumy: toPercent(_.poorSafetySumy.percent, 0),
                      poorSafetyUrban: toPercent(_.senseOfSafetyUrban.percent, 0),
                      poorSafetyRural: toPercent(_.senseOfSafetyRural.percent, 0),
                      protectionIncident: toPercent(_.incidents.percent, 0)
                    })
                  }}/>
                }
              </Lazy>
            </SlideTxt>
            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.typeOfIncident}</SlidePanelTitle>
              <Lazy deps={[groupedIndividualsType.type]} fn={() =>
                chain(ChartTools.multiple({
                  data: groupedIndividualsType.type,
                  filterValue: ['unable_unwilling_to_answer']
                }))
                  .map(ChartTools.setLabel(Protection_Hhs2_1Options.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence))
                  .map(ChartTools.sortBy.value)
                  .get
              }>
                {_ => (
                  <HorizontalBarChartGoogle data={_}/>
                )}
              </Lazy>
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
              <KoboUkraineMap
                sx={{mx: 4}}
                data={data}
                getOblast={_ => _.where_are_you_current_living_oblast as any}
                value={_ => _.please_rate_your_sense_of_safety_in_this_location === '_1_very_unsafe'
                  || _.please_rate_your_sense_of_safety_in_this_location === '_2_unsafe'}
                base={_ => _.please_rate_your_sense_of_safety_in_this_location !== 'unable_unwilling_to_answer' &&
                  _.please_rate_your_sense_of_safety_in_this_location !== undefined}
              />
              <SlidePanelTitle sx={{mt: 4}}>{m.influencingFactors}</SlidePanelTitle>
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                question="what_are_the_main_factors_that_make_this_location_feel_unsafe"
                filterValue={['unable_unwilling_to_answer']}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}