import {SlideContainer, SlidePanel, SlidePanelTitle} from '@/shared/PdfLayout/Slide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {KoboUkraineMap} from '../shared/KoboUkraineMap'
import {KoboPieChartIndicator} from '../shared/KoboPieChartIndicator'
import {KoboLineChart} from '@/features/Dashboard/shared/KoboLineChart'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {ChartTools} from '@/core/chartTools'

export const DashboardProtHHS2Safety = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  return (
    <SlideContainer responsive>
      <SlideContainer column>
        <SlidePanel>
          <KoboPieChartIndicator
            sx={{mb: 1}}
            title={m.protHHS2.poorSenseOfSafety}
            question="please_rate_your_sense_of_safety_in_this_location"
            filter={_ => _ === '_2_unsafe'}// || _ === '_2_unsafe'}
            filterBase={_ => _ !== 'unable_unwilling_to_answer'}
            compare={{before: computed.lastMonth}}
            data={data}
          />
          <KoboUkraineMap
            sx={{mx: 2}}
            data={data}
            getOblast={_ => _.where_are_you_current_living_oblast as any}
            value={_ => _.please_rate_your_sense_of_safety_in_this_location === '_1_very_unsafe'
              || _.please_rate_your_sense_of_safety_in_this_location === '_2_unsafe'}
            base={_ => _.please_rate_your_sense_of_safety_in_this_location !== 'unable_unwilling_to_answer' &&
              _.please_rate_your_sense_of_safety_in_this_location !== undefined}
          />
          <SlidePanelTitle>{m.details}</SlidePanelTitle>
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
      </SlideContainer>
      <SlideContainer column>
        <SlidePanel>
          <KoboPieChartIndicator
            sx={{mb: 1}}
            title={m.protHHS2.poorRelationshipWithHostCommunity}
            question="how_would_you_describe_the_relationship_between_member_of_the_host_community"
            filter={_ => _ === '_2_bad' || _ === '_1_very_bad'}
            filterBase={_ => _ !== 'unable_unwilling_to_answer'}
            compare={{before: computed.lastMonth}}
            data={data}
          />
          <KoboUkraineMap
            sx={{mx: 2}}
            data={data}
            getOblast={_ => _.where_are_you_current_living_oblast as any}
            value={_ => _.how_would_you_describe_the_relationship_between_member_of_the_host_community === '_2_bad'
              || _.how_would_you_describe_the_relationship_between_member_of_the_host_community === '_1_very_bad'}
            base={_ => _.how_would_you_describe_the_relationship_between_member_of_the_host_community !== 'unable_unwilling_to_answer' &&
              _.how_would_you_describe_the_relationship_between_member_of_the_host_community !== undefined}
          />
          <SlidePanelTitle>{m.details}</SlidePanelTitle>
          <ProtHHS2BarChart
            questionType="single"
            data={data}
            sortBy={ChartTools.sortBy.custom([
              '_1_very_bad',
              '_2_bad',
              '_3_acceptable',
              '_4_good',
              '_5_very_good',
            ])}
            question="how_would_you_describe_the_relationship_between_member_of_the_host_community"
            filterValue={['unable_unwilling_to_answer']}
          />
          <SlidePanelTitle sx={{mt: 4}}>{m.influencingFactors}</SlidePanelTitle>
          <ProtHHS2BarChart
            questionType="multiple"
            data={data}
            question="what_factors_are_affecting_the_relationship_between_communities_in_this_location"
            filterValue={['unable_unwilling_to_answer']}
          />
        </SlidePanel>
      </SlideContainer>
    </SlideContainer>
  )
}