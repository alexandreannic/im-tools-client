import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {Box, useTheme} from '@mui/material'
import {Slide, SlideTxt} from '../../shared/PdfLayout/Slide'
import {Txt} from 'mui-extension'
import {format} from 'date-fns'
import logoDrc from '../../core/img/drc-logo.png'
import logoEu from '../../core/img/eu.png'

export const ProtSnapshotHome = ({
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
  const theme = useTheme()

  return (
    <Slide>
      <Box sx={{height: '100%', weight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Box sx={{maxWidth: '50%'}}>
          <Box sx={{fontSize: '3em'}}>{m.protHHSnapshot.title}</Box>
          <Txt block color="hint" sx={{fontSize: '1.6em', mb: 2}}>{m.protHHSnapshot.subTitle}</Txt>
          <SlideTxt size="big" color="hint" sx={{display: 'block', mb: 2}}>
            {format(period.start, 'LLLL yyyy')} - {format(period.end, 'LLLL yyyy')}
          </SlideTxt>
          <SlideTxt sx={{display: 'block'}}>{m.protHHSnapshot.disclaimer}</SlideTxt>

          <Box sx={{
            mt: 5,
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'flex-end'
          }}>
            <Box component="img" src={logoDrc} sx={{height: 24}}/>
            <Box component="img" src={logoEu} sx={{height: 30, ml: 2}}/>
          </Box>
        </Box>
      </Box>
    </Slide>
  )
}

