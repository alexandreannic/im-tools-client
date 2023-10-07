import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {Box, Divider, useTheme} from '@mui/material'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanelDepreacted, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/PdfSlide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Enum, map} from '@alexandreannic/ts-utils'
import {toPercent} from '../../utils/utils'
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
    <PdfSlide>
      <SlideHeader>{m.protHHSnapshot.titles.needs}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column sx={{flex: 3}}>
            <SlideTxt dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.desc.needs({
                percentLvivWithoutHot: map(computed._28_accessToHotByOblast['UA77'], _ => toPercent(_.value / _.base, 0))!,
                percentZapoWithoutHot: map(computed._28_accessToHotByOblast['UA12'], _ => toPercent(_.value / _.base, 0))!,
                percentChernihivWithoutHot: map(computed._28_accessToHotByOblastForIDPs['UA74'], _ => toPercent(_.value / _.base, 0))!,
              })
            }}/>
            <SlidePanelDepreacted title={m.protHHSnapshot.lackOfInformationNeeded}>
              <HorizontalBarChartGoogle
                icons={categoryIcons as any}
                data={computed._39_What_type_of_information_wouldbyCat}
              />
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle>{m.protHHSnapshot.mostNeededInformation}</SlidePanelTitle>
              <Box sx={{display: 'flex', mt: 1}}>
                {Enum.entries(computed._39_What_type_of_information_would!).splice(0, 3).map(([k, v]) =>
                  <PieChartIndicator key={k} fractionDigits={0} dense title={v.label} percent={v.value / data.length} sx={{flex: 1}}/>
                )}
              </Box>
            </SlidePanelDepreacted>
          </Div>
          <Div column sx={{flex: 3, minWidth: 318}}>
            <SlidePanelDepreacted title={m.firstPriorityNeed}>
              <Box sx={{display: 'flex', mt: 1}}>
                {Enum.entries(computed._40_1_What_is_your_first_priorty!).splice(0, 3).map(([k, v]) =>
                  <PieChartIndicator key={k} fractionDigits={0} dense title={v.label} percent={v.value / data.length} sx={{flex: 1}}/>
                )}
              </Box>
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle dangerouslySetInnerHTML={{__html: m.protHHSnapshot._40_1_pn_health_byCategory}}/>
              <HorizontalBarChartGoogle icons={categoryIcons as any} data={computed._40_1_pn_health_byCategory}/>
              {/*<Divider sx={{my: 2}}/>*/}
              {/*<SlidePanelTitle dangerouslySetInnerHTML={{__html: m.protHHSnapshot._40_1_pn_cash_byCategory}}/>*/}
              {/*<HorizontalBarChartGoogle icons={categoryIcons as any} data={computed._40_1_pn_cash_byCategory}/>*/}
            </SlidePanelDepreacted>
            <SlidePanelDepreacted>
              <SlidePanelTitle>{m.protHHSnapshot._29_nfiNeededByCategory}</SlidePanelTitle>
              <HorizontalBarChartGoogle data={computed._29_nfiNeededByCategory} icons={categoryIcons as any}/>
            </SlidePanelDepreacted>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}
