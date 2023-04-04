import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'

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

  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.needs}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <SlidePanel title={m.protHHSnapshot.first_priorty}>
              <HorizontalBarChartGoogle
                data={computed._40_1_What_is_your_first_priorty}
              />
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            {/*<SlidePanel title={m.protectionHHSnapshot._40_1_pn_shelter_byCategory}>*/}
            {/*  <HorizontalBarChartGoogle*/}
            {/*    data={computed._40_1_pn_shelter_byCategory}*/}
            {/*  />*/}
            {/*</SlidePanel>*/}
            <SlidePanel title={m.protHHSnapshot._40_1_pn_health_byCategory}>
              <HorizontalBarChartGoogle
                icons={categoryIcons}
                data={computed._40_1_pn_health_byCategory}
              />
            </SlidePanel>
            <SlidePanel title={m.protHHSnapshot._40_1_pn_cash_byCategory}>
              <HorizontalBarChartGoogle
                icons={categoryIcons}
                data={computed._40_1_pn_cash_byCategory}
              />
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            <UkraineMap
              base={data.length}
              onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}
              data={computed._29_nfiNeededByOblast}
              title={m.protHHSnapshot.nfiNeededByOblast}
              sx={{width: '100%'}}
            />
            <SlidePanel title={m.protHHSnapshot._29_nfiNeededByCategory}>
              <HorizontalBarChartGoogle
                icons={categoryIcons}
                data={computed._29_nfiNeededByCategory}
              />
            </SlidePanel>
            {/*<UkraineMap*/}
            {/*  base={data.length}*/}
            {/*  onSelect={onFilterOblast('_4_What_oblast_are_you_from')}*/}
            {/*  data={computed._40_1_firstPriorityByOblast}*/}
            {/*  legend={m.protHHSnapshot.nfiNeededByOblast}*/}
            {/*  sx={{width: '100%'}}*/}
            {/*/>*/}
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}
