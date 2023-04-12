import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {toPercent} from '../../utils/utils'
import {map} from '@alexandreannic/ts-utils'

export const ProtSnapshotSafety = ({
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

  console.log(computed._12_5_1_During_your_displacement_journ.shelling_or_missile_attacks_an)
  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.safety}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer column sx={{flex: 4}}>
            <SlideTxt dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.desc.safety({
                safetyDuringDisplacement: toPercent(computed._12_5_1_During_your_displacement_journPercent.value / computed.idpsCount, 0),
                sosKharkiv: map(computed._18_1_1_Please_rate_your_sense_of_safe_map['UA-63'], _ => toPercent(_.value / _.base, 0))!,
                sosChernihiv: map(computed._18_1_1_Please_rate_your_sense_of_safe_map['UA-74'], _ => toPercent(_.value / _.base, 0))!,
              })
            }}/>
            <SlidePanel>
              {/*<UkraineMap*/}
              {/*  fillBaseOn="percent"*/}
              {/*  sx={{mt: 2, mx: 2}}*/}
              {/*  data={computed._27_1_If_yes_what_is_level_of_the_damageByOblast}*/}
              {/*  // title={m.protHHSnapshot.senseOfSafetyByOblast}*/}
              {/*/>*/}
              {/*<Divider sx={{my: 2}}/>*/}
              <PieChartIndicator
                title={m.propertyDamaged}
                value={computed._27_Has_your_house_apartment_been_.percent}
                // evolution={computed._27_Has_your_house_apartment_been_.percent - previous.computed._27_Has_your_house_apartment_been_.percent}
              />
              <Divider sx={{my: 1.5}}/>
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
            <SlidePanel title={m.protHHSnapshot.senseOfSafety}>
              <UkraineMap
                fillBaseOn="percent"
                sx={{mt: 2, mx: 1}}
                data={computed._18_1_1_Please_rate_your_sense_of_safe_map}
                title={m.protHHSnapshot.senseOfSafetyByOblast}
              />
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle>{m.protHHSnapshot.factorsInfluencingSenseOfSafety}</SlidePanelTitle>
              {/*<SlidePanel title={m.protHHSnapshot.factorInfluencingSenseOfSafety}>*/}
              <HorizontalBarChartGoogle hideValue data={computed._18_1_2_What_are_the_factors_t} base={data.length}/>
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <SlidePanel title={m.protHHSnapshot.safetyConcernsDuringDisplacement}>
              <UkraineMap
                sx={{mt: 2, mx: 1}}
                fillBaseOn="percent"
                data={computed._12_5_1_shellingDuringDisplacementMap}
                title={m.protHHSnapshot.threatsOrConcernsDuringDisplacementByOblast}
              />
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle>{m.protHHSnapshot.threatsOrConcernsDuringDisplacement}</SlidePanelTitle>
              <HorizontalBarChartGoogle hideValue data={computed._12_5_1_During_your_displacement_journ} base={computed.idpsCount}/>
            </SlidePanel>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}

