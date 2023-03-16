import {map, mapFor} from '@alexandreannic/ts-utils'
import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {Box, Icon, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlideTxt} from '../../shared/PdfLayout/Slide'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {ScLineChart} from '../../shared/Chart/ScLineChart'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Oblast} from '../../shared/UkraineMap/oblastIndex'
import {format} from 'date-fns'
import {Txt} from 'mui-extension'
import {ChartIndicator} from '../../shared/ChartIndicator'

export const ProtSnapshotDisplacement = ({
  current: {
    data,
    period,
    computed
  },
  previous,
  filters,
  onFilter
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const {pdfTheme} = usePdfContext()
  const theme = useTheme()


  return (
    <Slide>
      <SlideHeader>{m.displacement}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer sx={{flex: 2}} flexDirection="column"></SlideContainer>

          <SlideContainer flexDirection="column" sx={{flex: 5}}></SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
