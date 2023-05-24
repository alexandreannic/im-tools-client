import {Slide, SlideBody, SlideWidget, SlideContainer, SlidePanelDepreacted, SlideTxt} from '../../shared/PdfLayout/Slide'
import {format, sub} from 'date-fns'
import {Box, Icon, useTheme} from '@mui/material'
import {AaPieChart} from '../../shared/Chart/AaPieChart'
import {Legend} from 'recharts'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {ProtSnapshotSlideProps} from './ProtSnapshot'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {Txt} from 'mui-extension'
import logoEu from '../../core/img/eu.png'
import logo from '../../core/img/drc-logo.png'

export const ProtSnapshotSample = ({
  current: {
    data,
    computed
  },
  filters,
  customFilters,
  previous,
  onFilter
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber} = useI18n()
  const {pdfTheme} = usePdfContext()
  const theme = useTheme()
  return (
    <Slide>
      <Box sx={{
        px: 2,
        py: 1,
        borderBottom: t => `1px solid ${t.palette.divider}`,
        mb: 0,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <Txt bold sx={{fontSize: '1.65em', fontWeight: '700'}} color="primary">
            {m.protHHSnapshot.title}&nbsp;
            <Box sx={{display: 'inline', fontWeight: 'lighter'}}>- {m.protHHSnapshot.title2}</Box>
          </Txt>
          <Txt color="hint" sx={{fontSize: '1.1em', display: 'flex', alignItems: 'center'}}>
            <Icon sx={{mr: 1}}>date_range</Icon> {format(customFilters.start, 'LLLL yyyy')} - {format(sub(customFilters.end, {days: 1}), 'LLLL yyyy')}
          </Txt>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
          <Box component="img" src={logoEu} sx={{mr: 1.5, height: 38}}/>
          <Box component="img" src={logo} sx={{height: 26}}/>
        </Box>
      </Box>
      <SlideBody>
        <SlideContainer>
          <SlideContainer column sx={{flex: 4.7}}>
            <SlideTxt>
              <p dangerouslySetInnerHTML={{__html: m.protHHSnapshot.desc.disclaimer}}/>
              <p dangerouslySetInnerHTML={{__html: m.protHHSnapshot.desc.sample}}/>
            </SlideTxt>
            <Box id="map" sx={{height: 316, borderRadius: pdfTheme.slideRadius}}/>
            <Box sx={{color: 'white'}}>Fix google map print issue</Box>
          </SlideContainer>

          <SlideContainer column sx={{flex: 6}}>
            <Box sx={{display: 'flex'}}>
              <SlideWidget title={m.hhs} icon="home">
                {formatLargeNumber(data.length)}
              </SlideWidget>
              <SlideWidget title={m.individuals} icon="person">
                {formatLargeNumber(computed.totalMembers)}
              </SlideWidget>
              <SlideWidget title={m.hhSize} icon="group">
                {(computed.totalMembers / data.length).toFixed(1)}
              </SlideWidget>
            </Box>

            <SlideContainer>
              <SlideContainer column>
                <SlidePanelDepreacted>
                  <AaPieChart
                    outerRadius={60}
                    height={120}
                    width={260}
                    m={{
                      male: m.male,
                      female: m.female,
                      undefined: m.other,
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
                </SlidePanelDepreacted>
                <SlidePanelDepreacted title={m.status}>
                  <HorizontalBarChartGoogle data={computed._12_Do_you_identify_as_any_of}/>
                </SlidePanelDepreacted>
              </SlideContainer>
              <SlideContainer>
                <SlidePanelDepreacted sx={{flex: 1, height: '100%'}} title={m.ageGroup}>
                  <HorizontalBarChartGoogle
                    data={computed._8_individuals.byAgeGroup}
                  />
                </SlidePanelDepreacted>
              </SlideContainer>
            </SlideContainer>
            <SlideContainer>
              <SlideContainer column>
                <SlidePanelDepreacted>
                  <PieChartIndicator
                    noWrap
                    title={m.protHHSnapshot.numberOfIdp}
                    value={computed.categoriesTotal.idp.value / computed.currentStatusAnswered}
                  />
                </SlidePanelDepreacted>
                <SlidePanelDepreacted>
                  <PieChartIndicator
                    noWrap
                    title={m.protHHSnapshot.numberOfMemberWithDisability}
                    value={computed.categoriesTotal.memberWithDisability.value / data.length}
                  />
                </SlidePanelDepreacted>
              </SlideContainer>
              <SlideContainer column>
                <SlidePanelDepreacted>
                  <PieChartIndicator
                    noWrap
                    title={m.protHHSnapshot.numberOfHohhFemale}
                    value={computed.categoriesTotal.hohhFemale.value / data.length}
                  />
                </SlidePanelDepreacted>
                <SlidePanelDepreacted>
                  <PieChartIndicator
                    noWrap
                    title={m.protHHSnapshot.numberOfHohh60}
                    value={computed.categoriesTotal.hohh60.value / data.length}
                  />
                </SlidePanelDepreacted>
              </SlideContainer>
            </SlideContainer>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
