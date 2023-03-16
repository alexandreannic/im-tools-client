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

  const updateOblastFilters = (key: keyof typeof filters) => (oblast: Oblast) => {
    onFilter(f => {
      const value = f[key]
      if (value?.includes(oblast.koboKey)) {
        return {
          ...f,
          [key]: value?.filter(_ => _ !== oblast.koboKey)
        }
      }
      if (!value) {
        return {...f, [key]: [oblast.koboKey]}
      }
      return {
        ...f, [key]: [...value, oblast.koboKey]
      }
    })
  }

  return (
    <Slide>
      <SlideHeader>{m.displacement}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer sx={{flex: 2}} flexDirection="column">
            <SlidePanel title={m.departureFromAreaOfOrigin}>
              <ScLineChart hideYTicks hideXTicks height={140} hideLabelToggle curves={[
                {label: m.departureFromAreaOfOrigin, key: 'dateOfDeparture', curve: computed._12_3_1_dateDeparture},
              ]}/>
              <Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>
                {map(computed._12_3_1_dateDeparture.head?.date, _ => <Box>{format(new Date(_), 'LLL yyyy')}</Box>)}
                {map(computed._12_3_1_dateDeparture.last?.date, _ => <Box>{format(new Date(_), 'LLL yyyy')}</Box>)}
              </Txt>
            </SlidePanel>
            <div>
              <UkraineMap
                total={data.length}
                values={computed.oblastOrigins}
                onSelect={updateOblastFilters('_12_1_What_oblast_are_you_from_001')}
                legend={m.origin}
                sx={{width: '100%'}}
              />
              <Box sx={{textAlign: 'center', my: 1}}>
                {mapFor(3, () => (
                  <Icon color="disabled" fontSize="large">arrow_downward</Icon>
                ))}
              </Box>
              <UkraineMap
                total={data.length}
                values={computed.oblastCurrent}
                onSelect={updateOblastFilters('_4_What_oblast_are_you_from')}
                legend={m.current}
                sx={{width: '100%'}}
              />
            </div>
          </SlideContainer>

          <SlideContainer flexDirection="column" sx={{flex: 5}}>
            <div>
              <SlideTxt>{m.protectionHHSnapshot.displacement.desc}</SlideTxt>
            </div>
            <SlideContainer>
              <SlideContainer flexDirection="column">
                <SlidePanel>
                  <ChartIndicator
                    title={m.intentionToReturn}
                    value={computed._12_7_1_planToReturn}
                    evolution={computed._12_7_1_planToReturn - previous.computed._12_7_1_planToReturn}
                    percent
                  />
                  {/*<ChartIndicator*/}
                  {/*  percent*/}
                  {/*  value={+computed._12_7_1_planToReturn.toFixed(1)}*/}
                  {/*  sx={{fontSize: '1.4rem'}}*/}
                  {/*/>*/}
                </SlidePanel>
                <SlidePanel title={m.decidingFactorsToReturn}>
                  <HorizontalBarChartGoogle data={computed._12_8_1_What_would_be_the_deciding_fac} base={data.length}/>
                </SlidePanel>
              </SlideContainer>
              <SlideContainer flexDirection="column">
                <SlidePanel>
                  <ChartIndicator
                    title={m.propertyDamaged}
                    value={computed._27_Has_your_house_apartment_been_}
                    evolution={computed._27_Has_your_house_apartment_been_ - previous.computed._27_Has_your_house_apartment_been_}
                    percent
                  />
                </SlidePanel>
                <SlidePanel>
                  <HorizontalBarChartGoogle data={computed._27_1_If_yes_what_is_level_of_the_damage} base={data.length}/>
                </SlidePanel>
              </SlideContainer>
            </SlideContainer>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
