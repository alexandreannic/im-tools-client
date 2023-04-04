import {Box, BoxProps, Icon} from '@mui/material'
import React from 'react'
import {Txt} from 'mui-extension'
import {SlidePanelTitle} from './PdfLayout/Slide'

const renderPercent = (value: number, isPercent?: boolean, fractionDigits = 1) => {
  return isPercent ? (value * 100).toFixed(fractionDigits) + '%' : value
}

export const ChartIndicator = ({
  percent,
  title,
  value,
  evolution,
  ...props
}: {
  title?: string
  percent?: boolean
  value: number
  evolution?: number
} & Omit<BoxProps, 'children'>) => {
  return (
    <Box {...props}>
      <SlidePanelTitle>{title}</SlidePanelTitle>
      {/*{title && <Txt block size="big" bold sx={{mb: .5}}>{title}</Txt>}*/}
      <Txt sx={{fontSize: '1.4em', display: 'inline-flex', alignItems: 'center'}}>
        <Txt bold>{renderPercent(value, percent)}</Txt>
        {evolution && (
          <Txt sx={{
            color: t => evolution > 0 ? t.palette.success.main : t.palette.error.main,
            display: 'inline-flex', alignItems: 'center'
          }}>
            <Icon sx={{ml: 2}} fontSize="inherit">{evolution > 0 ? 'north' : 'south'}</Icon>
            <Box sx={{ml: .25}}>
              {(evolution * 100).toFixed(1)}
            </Box>
          </Txt>
        )}
      </Txt>
    </Box>
  )
}
