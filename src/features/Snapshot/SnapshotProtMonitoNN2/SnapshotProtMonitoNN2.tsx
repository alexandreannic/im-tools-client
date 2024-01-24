import {Pdf} from '@/shared/PdfLayout/PdfLayout'
import React, {useMemo, useState} from 'react'
import {SnapshotProtMonitoringProvider, useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {useI18n} from '@/core/i18n'
import {SnapshotProtMonitoNN2Safety} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Safety'
import {ChartPieIndicatorProps} from '@/shared/charts/ChartPieWidget'
import {SnapshotProtMonitoNN2Needs} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Needs'
import {SnapshotProtMonitoNN2Livelihood} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Livelihood'
import {SnapshotProtMonitoNN2Sample} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Sample'
import {SnapshotProtMonitoNN2Displacement} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2Displacement'
import {Box, Theme} from '@mui/material'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {endOfMonth, startOfMonth} from 'date-fns'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {Period} from '@/core/type/period'

export const snapshotAlternateColor = (t: Theme) => t.palette.grey[500]

export const snapshotColors = (t: Theme) => [
  t.palette.primary.main,
  snapshotAlternateColor(t),
]

export const snapShotDefaultPieProps: Partial<Pick<ChartPieIndicatorProps, 'dense' | 'evolution' | 'showValue' | 'sx' | 'showBase'>> & {
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
export const SnapshotProtMonitoNN2 = () => {
  const [period, setPeriod] = useState<Partial<Period>>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  })
  const value: [Date | undefined, Date | undefined] = useMemo(() => [period.start, period.end], [period])
  return (
    <>
      <Box sx={{'@media print': {display: 'none'}}}>
        <PeriodPicker value={value} onChange={_ => setPeriod({start: _[0], end: _[1]})}/>
      </Box>
      <SnapshotProtMonitoringProvider
        filters={{currentOblast: [OblastIndex.byName('Mykolaivska').iso]}}
        period={period}
      >
        <_SnapshotProtMonitoring/>
      </SnapshotProtMonitoringProvider>
    </>
  )
}

const _SnapshotProtMonitoring = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
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