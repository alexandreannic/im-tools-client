import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
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

  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.document}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <SlidePanel title={m.propertyDamaged}>
              <PieChartIndicator
                value={computed._27_Has_your_house_apartment_been_.percent}
                evolution={computed._27_Has_your_house_apartment_been_.percent - previous.computed._27_Has_your_house_apartment_been_.percent}
              />
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle>{m.levelOfPropertyDamaged}</SlidePanelTitle>
              <HorizontalBarChartGoogle data={computed._27_1_If_yes_what_is_level_of_the_damage} base={data.length}/>
            </SlidePanel>
            {/*<UkraineMap*/}
            {/*  sx={{mx: 1}}*/}
            {/*  data={computed._19_1_1_Please_rate_your_relationshipByOblast}*/}
            {/*  title={m.protHHSnapshot.senseOfSafetyByOblast}*/}
            {/*/>*/}
            {/*<SlidePanel>*/}
            {/*  <HorizontalBarChartGoogle data={computed._19_1_1_Please_rate_your_relationship_}/>*/}
            {/*</SlidePanel>*/}
            {/*<SlidePanel title={m.levelOfPropertyDamaged}>*/}
            {/*  <HorizontalBarChartGoogle data={computed._19_1_2_What_factors_are_influencing_t} base={data.length}/>*/}
            {/*</SlidePanel>*/}
          </SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <UkraineMap
              sx={{mx: 4}}
              data={computed._18_1_1_Please_rate_your_sense_of_safe_map}
              title={m.protHHSnapshot.senseOfSafetyByOblast}
            />
            {/*<SlidePanel title={m.protHHSnapshot.factorInfluencingSenseOfSafety}>*/}
            <SlidePanel>
              <HorizontalBarChartGoogle hideValue data={computed._18_1_2_What_are_the_factors_t}/>
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <UkraineMap
              sx={{mx: 4}}
              fillBaseOn="percent"
              data={computed._13_4_1_Are_you_separated_fromByOblast}
              title={m.protHHSnapshot.senseOfSafetyByOblast}
            />
            <SlidePanel>
              <PieChartIndicator
                value={computed._13_4_1_Are_you_separated_from_any_of_percent.percent}
                evolution={computed._13_4_1_Are_you_separated_from_any_of_percent.percent - previous.computed._13_4_1_Are_you_separated_from_any_of_percent.percent}
              />
              <Divider sx={{my: 2}}/>
              <HorizontalBarChartGoogle hideValue data={computed._13_4_3_If_separated_from_a_household_}/>
            </SlidePanel>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}

