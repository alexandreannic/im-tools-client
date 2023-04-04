import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Box, Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {AaPieChart} from '../../shared/Chart/AaPieChart'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {ChartIndicator} from '../../shared/ChartIndicator'

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
          <SlideContainer column sx={{flex: 3}}>
            <HorizontalBarChartGoogle data={computed.B_Interviewer_to_in_ert_their_DRC_office}/>
            <HorizontalBarChartGoogle data={computed._26_4_Do_you_have_fo_in_your_accomodation}/>
            <UkraineMap
              sx={{mx: 1}}
              data={computed._19_1_1_Please_rate_your_relationshipByOblast}
              title={m.protHHSnapshot.senseOfSafetyByOblast}
            />
            <SlidePanel>
              <HorizontalBarChartGoogle data={computed._19_1_1_Please_rate_your_relationship_}/>
            </SlidePanel>
            <SlidePanel>
              <ChartIndicator
                title={m.propertyDamaged}
                value={computed._27_Has_your_house_apartment_been_.percent}
                evolution={previous.computed._27_Has_your_house_apartment_been_.percent}
                percent
              />
            </SlidePanel>
            <SlidePanel title={m.levelOfPropertyDamaged}>
              <HorizontalBarChartGoogle data={computed._27_1_If_yes_what_is_level_of_the_damage} base={data.length}/>
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column sx={{flex: 2}}>
          </SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <UkraineMap
              sx={{mx: 1}}
              data={computed._18_1_1_Please_rate_your_sense_of_safe_map}
              title={m.protHHSnapshot.senseOfSafetyByOblast}
            />
            <SlidePanel title={m.protHHSnapshot.factorInfluencingSenseOfSafety}>
              <HorizontalBarChartGoogle data={computed._18_1_2_What_are_the_factors_t}/>
            </SlidePanel>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}

