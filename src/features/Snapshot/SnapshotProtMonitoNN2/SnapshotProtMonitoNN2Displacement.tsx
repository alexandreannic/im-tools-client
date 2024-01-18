import React from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {KoboLineChartDate} from '@/shared/Chart/KoboLineChartDate'
import {snapshotColors} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'

export const SnapshotProtMonitoNN2Displacement = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  return (
    <PdfSlide>
      <SlideHeader>{m.displacement}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt sx={{mb: .5}} block>
              IDPs surveyed in Mykolaiv Oblast are originally from Kherson Oblast and from different parts of Mykolaiv Oblast itself. The primary drivers prompting their departure
              encompassed a range of factors, such as shelling and attacks on civilians, the destruction of critical infrastructure, housing, land, or property due to conflict, and
              the pervasive fear of conscription. Notably, respondents reported that adult men often refrain from leaving their homes to evade conscription, and the requirement of
              holding an exemption certificate adds an additional layer of limitation to their access to formal employment. A significant 90% of surveyed IDPs expressed their
              intention to return to their place of habitual residence once the security situation improves.
            </SlideTxt>

            <SlidePanel>
              <SlidePanelTitle>{m.displacementAndReturn}</SlidePanelTitle>
              <KoboLineChartDate
                colors={snapshotColors}
                height={258}
                data={data}
                start={new Date(2022, 0, 1)}
                curves={{
                  [m.departureFromAreaOfOrigin]: _ => _.when_did_you_leave_your_area_of_origin,
                  [m.returnToOrigin]: _ => _.when_did_you_return_to_your_area_of_origin,
                }}
                label={[m.departureFromAreaOfOrigin, m.returnToOrigin]}
                end={computed.end}
              />
            </SlidePanel>
          </Div>

          <Div column>

            <SlidePanel>
              <SlidePanelTitle>{m.intentions}</SlidePanelTitle>
              <ProtHHS2BarChart
                data={computed.idps}
                question="what_are_your_households_intentions_in_terms_of_place_of_residence"
                filterValue={['unable_unwilling_to_answer']}
                overrideLabel={{
                  integrate_into_the_local_community_of_current_place_of_residence: m.snapshotProtMonito.integrateIntoTheLocalCommunity,
                  return_to_the_area_of_origin: m.returnToThePlaceOfHabitualResidence
                }}
              />
            </SlidePanel>

            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.factorToReturn}</SlidePanelTitle>
              <ProtHHS2BarChart
                data={computed.idps}
                filterValue={['unable_unwilling_to_answer']}
                questionType="multiple"
                question="what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin"
                overrideLabel={{
                  increased_restored_access_to_livelihood_employment_and_economic_opportunities: 'Increased/restored access to livelihood/employment',
                  repaired_housing_compensation_for_destroyedor_damaged_property: 'Repaired housing/compensation for damaged property',
                }}
                // mergeOptions={{
                //   cessation_of_hostilities: 'improved_security_situation',
              />
            </SlidePanel>

            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.factorToHelpIntegration}</SlidePanelTitle>
              <ProtHHS2BarChart
                data={computed.idps}
                filterValue={['unable_unwilling_to_answer']}
                questionType="multiple"
                question="what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community"
                overrideLabel={{
                  access_to_essential_services: 'Access to essential services',
                }}
              />
            </SlidePanel>

          </Div>
        </Div>
        {/*<Div>*/}
        {/*  <SlidePanel sx={{flex: 1}}>*/}
        {/*    <SlidePanelTitle>{m.protHHS2.factorToReturn}</SlidePanelTitle>*/}
        {/*    <ProtHHS2BarChart*/}
        {/*      data={computed.idps}*/}
        {/*      filterValue={['unable_unwilling_to_answer']}*/}
        {/*      questionType="multiple"*/}
        {/*      question="what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin"*/}
        {/*      overrideLabel={{*/}
        {/*        increased_restored_access_to_livelihood_employment_and_economic_opportunities: 'Increased/restored access to livelihood/employment',*/}
        {/*        repaired_housing_compensation_for_destroyedor_damaged_property: 'Repaired housing/compensation for damaged property',*/}
        {/*        improved_security_situation: 'Improved security situation / Cessation of hostilities'*/}
        {/*      }}*/}
        {/*      mergeOptions={{*/}
        {/*        cessation_of_hostilities: 'improved_security_situation',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </SlidePanel>*/}
        {/*  <SlidePanel sx={{flex: 1}}>*/}
        {/*    <SlidePanelTitle>{m.protHHS2.factorToHelpIntegration}</SlidePanelTitle>*/}
        {/*    <ProtHHS2BarChart*/}
        {/*      data={computed.idps}*/}
        {/*      filterValue={['unable_unwilling_to_answer']}*/}
        {/*      questionType="multiple"*/}
        {/*      question="what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community"*/}
        {/*      overrideLabel={{*/}
        {/*        access_to_essential_services: 'Access to essential services',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </SlidePanel>*/}
        {/*</Div>*/}
      </PdfSlideBody>
    </PdfSlide>
  )
}