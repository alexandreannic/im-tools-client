import {Pdf} from '@/shared/PdfLayout/PdfLayout'
import React from 'react'
import {SnapshotProtMonitoringProvider, useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {useI18n} from '@/core/i18n'
import {SnapshotProtMonitoEchoSafety} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoSafety'
import {PieChartIndicatorProps} from '@/shared/PieChartIndicator'
import {SnapshotProtMonitoEchoNeeds} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoNeeds'
import {SnapshotProtMonitoEchoLivelihood} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoLivelihood'
import {SnapshotProtMonitoEchoSample} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoSample'
import {SnapshotProtMonitoEchoDisplacement} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoDisplacement'
import {SnapshotProtMonitoEchoRegistration} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoRegistration'
import {Theme} from '@mui/material'

export const snapshotAlternateColor = (t: Theme) => t.palette.grey[500]

export const snapshotColors = (t: Theme) => [
  t.palette.primary.main,
  snapshotAlternateColor(t),
]

export const snapShotDefaultPieProps: Partial<Pick<PieChartIndicatorProps, 'dense' | 'evolution' | 'showValue' | 'sx' | 'showBase'>> & {
  hideEvolution?: boolean
} = {
  dense: true,
  hideEvolution: true,
  evolution: undefined,
  showBase: true,
  showValue: true,
  sx: {
    mb: 1,
  }
}
export const SnapshotProtMonitoEcho = () => {
  return (
    <SnapshotProtMonitoringProvider>
      <_SnapshotProtMonitoring/>
    </SnapshotProtMonitoringProvider>
  )
}

const _SnapshotProtMonitoring = () => {
  const {data, computed, periodFilter} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  if (!data || !computed) return <>...</>
  return (
    <Pdf>
      <SnapshotProtMonitoEchoSample/>
      <SnapshotProtMonitoEchoDisplacement/>
      <SnapshotProtMonitoEchoRegistration/>
      <SnapshotProtMonitoEchoSafety/>
      <SnapshotProtMonitoEchoNeeds/>
      <SnapshotProtMonitoEchoLivelihood/>
    </Pdf>
  )
}