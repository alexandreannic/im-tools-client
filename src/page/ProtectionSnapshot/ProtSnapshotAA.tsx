import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Box, Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {AaPieChart} from '../../shared/Chart/AaPieChart'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'

export const ProtSnapshotAA = ({
  current: {
    data,
    period,
    computed
  },
  previous,
  filters,
  onFilter,
  onFilterOblast
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const theme = useTheme()
  
  useEffect(() => {
    console.log(computed._18_1_1_Please_rate_your_sense_of_safe_map)
  }, [])
  
  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.document}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer flexDirection="column" sx={{flex: 3}}>
            <HorizontalBarChartGoogle data={computed._19_1_1_Please_rate_your_relationship_}/>
            <br/>
            <HorizontalBarChartGoogle data={computed._18_1_1_Please_rate_your_sense_of_safe}/>
          </SlideContainer>
          <SlideContainer flexDirection="column" sx={{flex: 2}}>
            <UkraineMap data={computed._18_1_1_Please_rate_your_sense_of_safe_map}/>
            <HorizontalBarChartGoogle data={computed._18_1_2_What_are_the_factors_t}/>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}

