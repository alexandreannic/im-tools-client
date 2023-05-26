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
import {Donut, PieChartIndicator} from '../../../shared/PieChartIndicator'
import {Panel, PanelBody} from '../../../shared/Panel'

export const DashboardProtHHS2Sample = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <SlideContainer column>
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
        </SlideContainer>
        <SlideContainer column>
          <SlideContainer>
            <Panel sx={{flex: 1, m: 0}}>
              <PanelBody>
                <Lazy deps={[data]} fn={() => ChartTools.percentage({
                  data: computed.flatData,
                  value: _ => _.gender === 'female'
                })}>
                  {_ => (
                    <PieChartIndicator value={_.percent} title={m.women}/>
                  )}
                </Lazy>
              </PanelBody>
            </Panel>
            <SlideWidget sx={{flex: 1}} icon="elderly" title={m.avgAge}>
              <Lazy deps={[data]} fn={() => computed.flatData.map(_ => _.age).compact().sum() / computed.flatData.length}>
                {_ => _.toFixed(1)}
              </Lazy>
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="my_location" title={m.coveredOblasts}>
              <Lazy deps={[data]} fn={() => data.distinct(_ => _.where_are_you_current_living_oblast).length}>
                {_ => _}
              </Lazy>
            </SlideWidget>
          </SlideContainer>
        </SlideContainer>
      </SlideContainer>
      <SlideContainer alignItems="flex-start">
        <SlideContainer column>
          <SlidePanel title={m.ageGroup}>
            <AAStackedBarChart data={computed.ageGroup} height={250} colors={t => [
              t.palette.primary.main,
              t.palette.info.main,
              t.palette.divider,
            ]}/>
          </SlidePanel>
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
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.protHHS2.HHsLocation}>
            <UkraineMap data={computed.byCurrentOblast} sx={{mx: 3}}/>
          </SlidePanel>
        </SlideContainer>
      </SlideContainer>
    </SlideContainer>
  )
}