import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {Box, useTheme} from '@mui/material'
import {PdfSlide, SlideTxt} from '../../shared/PdfLayout/PdfSlide'
import {Txt} from 'mui-extension'
import {format, sub} from 'date-fns'
import {DRCLogo, EULogo} from '../../shared/logo/logo'

export const ProtSnapshotHome = ({
  current: {
    data,
    computed
  },
  customFilters,
  previous,
  filters,
  onFilter,
  onFilterOblast
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const theme = useTheme()

  return (
    <PdfSlide>
      <Box sx={{height: '100%', weight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Box sx={{maxWidth: '50%'}}>
          <Box sx={{fontSize: '3em'}}>{m.protHHSnapshot.title}</Box>
          <Txt block color="hint" sx={{fontSize: '1.6em', mb: 2}}>{m.protHHSnapshot.subTitle}</Txt>
          <SlideTxt size="big" color="hint" sx={{display: 'block', mb: 2}}>
            {format(customFilters.start, 'LLLL yyyy')} - {format(sub(customFilters.end, {days: 1}), 'LLLL yyyy')}
          </SlideTxt>
          <SlideTxt sx={{display: 'block'}}>{m.protHHSnapshot.desc.disclaimer}</SlideTxt>

          <Box sx={{
            mt: 5,
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'flex-end'
          }}>
            <DRCLogo height={24}/>
            <EULogo height={30} sx={{ml: 2}}/>
          </Box>
        </Box>
      </Box>
    </PdfSlide>
  )
}

