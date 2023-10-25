import {Period} from '@/core/type'
import {format, subDays} from 'date-fns'
import {NullableKey} from '@/utils/utilsType'
import React, {useMemo} from 'react'
import {Box, Icon} from '@mui/material'
import {Txt} from 'mui-extension'

const periodToString = (period: NullableKey<Period, 'end'>) => {
  return {
    start: format(period.start, 'LLLL yyyy'),
    end: period.end && period.start.getMonth() !== period.end.getMonth() ? format(period.end, 'LLLL yyyy') : undefined
  }
}

export const SnapshotPeriod = ({
  period,
}: {
  period: NullableKey<Period, 'end'>
}) => {
  const asString = useMemo(() => periodToString(period), [period])
  return (
    <Txt color="hint" sx={{fontSize: '1.1em', display: 'flex', alignItems: 'center'}}>
      <Icon sx={{mr: 1}}>date_range</Icon> {asString.start}
      {asString.end && (
        <>&nbsp;-&nbsp;{asString.end}</>
      )}
      <Icon sx={{mx: 1.5, fontSize: 10}}>fiber_manual_record</Icon>
      <Box component="a" target="_blank" href="https://infoportal-ua.drc.ngo/dashboard/protection-monitoring" sx={{color: '#4c8cca', display: 'flex', alignItems: 'center'}}>
        <Icon sx={{mr: .5}} fontSize="small">open_in_new</Icon>
        Interactive dashboard
      </Box>
    </Txt>
  )
}