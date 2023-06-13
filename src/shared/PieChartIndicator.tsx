import {Box, Icon, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from 'mui-extension'
import {AaPieChart} from './Chart/AaPieChart'
import {SlidePanelTitle} from './PdfLayout/Slide'
import {PanelProps} from './Panel/Panel'

const renderPercent = (value: number, isPercent?: boolean, fractionDigits = 1) => {
  return isPercent ? (value * 100).toFixed(fractionDigits) + '%' : value
}

export const Donut = ({
  percent = 0,
  size = 55,
}: {
  percent?: number
  size?: number
}) => {
  const theme = useTheme()
  return (
    <AaPieChart
      outerRadius={size / 2}
      innerRadius={(size / 2) - 10}
      height={size}
      width={size}
      hideLabel
      data={{
        value: percent,
        rest: 1 - percent,
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
  )
}

export interface PieChartIndicatorProps extends Omit<PanelProps, 'title'> {
  fractionDigits?: number
  dense?: boolean
  noWrap?: boolean
  titleIcon?: string
  title?: ReactNode
  value?: number
  base?: number
  percent: number
  evolution?: number
}

export const PieChartIndicator = ({
  titleIcon,
  title,
  percent,
  evolution,
  noWrap,
  children,
  dense,
  value,
  base,
  fractionDigits = 0,
  sx,
  ...props
}: PieChartIndicatorProps) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      ...sx,
    }}>
      <Donut percent={percent} size={dense ? 50 : 55}/>
      <Box sx={{ml: dense ? .75 : 1.5}}>
        <SlidePanelTitle noWrap={noWrap}>
          {title && (
            <>
              {title}
              {titleIcon && <Icon sx={{ml: .5}}>{titleIcon}</Icon>}
            </>
          )}
        </SlidePanelTitle>
        <Txt sx={{fontSize: '1.7em', display: 'inline-flex', lineHeight: 1, alignItems: 'center'}}>
          <Txt bold>{renderPercent(percent, true, fractionDigits)}</Txt>
          {value && (
            <Txt color="disabled" sx={{fontWeight: 'lighter'}}>
              &nbsp;({value}
              {base && (
                <>&nbsp;/&nbsp;{base}</>
              )})
            </Txt>
          )}
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
