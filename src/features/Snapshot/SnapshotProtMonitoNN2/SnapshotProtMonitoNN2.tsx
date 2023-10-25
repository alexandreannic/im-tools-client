import {Pdf} from '@/shared/PdfLayout/PdfLayout'
import React from 'react'
import {SnapshotProtMonitoringProvider, useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {useI18n} from '@/core/i18n'
import {SnapshotProtMonitoNN2Safety} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Safety'
import {PieChartIndicatorProps} from '@/shared/PieChartIndicator'
import {SnapshotProtMonitoNN2Needs} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Needs'
import {SnapshotProtMonitoNN2Livelihood} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Livelihood'
import {SnapshotProtMonitoNN2Sample} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Sample'
import {SnapshotProtMonitoNN2Displacement} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Displacement'
import {Theme} from '@mui/material'
import {Period} from '@/core/type'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'

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
export const SnapshotProtMonitoNN2 = ({period}: {
  period: Period
}) => {
  return (
    <SnapshotProtMonitoringProvider
      filters={{currentOblast: [OblastIndex.oblastIsoByName['Mykolaivska']]}}
      initialPeriodFilter={period}
    >
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
      <SnapshotProtMonitoNN2Sample/>
      <SnapshotProtMonitoNN2Displacement/>
      <SnapshotProtMonitoNN2Safety/>
      <SnapshotProtMonitoNN2Needs/>
      <SnapshotProtMonitoNN2Livelihood/>
    </Pdf>
  )
}