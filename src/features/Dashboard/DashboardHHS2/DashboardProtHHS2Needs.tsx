import {SlideContainer} from '../../../shared/PdfLayout/Slide'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {useTheme} from '@mui/material'

export const DashboardProtHHS2Needs = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer>
        <SlideContainer column>

        </SlideContainer>
        <SlideContainer column>

        </SlideContainer>
      </SlideContainer>
    </>
  )
}