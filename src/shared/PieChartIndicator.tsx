import {Box, Icon, Tooltip, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from 'mui-extension'
import {AaPieChart} from './Chart/AaPieChart'
import {SlidePanelTitle} from './PdfLayout/PdfSlide'
import {PanelProps} from './Panel/Panel'
import {useI18n} from '@/core/i18n'
import {LightTooltip, TooltipRow} from '@/shared/LightTooltip'
import {toPercent} from '@/utils/utils'
import {formatLargeNumber} from '@/core/i18n/localization/en'

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
      hideTooltip={true}
      outerRadius={size / 2}
      innerRadius={(size / 2) - 9}
      height={size}
      width={size}
      hideLabel
      data={{
        value: Math.round(percent * 100) / 100,
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
  value: number
  base: number
  showValue?: boolean
  showBase?: boolean
  evolution?: number
  tooltip?: string
}

export const PieChartIndicator = ({
  titleIcon,
  title,
  evolution,
  noWrap,
  children,
  dense,
  value,
  showValue,
  showBase,
  base,
  tooltip,
  fractionDigits = 0,
  sx,
  ...props
}: PieChartIndicatorProps) => {
  const {m, formatLargeNumber} = useI18n()
  return (
    <LightTooltip title={
      <>
        <Txt size="big" block bold>
          {title}
        </Txt>
        <Box sx={{mt: .5}}>
          <TooltipRow hint={<>{formatLargeNumber(value)} / {formatLargeNumber(base)}</>} value={toPercent(value / base)}/>
        </Box>
      </>
    }>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}>
        <Donut percent={value / base} size={dense ? 44 : 55}/>
        <Box sx={{ml: dense ? 1 : 1.5}}>
          <SlidePanelTitle icon={titleIcon} noWrap={noWrap}>
            {title}
          </SlidePanelTitle>
          <Box sx={{display: 'inline-flex', lineHeight: 1, alignItems: 'flex-start'}}>
            <Txt bold sx={{fontSize: dense ? '1.6em' : '1.7em'}}>{renderPercent(value / base, true, fractionDigits)}</Txt>
            {showValue !== undefined && (
              <Txt color="disabled" sx={{ml: .5, fontWeight: '400'}}>
              <span style={{fontSize: '1.6em', letterSpacing: '2px'}}>
                &nbsp;{formatLargeNumber(value)}
              </span>
                {showBase !== undefined && (
                  <span style={{fontSize: '1.2em'}}>/{formatLargeNumber(base)}</span>
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
    </LightTooltip>
  )
}
