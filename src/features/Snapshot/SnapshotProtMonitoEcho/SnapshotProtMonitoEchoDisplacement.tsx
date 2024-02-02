import React from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {ChartLineByDate} from '@/shared/charts/ChartLineByDate'
import {snapshotColors} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {Txt} from 'mui-extension'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {Protection_Hhs2_1Options} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'

export const SnapshotProtMonitoEchoDisplacement = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  const t = useTheme()
  return (
    <PdfSlide>
      <SlideHeader>{m.displacement}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt sx={{mb: .5}} block>
              Compared to the previous monitoring month, a higher proportion of IDP respondents indicated their intention to integrate into the local community <Txt bold
                                                                                                                                                                     sx={{color: t.palette.success.main}}>(+15%)</Txt>.
              Conversely, a lower proportion of IDP respondents indicated their intention to return. However, the scarcity of affordable housing poses a significant obstacle to the
              integration of IDPs.
            </SlideTxt>

            <SlidePanel>
              <SlidePanelTitle>{m.intentions}</SlidePanelTitle>
              <ChartBarSingleBy
                data={computed.idps}
                by={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence}
                filter={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence !== 'unable_unwilling_to_answer'}
                label={{
                  ...Protection_Hhs2_1Options.what_are_your_households_intentions_in_terms_of_place_of_residence,
                  integrate_into_the_local_community_of_current_place_of_residence: m.snapshotProtMonito.integrateIntoTheLocalCommunity,
                  return_to_the_area_of_origin: m.returnToThePlaceOfHabitualResidence
                }}
              />
            </SlidePanel>

            <SlidePanel sx={{flex: 1}}>
              <SlidePanelTitle>{m.protHHS2.factorToReturn}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={computed.idps}
                filterValue={['unable_unwilling_to_answer']}
                by={_ => _.what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin}
                label={{
                  ...Protection_Hhs2_1Options.what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin,
                  increased_restored_access_to_livelihood_employment_and_economic_opportunities: 'Increased/restored access to livelihood/employment',
                  repaired_housing_compensation_for_destroyedor_damaged_property: 'Repaired housing/compensation for damaged property',
                  improved_security_situation: 'Improved security situation / Cessation of hostilities'
                }}
                mergeOptions={{
                  cessation_of_hostilities: 'improved_security_situation',
                }}
              />
            </SlidePanel>
          </Div>

          <Div column>

            <SlidePanel BodyProps={{sx: {paddingBottom: t => t.spacing(.25) + ' !important'}}}>
              <SlidePanelTitle>{m.idpPopulationByOblast}</SlidePanelTitle>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <UkraineMap sx={{flex: 1}} data={computed.idpsByOriginOblast} base={computed.idps.length} title={m.originOblast}/>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                  <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                  <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                </Box>
                <UkraineMap sx={{flex: 1}} data={computed.byCurrentOblast} base={computed.idps.length} legend={false} title={m.currentOblast}/>
              </Box>
            </SlidePanel>

            <SlidePanel BodyProps={{sx: {paddingBottom: t => t.spacing(.25) + ' !important'}}}>
              <SlidePanelTitle>{m.displacementAndReturn}</SlidePanelTitle>
              <ChartLineByDate
                sx={{ml: -5}}
                colors={snapshotColors}
                height={188}
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

            <SlidePanel sx={{flex: 1}} BodyProps={{sx: {paddingBottom: t => t.spacing(.5) + ' !important'}}}>
              <SlidePanelTitle>{m.protHHS2.factorToHelpIntegration}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={computed.idps}
                filterValue={['unable_unwilling_to_answer']}
                by={_ => _.what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community}
                label={{
                  ...Protection_Hhs2_1Options.what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community,
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
        {/*      label={{*/}
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
        {/*      label={{*/}
        {/*        access_to_essential_services: 'Access to essential services',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </SlidePanel>*/}
        {/*</Div>*/}
      </PdfSlideBody>
    </PdfSlide>
  )
}