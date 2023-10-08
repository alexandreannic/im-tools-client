import React from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/core/chartTools'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {getIdpsAnsweringRegistrationQuestion} from '@/features/Dashboard/DashboardHHS2/DashboardProtHHS2Document'
import {chain, toPercent} from '@/utils/utils'
import {Protection_Hhs2_1Options} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {snapShotDefaultPieProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {Person} from '@/core/type'

export const SnapshotProtMonitoEchoRegistration = () => {
  const {data, computed, periodFilter} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  return (
    <PdfSlide>
      <SlideHeader>{m.protHHSnapshot.titles.document}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <Lazy deps={[data]} fn={() => {
              const z = ChartTools.byCategory({
                categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
                data: computed.flatData,
                filter: _ => !_.lackDoc.includes('none'),
              })
              return z[OblastIndex.findISOByName('Kharkivska')]
            }}>
              {_ =>
                <SlideTxt>
                  <p dangerouslySetInnerHTML={{__html: m.snapshotProtMonito.echo.registration({hrkLackPersonalDoc: toPercent(_.percent, 0)})}}/>
                </SlideTxt>
              }
            </Lazy>
            <SlidePanel>
              <SlidePanelTitle sx={{mb: 2}}>{m.protHHSnapshot.maleWithoutIDPCert}</SlidePanelTitle>
              <Div>
                <Lazy deps={[data, computed.lastMonth]} fn={d => ChartTools.percentage({
                  data: getIdpsAnsweringRegistrationQuestion(d),
                  value: _ => _.isIdpRegistered !== 'yes' && _.are_you_and_your_hh_members_registered_as_idps !== 'yes_all'
                })}>
                  {(d, l) => (
                    <PieChartIndicator
                      title={m.all}
                      value={d.value}
                      base={d.base}
                      evolution={d.percent - l.percent}
                      {...snapShotDefaultPieProps}
                      sx={{
                        ...snapShotDefaultPieProps.sx,
                        flex: 1
                      }}
                    />
                  )}
                </Lazy>
                <Lazy deps={[data, computed.lastMonth]} fn={d => ChartTools.percentage({
                  data: getIdpsAnsweringRegistrationQuestion(d).filter(_ => _.age && _.age >= 18 && _.age <= 60 && _.gender && _.gender === Person.Gender.Male),
                  value: _ => _.isIdpRegistered !== 'yes' && _.are_you_and_your_hh_members_registered_as_idps !== 'yes_all'
                })}>
                  {(d, l) => (
                    <PieChartIndicator
                      title={m.protHHSnapshot.male1860}
                      value={d.value}
                      base={d.base}
                      evolution={d.percent - l.percent}
                      {...snapShotDefaultPieProps}
                      sx={{
                        ...snapShotDefaultPieProps.sx,
                        flex: 1
                      }}
                    />
                  )}
                </Lazy>
              </Div>
            </SlidePanel>
            <SlidePanel>
              <KoboPieChartIndicator
                compare={{before: computed.lastMonth}}
                title={m.protHHS2.accessBarriersToObtainDocumentation}
                question="have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation"
                filter={_ => !_.includes('no')}
                filterBase={_ => !_?.includes('unable_unwilling_to_answer')}
                data={data}
                {...snapShotDefaultPieProps}
              />
              <ProtHHS2BarChart
                questionType="multiple"
                data={data}
                question="have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation"
                mergeOptions={{
                  distrust_of_public_institutions_and_authorities: 'other_specify',
                  discrimination: 'other_specify',
                  distance_or_cost_of_transportation: 'other_specify',
                }}
                filterValue={[
                  'no',
                  'unable_unwilling_to_answer',
                ]}
              />
            </SlidePanel>
          </Div>
          <Div column>
            <SlidePanel>
              <Lazy deps={[data, computed.lastMonth]} fn={(x) => ChartTools.percentage({
                data: x.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
                value: _ => !_.includes('none')
              })}>
                {(_, last) => <PieChartIndicator
                  title={m.lackOfPersonalDoc}
                  value={_.value}
                  base={_.base}
                  {...snapShotDefaultPieProps}
                />}
              </Lazy>
              <Lazy deps={[data]} fn={() => chain(ChartTools.multiple({
                data: data.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
                filterValue: ['none', 'unable_unwilling_to_answer'],
              }))
                .map(ChartTools.setLabel(Protection_Hhs2_1Options.does_1_lack_doc))
                .map(ChartTools.sortBy.value)
                .get}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel>
              <KoboPieChartIndicator
                hideEvolution
                compare={{before: computed.lastMonth}}
                title={m.lackOfHousingDoc}
                filterBase={_ => !_.includes('unable_unwilling_to_answer')}
                filter={_ => !_.includes('none')}
                data={data}
                question={'what_housing_land_and_property_documents_do_you_lack'}
                {...snapShotDefaultPieProps}
              />
              <ProtHHS2BarChart
                data={data}
                question="what_housing_land_and_property_documents_do_you_lack"
                questionType="multiple"
                filterValue={['unable_unwilling_to_answer', 'none']}
                mergeOptions={{
                  cost_estimation_certificate_state_commission_issued_when_personal_request_is_made: 'other_specify',
                  inheritance_certificate: 'other_specify',
                  // death_certificate_of_predecessor: 'other_specify',
                  document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: 'document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed',
                  informatsiyna_dovidka_informational_extract_on_damaged_property: 'other_specify',
                  death_declaration_certificate_by_ambulance_or_police_of_predecessor: 'other_specify',
                  construction_stage_substituted_with_bti_certificate_following_completion_of_construction: 'other_specify',
                  inheritance_will: 'other_specify',
                }}
                overrideLabel={{
                  construction_stage_substituted_with_bti_certificate_following_completion_of_construction: 'Construction stage',
                  document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed: 'Document issued by authority',
                  // document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed: 'Document issued by local self-government proving a damaged house',
                  cost_estimation_certificate_state_commission_issued_when_personal_request_is_made: 'Cost estimation certificate - state commission',
                  // document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: 'Document issued by authority proving a damaged house',
                }}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}