import React from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlidePanel, SlidePanelTitle, SlideTxt, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
import {format, subDays} from 'date-fns'
import {DRCLogo, EULogo} from '@/shared/logo/logo'
import {AAStackedBarChart} from '@/shared/Chart/AaStackedBarChart'
import {Person} from '@/core/type'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {PanelTitle} from '@/shared/Panel'
import {Legend} from 'recharts'
import {AaPieChart} from '@/shared/Chart/AaPieChart'
import {snapshotAlternateColor} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'

export const SnapshotProtMonitoNN2Sample = () => {
  const theme = useTheme()
  const {data, computed, periodFilter} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  return (
    <PdfSlide>
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
            <Box sx={{display: 'inline', fontWeight: 'lighter'}}>- Mykolaivska, Ukraine</Box>
          </Txt>
          <Txt color="hint" sx={{fontSize: '1.1em', display: 'flex', alignItems: 'center'}}>
            <Icon sx={{mr: 1}}>date_range</Icon> {format(periodFilter.start, 'LLLL yyyy')}
            {periodFilter.start.getMonth() !== periodFilter.end.getMonth() &&
              <>&nbsp;-&nbsp;{format(subDays(periodFilter.end, 1), 'LLLL yyyy')}</>
            }

            <Icon sx={{mx: 1.5, fontSize: 10}}>fiber_manual_record</Icon>
            <Box component="a" target="_blank" href="https://infoportal-ua.drc.ngo/dashboard/protection-monitoring" sx={{color: '#4c8cca', display: 'flex', alignItems: 'center'}}>
              <Icon sx={{mr: .5}} fontSize="small">open_in_new</Icon>
              Interactive dashboard
            </Box>
          </Txt>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
          <EULogo/>
          <DRCLogo/>
        </Box>
      </Box>
      <PdfSlideBody>
        <Div>
          <Div column sx={{flex: 3.6}}>
            <SlideTxt>
              <p dangerouslySetInnerHTML={{__html: m.snapshotProtMonito.nn2.desc}}/>
            </SlideTxt>
            <Box sx={{height: 316, borderRadius: t => t.shape.borderRadius}}>
              <PanelTitle sx={{mb: 3, mt: 1}}>{m.idpOriginOblast}</PanelTitle>
              <UkraineMap data={computed.byOriginOblast}/>
            </Box>
          </Div>

          <Div column sx={{flex: 6}}>
            <Div sx={{flex: 0}}>
              <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
                {formatLargeNumber(data.length)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                {formatLargeNumber(computed.individualsCount)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
                {(computed.individualsCount / data.length).toFixed(1)}
              </SlideWidget>
            </Div>

            <Div>
              <Div column>
                <SlidePanel>
                  <AaPieChart
                    outerRadius={60}
                    height={120}
                    width={260}
                    m={{
                      male: m.male,
                      female: m.female,
                      // other: m.other,
                    }}
                    data={{
                      female: computed.byGender.Female,
                      male: computed.byGender.Male,
                    }}
                    colors={{
                      female: theme.palette.primary.main,
                      male: snapshotAlternateColor(theme),
                      // other: theme.palette.divider,
                    }}
                  >
                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right"/>
                  </AaPieChart>
                </SlidePanel>
                <SlidePanel>
                  <SlidePanelTitle>{m.protHHS2.hhTypes}</SlidePanelTitle>
                  <ProtHHS2BarChart
                    data={data}
                    question="what_is_the_type_of_your_household"
                    questionType="single"
                  />
                </SlidePanel>
              </Div>
              <Div column>
                <SlidePanel>
                  <SlidePanelTitle>{m.ageGroup}</SlidePanelTitle>
                  <AAStackedBarChart data={computed.ageGroup(Person.ageGroup['DRC'], true)} height={250} colors={t => [
                    snapshotAlternateColor(t),
                    t.palette.primary.main,
                  ]}/>
                </SlidePanel>
                <SlidePanel>
                  <SlidePanelTitle>{m.displacementStatus}</SlidePanelTitle>
                  <ProtHHS2BarChart data={data} question="do_you_identify_as_any_of_the_following"/>
                </SlidePanel>
              </Div>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}