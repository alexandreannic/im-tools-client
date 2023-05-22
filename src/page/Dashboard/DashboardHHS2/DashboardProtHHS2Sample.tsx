import {SlideCard, SlideContainer} from '../../../shared/PdfLayout/Slide'
import {DashboardPanel} from '../DashboardPanel'
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

export const DashboardProtHHS2Sample = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()
  console.log(computed.byGender)

  return (
    <>
      <SlideCard icon="home">
        {formatLargeNumber(data.length)}
      </SlideCard>
      <SlideContainer>
        <SlideContainer flexDirection="column">
          <DashboardPanel title={m.protHHS2.poc}>
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
          </DashboardPanel>
        </SlideContainer>
        <SlideContainer flexDirection="column">
          <AaPieChart
            outerRadius={60}
            height={120}
            width={260}
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
          <DashboardPanel title={m.protHHS2.HHsLocation}>
            <Lazy
              deps={[data]}
              fn={() => ChartTools.byCategory({
                categories: computed.categoryOblasts('where_are_you_current_living_oblast'),
                data: data,
                filter: _ => true,
              })}
            >
              {_ => <UkraineMap data={_}/>}
            </Lazy>
          </DashboardPanel>
        </SlideContainer>
      </SlideContainer>
    </>
  )
}