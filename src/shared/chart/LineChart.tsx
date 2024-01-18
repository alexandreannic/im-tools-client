import {CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts'
import * as React from 'react'
import {useState} from 'react'
import {Box, BoxProps, Checkbox, Theme, useTheme} from '@mui/material'
import {map} from '@alexandreannic/ts-utils'
import {styleUtils} from '@/core/theme'
import {chartConfig} from '@/shared/chart/chartConfig'
import {formatLargeNumber} from '@/core/i18n/localization/en'
import {commonLegendProps} from '@/shared/chart/StackedBarChart'

export interface ScLineChartPropsBase extends Pick<BoxProps, 'sx'> {
  colorsByKey?: (t: Theme) => Record<string, string>
  colors?: (t: Theme) => string[]
  /**
   * This props may be needed because sometimes label are not showing because of animation.
   * https://github.com/recharts/recharts/issues/1135
   */
  disableAnimation?: boolean
  hideLabelToggle?: boolean
  translation?: Record<string, string>
  height?: number
  hideYTicks?: boolean
  hideXTicks?: boolean
  hideLegend?: boolean
  percent?: boolean
  loading?: boolean
}

export interface ScLineChartProps extends ScLineChartPropsBase {
  data?: ScLineChart2Data[]
}

export type ScLineChart2Data = Record<string, number> & {
  name: string
}

// const colors = chartConfig.defaultColors

export const IpLineChart = ({
  data,
  loading,
  sx,
  colorsByKey,
  colors = chartConfig.defaultColors,
  translation,
  hideYTicks,
  hideXTicks,
  hideLegend,
  disableAnimation,
  hideLabelToggle,
  percent,
  height = 220
}: ScLineChartProps) => {
  const theme = useTheme()
  const lines = Object.keys(data?.[0] ?? {}).filter(_ => _ !== 'name')
  const [showCurves, setShowCurves] = useState<boolean[]>(new Array(lines.length).fill(false))

  return (
    <>
      {!hideLabelToggle && (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          {lines.map((c, i) => (
            <>
              <Checkbox
                key={c}
                checked={showCurves[i]}
                onChange={e => setShowCurves(prev => prev.map((_, index) => (i === index ? e.currentTarget.checked : _)))}
                sx={{'& svg': {fill: colors(theme)[i] ?? colors(theme)[0] + ' !important'}}}
              />
            </>
          ))}
        </Box>
      )}
      <Box sx={{height, ml: -2 - (hideYTicks ? 4 : 0), mb: hideXTicks ? -4 : 0, ...sx}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart height={height - 60} data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeWidth={1}/>
            {!hideLegend && (
              <Legend {...commonLegendProps}/>
            )}
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip wrapperStyle={{zIndex: 100, borderRadius: 4}} formatter={_ => percent ? `${_}%'` : formatLargeNumber(_ as any, {maximumFractionDigits: 2})}/>
            {lines.map((line, i) => (
              <Line
                isAnimationActive={!disableAnimation}
                key={line}
                name={map(translation, _ => _[line]) ?? line}
                type="monotone"
                dataKey={line}
                dot={false}
                stroke={colorsByKey?.(theme)[line] ?? colors(theme)[i] ?? colors(theme)[0]}
                strokeWidth={2}
              >
                {showCurves[i] && (
                  <LabelList
                    dataKey={lines[i]}
                    position="top"
                    style={{
                      fill: colorsByKey?.(theme)[line] ?? colors(theme)[i] ?? colors(theme)[0],
                      fontSize: styleUtils(theme).fontSize.small,
                    }}
                  />
                )}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
}
