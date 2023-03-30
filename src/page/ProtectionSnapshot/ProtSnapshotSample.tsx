import {Slide, SlideBody, SlideCard, SlideContainer, SlideH1, SlideHeader, SlidePanel, SlideTxt} from '../../shared/PdfLayout/Slide'
import {format} from 'date-fns'
import {Box, useTheme} from '@mui/material'
import {AaPieChart} from '../../shared/Chart/AaPieChart'
import {Legend} from 'recharts'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {ProtSnapshotSlideProps} from './ProtSnapshot'

export const ProtSnapshotSample = ({
  current: {
    data,
    period,
    computed
  },
  filters,
  previous,
  onFilter
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber} = useI18n()
  const {pdfTheme} = usePdfContext()
  const theme = useTheme()
  return (
    <Slide>
      <SlideHeader>{m.sample}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer flexDirection="column" sx={{flex: 4}}>
            <SlideTxt size="big" color="hint">
              {format(period.start, 'LLLL yyyy')} - {format(period.end, 'LLLL yyyy')}
            </SlideTxt>

            <SlideTxt>{m.protHHSnapshot.sample.desc}</SlideTxt>

            <Box id="map" sx={{height: 400, borderRadius: pdfTheme.slideRadius}}/>
          </SlideContainer>

          <SlideContainer flexDirection="column" sx={{flex: 5}}>
            <Box sx={{display: 'flex'}}>
              <SlideCard title={m.hhs} icon="home">
                {formatLargeNumber(data.length)}
              </SlideCard>
              <SlideCard title={m.individuals} icon="person">
                {formatLargeNumber(computed.totalMembers)}
              </SlideCard>
              <SlideCard title={m.hhSize} icon="group">
                {(computed.totalMembers / data.length).toFixed(1)}
              </SlideCard>
            </Box>

            <SlideContainer sx={{alignItems: 'flex-start'}}>
              <SlideContainer flexDirection="column">
                <SlidePanel>
                  <AaPieChart
                    outerRadius={60}
                    height={120}
                    width={260}
                    m={{
                      male: m.male,
                      female: m.female,
                      undefined: m.undefined,
                    }}
                    data={computed._8_individuals.byGender}
                    colors={{
                      female: theme.palette.primary.main,
                      male: theme.palette.info.main,
                      undefined: theme.palette.divider,
                    }}
                  >
                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right"/>
                  </AaPieChart>
                </SlidePanel>
                <SlidePanel title={m.status}>
                  <HorizontalBarChartGoogle hideValue data={computed._12_Do_you_identify_as_any_of}/>
                </SlidePanel>
              </SlideContainer>
              <SlidePanel sx={{flex: 1}} title={m.ageGroup}>
                <HorizontalBarChartGoogle
                  hideValue
                  data={computed._8_individuals.byAgeGroup}
                />
              </SlidePanel>
            </SlideContainer>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
