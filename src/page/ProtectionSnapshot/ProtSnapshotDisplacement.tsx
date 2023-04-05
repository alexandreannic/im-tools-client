import {Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {Box, Divider, Icon, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {ScLineChart} from '../../shared/Chart/ScLineChart'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Oblast} from '../../shared/UkraineMap/oblastIndex'
import {format} from 'date-fns'
import {Txt} from 'mui-extension'
import {ChartIndicator} from '../../shared/ChartIndicator'
import {sortObject} from '../../utils/utils'
import {PieChartIndicator} from '../../shared/PieChartIndicator'

export const ProtSnapshotDisplacement = ({
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
  const {pdfTheme} = usePdfContext()
  const theme = useTheme()

  const {_12_3_1_dateDeparture, maxPeopleByOblast} = useMemo(() => {
    const oblastPopulations = Arr([...Enum.values(computed.oblastCurrent), ...Enum.values(computed.oblastOrigins)])
      .map(_ => _.value)
      .compact()
    return {
      _12_3_1_dateDeparture: Arr(Object.values(computed._12_3_1_dateDeparture).map(_ => _.label!).sort((a, b) => a?.localeCompare(b))),
      maxPeopleByOblast: Math.max(data.sum(_ => _.persons.length))
    }
  }, [computed])

  return (
    <Slide>
      <SlideHeader>{m.displacement}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer sx={{flex: 2}} column>
            <SlidePanel title={m.departureFromAreaOfOrigin}>
              <ScLineChart hideYTicks hideXTicks height={140} hideLabelToggle curves={[
                {label: m.departureFromAreaOfOrigin, key: 'dateOfDeparture', curve: computed._12_3_1_dateDeparture},
              ]}/>
              <Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>
                {map(_12_3_1_dateDeparture.head, _ => <Box>{format(new Date(_), 'LLL yyyy')}</Box>)}
                {map(_12_3_1_dateDeparture.last, _ => <Box>{format(new Date(_), 'LLL yyyy')}</Box>)}
              </Txt>
            </SlidePanel>
            <SlidePanelTitle>{m.protHHSnapshot.percentagePopulationByOblast}</SlidePanelTitle>
            <Box sx={{px: 1}}>
              <UkraineMap
                fillBaseOn="percent"
                base={maxPeopleByOblast}
                data={computed.oblastOrigins}
                onSelect={onFilterOblast('_12_1_What_oblast_are_you_from_001_iso')}
                title={m.origin}
                legend={false}
                sx={{width: '100%'}}
              />
              <Box sx={{textAlign: 'center', my: .25}}>
                {mapFor(3, i => (
                  <Icon key={i} color="disabled" fontSize="large">arrow_downward</Icon>
                ))}
              </Box>
              <UkraineMap
                fillBaseOn="percent"
                base={maxPeopleByOblast}
                data={computed.oblastCurrent}
                onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}
                title={m.current}
                sx={{width: '100%'}}
              />
            </Box>
          </SlideContainer>

          <SlideContainer column sx={{flex: 5}}>
            <div>
              <SlideTxt>{m.protHHSnapshot.displacement.desc}</SlideTxt>
            </div>
            <SlideContainer>
              <SlideContainer column>
                <SlidePanel title={m.intentionToReturn}>
                  <PieChartIndicator
                    value={computed._12_7_1_planToReturn.percent}
                    evolution={computed._12_7_1_planToReturn.percent - previous.computed._12_7_1_planToReturn.percent}
                  />
                  <Divider sx={{my: 2}}/>
                  <SlidePanelTitle>{m.decidingFactorsToReturn}</SlidePanelTitle>
                  <HorizontalBarChartGoogle data={computed._12_8_1_What_would_be_the_deciding_fac} base={data.length}/>
                </SlidePanel>
              </SlideContainer>
              <SlideContainer column>
                <SlidePanel title={<Txt noWrap>{m.protHHSnapshot.experiencedShellingDuringDisplacement}</Txt>}>
                  <PieChartIndicator
                    value={computed._12_5_1_During_your_displacement_journPercent.percent}
                    evolution={computed._12_5_1_During_your_displacement_journPercent.percent - previous.computed._12_5_1_During_your_displacement_journPercent.percent}
                  />
                </SlidePanel>
                <SlidePanel title={m.propertyDamaged}>
                  <PieChartIndicator
                    value={computed._27_Has_your_house_apartment_been_.percent}
                    evolution={computed._27_Has_your_house_apartment_been_.percent - previous.computed._27_Has_your_house_apartment_been_.percent}
                  />
                  <Divider sx={{my: 2}}/>
                  <SlidePanelTitle>{m.levelOfPropertyDamaged}</SlidePanelTitle>
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
