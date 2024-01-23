import {Div} from '@/shared/PdfLayout/PdfSlide'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {DashboardPageProps} from './ProtectionDashboardMonito'
import {useTheme} from '@mui/material'

export const ProtectionDashboardMonitoNeeds = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <Div>
        <Div column>

        </Div>
        <Div column>

        </Div>
      </Div>
    </>
  )
}