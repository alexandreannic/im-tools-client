import {CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts'
import * as React from 'react'
import {useState} from 'react'
import {Box, BoxProps, Checkbox, useTheme} from '@mui/material'
import {map} from '@alexandreannic/ts-utils'
import {styleUtils} from '@/core/theme'
import {chartConfig} from '@/shared/Chart/chartConfig'

export interface ScLineChartPropsBase extends Pick<BoxProps, 'sx'> {
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
  percent?: boolean
}

interface Props extends ScLineChartPropsBase {
  data: ScLineChart2Data[]
}

export type ScLineChart2Data = Record<string, number> & {
  name: string
}

const colors = chartConfig.defaultColors

export const ScLineChart2 = ({
  data,
  sx,
  translation,
  hideYTicks,
  hideXTicks,
  disableAnimation,
  hideLabelToggle,
  percent,
  height = 220
}: Props) => {
  const theme = useTheme()
  const lines = Object.keys(data[0] ?? {}).filter(_ => _ !== 'name')
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
      <Box sx={{height, ml: -4 - (hideYTicks ? 4 : 0), mb: hideXTicks ? -4 : 0, ...sx}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart height={height - 60} data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeWidth={1}/>
            <Legend/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip wrapperStyle={{zIndex: 100, borderRadius: 4}} formatter={_ => `${_}${percent ? '%' : ''}`}/>
            {lines.map((line, i) => (
              <Line
                isAnimationActive={!disableAnimation}
                key={line}
                name={map(translation, _ => _[line]) ?? line}
                type="monotone"
                dataKey={line}
                stroke={colors(theme)[i] ?? colors(theme)[0]}
                strokeWidth={2}
              >
                {showCurves[i] && (
                  <LabelList
                    dataKey={lines[i]}
                    position="top"
                    style={{
                      fill: colors(theme)[i] ?? colors(theme)[0],
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
