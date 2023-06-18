import {Box, Icon, Tooltip, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from 'mui-extension'
import {AaPieChart} from './Chart/AaPieChart'
import {SlidePanelTitle} from './PdfLayout/Slide'
import {PanelProps} from './Panel/Panel'
import {useI18n} from '@/core/i18n'

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
  tooltip?: string
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
  tooltip,
  fractionDigits = 0,
  sx,
  ...props
}: PieChartIndicatorProps) => {
  const {m} = useI18n()
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
        <Box sx={{display: 'inline-flex', lineHeight: 1, alignItems: 'flex-start'}}>
          <Txt bold sx={{fontSize: '1.7em'}}>{renderPercent(percent, true, fractionDigits)}</Txt>
          {value !== undefined && (
            <Txt color="disabled" sx={{ml: .5, fontWeight: '400'}}>
              <span style={{fontSize: '1.6em', letterSpacing: '2px'}}>
                &nbsp;{value}
              </span>
              {base !== undefined && (
                <span style={{fontSize: '1.2em'}}>/{base}</span>
              )}
              {/*<Txt color="disabled" sx={{fontSize: '1.4em', fontWeight: 'lighter'}}>)</Txt>*/}
            </Txt>
          )}
          {evolution && (
            <>
              <Txt sx={{
                fontSize: '1.7em',
                color: t => evolution > 0 ? t.palette.success.main : t.palette.error.main,
                display: 'inline-flex', alignItems: 'center'
              }}>
                <Icon sx={{ml: 1.5}} fontSize="inherit">{evolution > 0 ? 'north' : 'south'}</Icon>
                <Box sx={{ml: .25}}>
                  {evolution >= 0 && '+'}{(evolution * 100).toFixed(Math.abs(evolution) > 0.1 ? fractionDigits : 1)}
                </Box>
                {children}
              </Txt>
              <Tooltip title={tooltip ?? m.comparedToPreviousMonth}>
                <Icon sx={{fontSize: '15px !important'}} color="disabled">info</Icon>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
