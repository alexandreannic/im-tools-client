import {Pdf} from '@/shared/PdfLayout/PdfLayout'
import React from 'react'
import {Box, Checkbox, Icon} from '@mui/material'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
import {format, sub} from 'date-fns'
import {DRCLogo, EULogo} from '@/shared/logo/logo'
import {AAStackedBarChart} from '@/shared/Chart/AaStackedBarChart'
import {ageGroup} from '@/core/type'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {PanelTitle} from '@/shared/Panel'
import {KoboLineChartDate} from '@/features/Dashboard/shared/KoboLineChartDate'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {Lazy} from '@/shared/Lazy'
import {chain} from '@/utils/utils'
import {ChartTools} from '@/core/chartTools'
import {ProtHHS_2_1Options} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'

export const SnapshotProtMonitoEchoDisplacement = () => {
  const {data, computed, periodFilter} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  return (
    <PdfSlide>
      <SlideHeader>{m.displacement}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt>
              <p dangerouslySetInnerHTML={{__html: m.snapshotProtMonito.echo.displacement}}/>
            </SlideTxt>
            <SlidePanel>
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
            <SlidePanel>
              <SlidePanelTitle>{m.displacementAndReturn}</SlidePanelTitle>
              <KoboLineChartDate
                height={200}
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
            <Box>
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
            </Box>
            <Box>
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
            </Box>
            <Box>
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
                mergeOptions={{
                  cessation_of_hostilities: 'improved_security_situation',
                }}
              />
            </Box>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}