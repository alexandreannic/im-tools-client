import {SlideContainer, SlidePanel, SlideWidget} from '../../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {AaPieChart} from '../../../shared/Chart/AaPieChart'
import {Legend} from 'recharts'
import {UkraineMap} from '../../../shared/UkraineMap/UkraineMap'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {AAStackedBarChart} from '../../../shared/Chart/AaStackedBarChart'

export const DashboardProtHHS2Sample = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer alignItems="flex-start">
        <SlideContainer column>
          <SlideContainer>
            <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
              {formatLargeNumber(data.length)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
              {formatLargeNumber(computed.individuals)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
              {(computed.individuals / data.length).toFixed(1)}
            </SlideWidget>
          </SlideContainer>
          <SlidePanel>
            <AaPieChart
              outerRadius={80}
              height={155}
              width={300}
              m={{
                male: ProtHHS_2_1Options['hh_sex_1'].male,
                female: ProtHHS_2_1Options['hh_sex_1'].female,
                other: ProtHHS_2_1Options['hh_sex_1'].other,
                unable_unwilling_to_answer: ProtHHS_2_1Options['hh_sex_1'].unable_unwilling_to_answer,
              }}
              data={computed.byGender}
              colors={{
                female: theme.palette.primary.main,
                male: theme.palette.info.main,
                other: theme.palette.divider,
                unable_unwilling_to_answer: theme.palette.divider,
              }}
            >
              <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right"/>
            </AaPieChart>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.HHsLocation}>
            <AAStackedBarChart data={computed.ageGroup} height={240} colors={t => [
              t.palette.primary.main,
              t.palette.info.main,
              t.palette.divider,
            ]}/>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.protHHS2.poc}>
            <Lazy
              deps={[data]}
              fn={() => chain(ChartTools.single({
                data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
              }))
                .map(ChartTools.sortBy.value)
                .map(ChartTools.setLabel(ProtHHS_2_1Options.do_you_identify_as_any_of_the_following))
                .get}
            >
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.HHsLocation}>
            <Lazy deps={[data]} fn={() => ChartTools.byCategory({
              categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
              data: data,
              filter: _ => true,
            })}>
              {_ => <UkraineMap data={_} sx={{mx: 3}}/>}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
    </>
  )
}