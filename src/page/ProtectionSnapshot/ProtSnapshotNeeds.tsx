import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {Box, Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {Txt} from 'mui-extension'
import {Enum, map} from '@alexandreannic/ts-utils'
import {toPercent} from '../../utils/utils'
import {omitBy} from 'lodash'
import {PieChartIndicator} from '../../shared/PieChartIndicator'

export const categoryIcons = {
  idp: 'directions_run',
  hohh60: 'elderly',
  hohhFemale: 'woman',
  memberWithDisability: 'assist_walker',
  all: 'vertical_align_center',
}

export const ProtSnapshotNeeds = ({
  current: {
    data,
    period,
    computed
  },
  previous,
  filters,
  onFilter,
  onFilterOblast,
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const {pdfTheme} = usePdfContext()
  const theme = useTheme()

  // const max = useMemo(() => {
  //   return Math.max(...Enum.values({
  //     ...computed._28_Do_you_have_acce_current_accomodationByOblast,
  //     ...computed._28_Do_you_have_acce_current_accomodationByOblast2,
  //   }).map(_ => _.value))
  // }, [computed])
  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.needs}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer column sx={{flex: 8}}>
            <SlidePanel title={m.protHHSnapshot.lackOfInformationNeeded}>
              <Box sx={{display: 'flex', mt: 1.5, alignItems: 'center', justifyContent: 'space-between'}}>
                {Enum.values(computed._39_What_type_of_information_wouldbyCat!).map(v =>
                  <PieChartIndicator dense value={v.value / (v.base ?? 1)} sx={{flex: 1}} fractionDigits={1} title={v.label}/>
                )}
              </Box>
            </SlidePanel>
            <SlideContainer>
              <SlideContainer column sx={{flex: 3.5}}>
                <SlideTxt dangerouslySetInnerHTML={{
                  __html: m.protHHSnapshot.desc.needs({
                    percentLvivWithoutHot: map(computed._28_accessToHotByOblast['UA-77'], _ => toPercent(_.value / _.base, 0))!,
                    percentZapoWithoutHot: map(computed._28_accessToHotByOblast['UA-12'], _ => toPercent(_.value / _.base, 0))!,
                    percentChernihivWithoutHot: map(computed._28_accessToHotByOblastForIDPs['UA-74'], _ => toPercent(_.value / _.base, 0))!,
                  })
                }}/>
              </SlideContainer>
              <SlideContainer column sx={{flex: 3}}>
                <SlidePanel title={m.protHHSnapshot.first_priorty}>
                  <HorizontalBarChartGoogle data={computed._40_1_What_is_your_first_priorty}/>
                </SlidePanel>
              </SlideContainer>
            </SlideContainer>
          </SlideContainer>
          <SlideContainer column sx={{flex: 3, minWidth: 318}}>
            <SlidePanel title={m.protHHSnapshot.first_priorty}>
              <>
                <SlidePanelTitle icon={categoryIcons.hohh60} sx={{mt: 2}} uppercase={false} dangerouslySetInnerHTML={{__html: m.protHHSnapshot.firstPrioritiesHohh60}}/>
                <HorizontalBarChartGoogle
                  showLastBorder
                  data={computed._40_1_first_priortyBy.hohh60}
                />
              </>
              <>
                <SlidePanelTitle icon={categoryIcons.memberWithDisability} sx={{mt: 3}} uppercase={false}
                                 dangerouslySetInnerHTML={{__html: m.protHHSnapshot.firstPrioritiesMemberWithDisability}}/>
                <HorizontalBarChartGoogle
                  showLastBorder
                  data={computed._40_1_first_priortyBy.memberWithDisability}
                />
              </>
              <>
                <SlidePanelTitle icon={categoryIcons.idp} sx={{mt: 3}} uppercase={false} dangerouslySetInnerHTML={{__html: m.protHHSnapshot.firstPrioritiesIdp}}/>
                <HorizontalBarChartGoogle
                  showLastBorder
                  data={computed._40_1_first_priortyBy.idp}
                />
              </>
              <>
                <SlidePanelTitle icon={categoryIcons.hohhFemale} sx={{mt: 3}} uppercase={false} dangerouslySetInnerHTML={{__html: m.protHHSnapshot.firstPrioritiesHohhFemale}}/>
                <HorizontalBarChartGoogle
                  data={computed._40_1_first_priortyBy.hohhFemale}
                />
              </>
            </SlidePanel>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
