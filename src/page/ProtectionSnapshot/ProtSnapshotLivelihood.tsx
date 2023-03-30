import {Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect, useMemo} from 'react'
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
import {sortObject} from '../../utils/utils'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {categoryIcons} from './ProtSnapshotNeeds'

export const ProtSnapshotLivelihood = ({
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

  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.livelihood}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer sx={{flex: 3}} flexDirection="column">
            <SlidePanel>
              <PieChartIndicator
                title={m.atLeastOneMemberWorking}
                value={computed._31_Is_anyone_from_the_household_percent.percent}
                evolution={previous.computed._31_Is_anyone_from_the_household_percent.percent}
              />
            </SlidePanel>
            <SlidePanel title={m.employmentType}>
              <HorizontalBarChartGoogle data={computed._31_2_What_type_of_work}/>
            </SlidePanel>
            <SlidePanel title={m.mainSourceOfIncome}>
              <HorizontalBarChartGoogle data={computed._32_What_is_the_main_source_of_inc}/>
            </SlidePanel>
          </SlideContainer>

          <SlideContainer flexDirection="column" sx={{flex: 3}}>
            <SlidePanel title={m.monthlyIncomePerHH}>
              <HorizontalBarChartGoogle
                data={computed._33_What_is_the_aver_income_per_household}
                descs={Enum.entries(computed._8_What_is_your_household_sizeByIncome).reduce((acc, [k, v]) => ({
                  ...acc,
                  [k]: m.protHHSnapshot.avgHhSize((v.value ?? 0) / (v.base ?? 1))
                }), {} as Record<keyof typeof computed._8_What_is_your_household_sizeByIncome, string>)}
              />
            </SlidePanel>
            <SlidePanel title={m.protHHSnapshot.incomeUnder6000ByCategory}>
              <HorizontalBarChartGoogle data={computed._33_incomeByCategory} icons={categoryIcons}/>
            </SlidePanel>
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}

