import {SlideContainer, SlidePanel} from '../../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'

export const DashboardProtHHS2Needs = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer>
        <SlideContainer flexDirection="column">
          <SlidePanel title={m.protHHS2.poc}>
            <Lazy
              deps={[data]}
              fn={() => chain(ChartTools.multiple({
                data: data.map(_ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household).compact(),
              }))
                .map(ChartTools.sortBy.value)
                .map(ChartTools.setLabel(ProtHHS_2_1Options.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household))
                .get}
            >
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer flexDirection="column">

        </SlideContainer>
      </SlideContainer>
    </>
  )
}