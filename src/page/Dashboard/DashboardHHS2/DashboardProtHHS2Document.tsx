import {SlideContainer, SlidePanel, SlideWidget} from '../../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, DashboardProtHHS2BarChart} from './DashboardProtHHS2'
import {Box, useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {ScLineChart} from '../../../shared/Chart/ScLineChart'
import {Txt} from 'mui-extension'
import {map} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'
import {PieChartIndicator} from '../../../shared/PieChartIndicator'
import {UkraineMap} from '../../../shared/UkraineMap/UkraineMap'

export const DashboardProtHHS2Document = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer alignItems="flex-start">
        <SlideContainer column sx={{flex: 1}}>
          <SlideContainer>
            <Lazy deps={[data]} fn={() => ChartTools.percentage({
              data: data.map(_ => _.what_is_your_citizenship),
              value: _ => _ === 'ukrainian'
            })}>
              {_ => <PieChartIndicator title={m.uaCitizenShip} value={_.percent}/>}
            </Lazy>
            <Lazy deps={[data]} fn={() => ChartTools.percentage({
              data: data.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
              value: _ => !_.includes('none')
            })}>
              {_ => <PieChartIndicator title={m.lackOfPersonalDoc} value={_.percent}/>}
            </Lazy>
          </SlideContainer>
          <Lazy deps={[data]} fn={() => ChartTools.byCategory({
            data: computed.flatData,
            categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
            filter: _ => !_.lackDoc?.includes('none')
          })}>
            {_ =>
              <SlidePanel>
                <UkraineMap data={_} fillBaseOn="percent"/>
              </SlidePanel>
            }
          </Lazy>
        </SlideContainer>

        <SlideContainer column sx={{flex: 1}}>
          <Lazy deps={[data]} fn={() => chain(ChartTools.multiple({
            data: data.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
            filterValue: ['none'],
          }))
            .map(ChartTools.setLabel(ProtHHS_2_1Options.does_1_lack_doc))
            .map(ChartTools.sortBy.value)
            .get}>
            {_ =>
              <SlidePanel title={m.lackOfPersonalDoc}>
                <HorizontalBarChartGoogle data={_}/>
              </SlidePanel>
            }
          </Lazy>
          <DashboardProtHHS2BarChart
            data={data}
            question="what_housing_land_and_property_documents_do_you_lack"
            questionType="multiple"
            // overrideLabel={{
            //   document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: '',
          />

        </SlideContainer>
      </SlideContainer>
    </>
  )
}