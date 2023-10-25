import {Period} from '@/core/type'
import {format, subDays} from 'date-fns'
import {NullableKey} from '@/utils/utilsType'
import React, {ReactNode, useMemo} from 'react'
import {Box, Icon} from '@mui/material'
import {Txt} from 'mui-extension'
import {SnapshotPeriod} from '@/features/Snapshot/SnapshotPeriod'
import {DRCLogo, EULogo} from '@/shared/logo/logo'
import {useI18n} from '@/core/i18n'

const periodToString = (period: NullableKey<Period, 'end'>) => {
  return {
    start: format(period.start, 'LLLL yyyy'),
    end: period.end && period.start.getMonth() !== period.end.getMonth() ? format(period.end, 'LLLL yyyy') : undefined
  }
}

export const SnapshotHeader = ({
  period,
  logo
}: {
  period: NullableKey<Period, 'end'>
  logo: ReactNode
}) => {
  const {m} = useI18n()
  return (
    <Box sx={{
      px: 2,
      py: 1,
      borderBottom: t => `1px solid ${t.palette.divider}`,
      mb: 0,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box>
        <Txt bold sx={{fontSize: '1.65em', fontWeight: '700'}} color="primary">
          {m.protHHSnapshot.title}&nbsp;
          <Box sx={{display: 'inline', fontWeight: 'lighter'}}>- {m.protHHSnapshot.title2}</Box>
        </Txt>
        <SnapshotPeriod period={period}/>
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
        {logo}
      </Box>
    </Box>
  )
}