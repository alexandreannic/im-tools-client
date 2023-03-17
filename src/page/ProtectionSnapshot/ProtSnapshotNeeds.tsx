import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'

export const ProtSnapshotNeeds = ({
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
          <SlideContainer flexDirection="column">
            <SlidePanel>
              <HorizontalBarChartGoogle
                data={computed._40_2_What_is_your_second_priority}
              />
            </SlidePanel>
          </SlideContainer>
          <SlideContainer flexDirection="column">
            {/*<SlidePanel title={m.protectionHHSnapshot._40_1_pn_shelter_byCategory}>*/}
            {/*  <HorizontalBarChartGoogle*/}
            {/*    data={computed._40_1_pn_shelter_byCategory}*/}
            {/*  />*/}
            {/*</SlidePanel>*/}
            <SlidePanel title={m.protectionHHSnapshot._40_1_pn_health_byCategory}>
              <HorizontalBarChartGoogle
                data={computed._40_1_pn_health_byCategory}
              />
            </SlidePanel>
            <SlidePanel title={m.protectionHHSnapshot._40_1_pn_cash_byCategory}>
              <HorizontalBarChartGoogle
                data={computed._40_1_pn_cash_byCategory}
              />
            </SlidePanel>
            <SlidePanel title={m.protectionHHSnapshot._29_nfiNeededByCategory}>
              <HorizontalBarChartGoogle
                data={computed._29_nfiNeededByCategory}
              />
            </SlidePanel>
          </SlideContainer>
          <SlideContainer flexDirection="column"></SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
