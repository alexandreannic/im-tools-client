import {SlideContainer, SlidePanel} from '@/shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React, {useMemo} from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '@/utils/utils'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {KoboPieChartIndicator} from '../shared/KoboPieChartIndicator'

export const DashboardProtHHS2Document = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  const idpsAnsweredRegistrationQuestion = useMemo(() => computed.idpsIndividuals
      .filter(_ =>
        (_.isIdpRegistered && _.isIdpRegistered !== 'unable_unwilling_to_answer')
        || (_.are_you_and_your_hh_members_registered_as_idps && _.are_you_and_your_hh_members_registered_as_idps !== 'unable_unwilling_to_answer')
      )
    , [computed.idpsIndividuals])
  return (
    <>
      <SlideContainer responsive alignItems="flex-start">
        <SlideContainer column sx={{flex: 1}}>
          <SlidePanel title={m.protHHSnapshot.maleWithoutIDPCert}>
            <SlideContainer>
              <Lazy deps={[idpsAnsweredRegistrationQuestion]} fn={() => ChartTools.percentage({
                data: idpsAnsweredRegistrationQuestion,
                value: _ => _.isIdpRegistered !== 'yes' && _.are_you_and_your_hh_members_registered_as_idps !== 'yes_all'
              })}>
                {_ => <PieChartIndicator sx={{flex: 1}} title={m.all} percent={_.percent} value={_.value}/>}
              </Lazy>
              <Lazy deps={[idpsAnsweredRegistrationQuestion]} fn={() => ChartTools.percentage({
                data: idpsAnsweredRegistrationQuestion.filter(_ => _.age && _.age >= 18 && _.age <= 60 && _.gender && _.gender === 'male'),
                value: _ => _.isIdpRegistered !== 'yes' && _.are_you_and_your_hh_members_registered_as_idps !== 'yes_all'
              })}>
                {_ => <PieChartIndicator sx={{flex: 1}} title={m.protHHSnapshot.male1860} percent={_.percent} value={_.value}/>}
              </Lazy>
            </SlideContainer>
          </SlidePanel>
          <Lazy deps={[computed.flatData]} fn={() => ChartTools.byCategory({
            data: computed.flatData,
            categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
            filter: _ => !_.lackDoc?.includes('none'),
            filterBase: _ => _.lackDoc !== undefined,
            filterZeroCategory: true,
          })}>
            {_ =>
              <SlidePanel title={m.protHHS2.missingDocumentationByOblastPopulation}>
                <UkraineMap data={_} fillBaseOn="percent" sx={{mx: 2}}/>
              </SlidePanel>
            }
          </Lazy>
          <SlidePanel>
            <KoboPieChartIndicator
              compare={{before: computed.lastMonth}}
              title={m.protHHS2.accessBarriersToObtainDocumentation}
              question="have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation"
              filter={_ => !_.includes('no')}
              filterBase={_ => !_?.includes('unable_unwilling_to_answer')}
              data={data}
              sx={{mb: 2}}
            />
            <ProtHHS2BarChart
              questionType="multiple"
              data={data}
              question="have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation"
              filterValue={[
                'no',
                'unable_unwilling_to_answer',
              ]}
            />
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column sx={{flex: 1}}>
          <SlidePanel>
            <Lazy deps={[data, computed.lastMonth, computed.currentMonth]} fn={(x) => ChartTools.percentage({
              data: x.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
              value: _ => !_.includes('none')
            })}>
              {(_, last, curr) => <PieChartIndicator sx={{mb: 2}} title={m.lackOfPersonalDoc} evolution={(curr?.percent ?? 1) - (last?.percent ?? 1)} percent={_.percent}/>}
            </Lazy>
            <Lazy deps={[data]} fn={() => chain(ChartTools.multiple({
              data: data.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
              filterValue: ['none', 'unable_unwilling_to_answer'],
            }))
              .map(ChartTools.setLabel(ProtHHS_2_1Options.does_1_lack_doc))
              .map(ChartTools.sortBy.value)
              .get}>
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel>
            <KoboPieChartIndicator
              compare={{before: computed.lastMonth}}
              title={m.lackOfHousingDoc}
              filterBase={_ => !_.includes('unable_unwilling_to_answer')}
              filter={_ => !_.includes('none')}
              data={data}
              question={'what_housing_land_and_property_documents_do_you_lack'}
              sx={{mb: 2}}
            />
            <ProtHHS2BarChart
              data={data}
              question="what_housing_land_and_property_documents_do_you_lack"
              questionType="multiple"
              filterValue={['unable_unwilling_to_answer', 'none']}
              overrideLabel={{
                construction_stage_substituted_with_bti_certificate_following_completion_of_construction: 'Construction stage',
                document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed: 'Document issued by local self-government proving a damaged house',
                cost_estimation_certificate_state_commission_issued_when_personal_request_is_made: 'Cost estimation certificate - state commission',
                document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: 'Document issued by authority proving a damaged house',
              }}
            />
          </SlidePanel>

        </SlideContainer>
      </SlideContainer>
    </>
  )
}