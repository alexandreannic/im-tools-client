import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from 'mui-extension'
import {AaPieChart} from './Chart/AaPieChart'
import {SlidePanelTitle} from './PdfLayout/Slide'

const renderPercent = (value: number, isPercent?: boolean, fractionDigits = 1) => {
  return isPercent ? (value * 100).toFixed(fractionDigits) + '%' : value
}

export const PieChartIndicator = ({
  titleIcon,
  title,
  value,
  evolution,
  noWrap,
  children,
  dense,
  fractionDigits = 0,
  ...props
}: {
  fractionDigits?: number
  dense?: boolean
  noWrap?: boolean
  titleIcon?: string
  title?: ReactNode
  value: number
  evolution?: number
} & Omit<BoxProps, 'title'>) => {
  const theme = useTheme()
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...props.sx
      }}
    >
      <AaPieChart
        outerRadius={24}
        innerRadius={14}
        height={55}
        width={55}
        hideLabel
        data={{
          value: value,
          rest: 1 - value,
        }}
        colors={{
          value: theme.palette.primary.main,
          rest: theme.palette.divider,
        }}
        m={{
          value: 'ukrainian',
          rest: 'other',
        }}
      />
      <Box sx={{ml: dense ? .5 : 1.5}}>
        <SlidePanelTitle noWrap={noWrap}>
          {title && (
            <>
              {title}
              {titleIcon && <Icon sx={{ml: .5}}>{titleIcon}</Icon>}
            </>
          )}
        </SlidePanelTitle>
        <Txt sx={{fontSize: '1.4em', display: 'inline-flex', lineHeight: 1, alignItems: 'center'}}>
          <Txt bold>{renderPercent(value, true, fractionDigits)}</Txt>
          {evolution && (
            <Txt sx={{
              color: t => evolution > 0 ? t.palette.success.main : t.palette.error.main,
              display: 'inline-flex', alignItems: 'center'
            }}>
              <Icon sx={{ml: 2}} fontSize="inherit">{evolution > 0 ? 'north' : 'south'}</Icon>
              <Box sx={{ml: .25}}>
                {renderPercent(evolution, true, evolution > 10 ? fractionDigits : 1)}
              </Box>
              {children}
            </Txt>
          )}
        </Txt>
      </Box>
    </Box>
  )
}
