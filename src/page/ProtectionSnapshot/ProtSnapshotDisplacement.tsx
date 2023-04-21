import {Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {Box, Divider, Icon, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {ScLineChart} from '../../shared/Chart/ScLineChart'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {format} from 'date-fns'
import {Txt} from 'mui-extension'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {toPercent} from '../../utils/utils'

export const ProtSnapshotDisplacement = ({
  current: {
    data,
    computed
  },
  previous,
  filters,
  customFilters,
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
          <SlideContainer sx={{flex: 3}} column>
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
                base={computed.totalIdpsMember}
                data={computed.oblastOrigins}
                onSelect={onFilterOblast('_12_1_What_oblast_are_you_from_001_iso')}
                title={m.origin}
                // legend={true}
                sx={{mx: 2}}
              />
              <Box sx={{textAlign: 'center', my: .25}}>
                {mapFor(3, i => (
                  <Icon key={i} color="disabled" fontSize="large">arrow_downward</Icon>
                ))}
              </Box>
              <UkraineMap
                fillBaseOn="percent"
                base={computed.totalIdpsMember}
                data={computed.oblastCurrent}
                onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}
                title={m.current}
                sx={{mx: 2}}
              />
            </Box>
          </SlideContainer>

          <SlideContainer column sx={{flex: 7}}>
            <div>
              <SlideTxt dangerouslySetInnerHTML={{
                __html: m.protHHSnapshot.desc.displacement({
                  intentionToReturn: toPercent(computed._12_7_1_planToReturn.percent, 0),
                  dnipIdps: toPercent(computed.oblastCurrent['UA-12'].value / computed.totalIdpsMember, 0),
                  cherniIdps: toPercent(computed.oblastCurrent['UA-74'].value / computed.totalIdpsMember, 0),
                  lvivIdps: toPercent(computed.oblastCurrent['UA-46'].value / computed.totalIdpsMember, 0),
                  chernivIdps: toPercent(computed.oblastCurrent['UA-77'].value / computed.totalIdpsMember, 0),
                })
              }}/>
            </div>
            <SlideContainer>
              <SlideContainer column>
                <SlidePanel title={m.intentionToReturn}>
                  <PieChartIndicator
                    value={computed._12_7_1_planToReturn.percent}
                    evolution={computed._12_7_1_planToReturn.percent - previous.computed._12_7_1_planToReturn.percent}
                  >
                    <Txt color="hint" block sx={{fontSize: '1.15rem', mt: -.25, ml: .25}}><sup>(1)</sup></Txt>
                  </PieChartIndicator>
                  <Divider sx={{my: 2}}/>
                  <SlidePanelTitle>{m.decidingFactorsToReturn}</SlidePanelTitle>
                  <HorizontalBarChartGoogle data={computed._12_8_1_What_would_be_the_deciding_fac} base={data.length}/>
                </SlidePanel>
              </SlideContainer>
              <SlideContainer column>
                {/*<SlidePanel title={<Txt noWrap>{m.protHHSnapshot.experiencedShellingDuringDisplacement}</Txt>}>*/}
                {/*  <PieChartIndicator*/}
                {/*    value={computed._12_5_1_During_your_displacement_journPercent.percent}*/}
                {/*    evolution={computed._12_5_1_During_your_displacement_journPercent.percent - previous.computed._12_5_1_During_your_displacement_journPercent.percent}*/}
                {/*  />*/}
                {/*  <Divider sx={{my: 2}}/>*/}
                {/*  <SlidePanelTitle>{m.propertyDamaged}</SlidePanelTitle>*/}
                {/*  <PieChartIndicator*/}
                {/*    value={computed._27_Has_your_house_apartment_been_.percent}*/}
                {/*    evolution={computed._27_Has_your_house_apartment_been_.percent - previous.computed._27_Has_your_house_apartment_been_.percent}*/}
                {/*  />*/}
                {/*</SlidePanel>*/}

                <SlidePanel title={m.protHHSnapshot.hhSeparatedDueToConflict}>
                  {/*<UkraineMap*/}
                  {/*  sx={{mt: 2, mx: 4}}*/}
                  {/*  fillBaseOn="percent"*/}
                  {/*  data={computed._13_4_1_Are_you_separated_fromByOblast}*/}
                  {/*  title={m.protHHSnapshot.hhSeparatedByOblast}*/}
                  {/*/>*/}
                  {/*<Divider sx={{my: 2}}/>*/}
                  <PieChartIndicator
                    // title={m.protHHSnapshot.numberHhSeparatedDueToConflict}
                    value={computed._13_4_1_Are_you_separated_from_any_of_percent.percent}
                    evolution={computed._13_4_1_Are_you_separated_from_any_of_percent.percent - previous.computed._13_4_1_Are_you_separated_from_any_of_percent.percent}
                  />
                  <Divider sx={{my: 2}}/>
                  <SlidePanelTitle>{m.protHHSnapshot.locationOfSeparated}</SlidePanelTitle>
                  <HorizontalBarChartGoogle hideValue data={computed._13_4_3_If_separated_from_a_household_}/>
                </SlidePanel>

                <Divider/>
                <Txt sx={{mt: -1}} size="small" color="hint">
                  <Txt block dangerouslySetInnerHTML={{
                    __html: m.protHHSnapshot.desc.previousPeriodNote({start: customFilters.start, end: customFilters.end})
                  }}/>
                  {/*<Txt dangerouslySetInnerHTML={{*/}
                  {/*  __html: m.protHHSnapshot.desc.dataAccuracy*/}
                  {/*}}/>*/}
                </Txt>
              </SlideContainer>
            </SlideContainer>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
