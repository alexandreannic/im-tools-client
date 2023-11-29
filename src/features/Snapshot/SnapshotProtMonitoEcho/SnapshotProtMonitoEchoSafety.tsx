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
import {seq, Seq} from '@alexandreannic/ts-utils'
import {Protection_Hhs2_1} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {useTheme} from '@mui/material'

export const SnapshotProtMonitoEchoSafety = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  const t = useTheme()
  const groupedIndividualsType = useMemo(() => {
    const res = {
      type: seq() as Seq<Protection_Hhs2_1['what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence']>,
      when: seq() as Seq<Protection_Hhs2_1['when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence']>,
      who: seq() as Seq<Protection_Hhs2_1['who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence']>,
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
            <SlideTxt sx={{marginBottom: t.spacing() + ' !important'}}>
              <Lazy deps={[data]} fn={() => {
                return {
                  senseOfSafety: ChartTools.percentage({
                    data: data.map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  poorSafetyChernihiv: ChartTools.percentage({
                    data: data.filter(_ => _.where_are_you_current_living_oblast === OblastIndex.byName('Chernihivska').iso).map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  poorSafetySumy: ChartTools.percentage({
                    data: data.filter(_ => _.where_are_you_current_living_oblast === OblastIndex.byName('Sumska').iso).map(_ => _.please_rate_your_sense_of_safety_in_this_location),
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
                  <p
                    //   dangerouslySetInnerHTML={{
                    //   __html: m.snapshotProtMonito.echo.safety({
                    //     poorSafety: toPercent(_.senseOfSafety.percent, 0),
                    //     poorSafetyChernihiv: toPercent(_.poorSafetyChernihiv.percent, 0),
                    //     poorSafetySumy: toPercent(_.poorSafetySumy.percent, 0),
                    //     poorSafetyUrban: toPercent(_.senseOfSafetyUrban.percent, 0),
                    //     poorSafetyRural: toPercent(_.senseOfSafetyRural.percent, 0),
                    //     protectionIncident: toPercent(_.incidents.percent, 0)
                    //   })
                    // }}
                  >
                    Perceptions of safety vary significantly depending on the surveyed area. Overall <b>37%</b> of respondents indicated a poor sense of safety mainly due to
                    shelling presence or armed actors and UXOs contamination. This figure is particularly high in the areas of
                    Kherson (<b>60%</b>), Sumy (<b>43%</b>) and Chernihiv (<b>38%</b>). <b>1%</b> of respondents reported protection incidents experienced by
                    household members over the past 6 months.
                  </p>
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
                  .map(ChartTools.setLabel({
                    ...Protection_Hhs2_1Options.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence,
                    // TODO TO REMOVE
                    other_specify: 'Psychological abuse',
                  }))
                  .map(ChartTools.sortBy.value)
                  .get
              }>
                {_ => (
                  <HorizontalBarChartGoogle data={_}/>
                )}
              </Lazy>
            </SlidePanel>
            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.freedomOfMovement}</SlidePanelTitle>
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                limit={5}
                overrideLabel={{
                  lack_of_transportationfinancial_resources_to_pay_transportation: 'Lack of transportation'
                }}
                question="do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area"
                filterValue={['no', 'unable_unwilling_to_answer']}
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
              <KoboUkraineMap
                sx={{mx: 4}}
                data={data}
                getOblast={_ => _.where_are_you_current_living_oblast as any}
                value={_ => _.please_rate_your_sense_of_safety_in_this_location === '_1_very_unsafe'
                  || _.please_rate_your_sense_of_safety_in_this_location === '_2_unsafe'}
                base={_ => _.please_rate_your_sense_of_safety_in_this_location !== 'unable_unwilling_to_answer' &&
                  _.please_rate_your_sense_of_safety_in_this_location !== undefined}
              />
              <SlidePanelTitle sx={{mt: 2}}>{m.influencingFactors}</SlidePanelTitle>
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                question="what_are_the_main_factors_that_make_this_location_feel_unsafe"
                filterValue={['unable_unwilling_to_answer']}
                // mergeOptions={{
                //   intercommunity_tensions: 'other_specify',
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}