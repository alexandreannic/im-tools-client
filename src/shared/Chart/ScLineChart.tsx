import {Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts'
import * as React from 'react'
import {memo, useMemo, useState} from 'react'
import {Box, Checkbox, SxProps, useTheme} from '@mui/material'
import {styleUtils} from '../../core/theme'
import {chartConfig} from './chartConfig'

export interface ScLineChartPropsBase {
  /**
   * This props may be needed because sometimes label are not showing because of animation.
   * https://github.com/recharts/recharts/issues/1135
   */
  disableAnimation?: boolean
  hideLabelToggle?: boolean
  height?: number
  sx?: SxProps
  hideYTicks?: boolean
  hideXTicks?: boolean
}

export interface ScLineChartProps extends ScLineChartPropsBase {
  curves: {
    label: string
    key: string
    curve: Record<string, {label?: string; value: number}>
    color?: string
  }[]
}

const colors = chartConfig.defaultColors

export const ScLineChart = memo(({
  sx,
  hideYTicks,
  hideXTicks,
  disableAnimation,
  hideLabelToggle,
  curves,
  height = 300
}: ScLineChartProps) => {
  const theme = useTheme()
  const [showCurves, setShowCurves] = useState<boolean[]>(new Array(curves.length).fill(false))
  const mappedData = useMemo(() => {
    const res: any[] = []
    curves.forEach((curve, i) => {
      Object.entries(curve.curve).forEach(([k, data], j) => {
        if (!res[j]) res[j] = {date: data.label ?? k} as any
        res[j][curve.key] = data.value
      })
      res.push()
    })
    return res
  }, [curves])

  return (
    <>
      {!hideLabelToggle && (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          {curves.map((c, i) => (
            <>
              <Checkbox
                key={c.key}
                checked={showCurves[i]}
                onChange={e => setShowCurves(prev => prev.map((_, index) => (i === index ? e.currentTarget.checked : _)))}
                sx={{'& svg': {fill: c.color ?? colors(theme)[i] ?? colors(theme)[0] + ' !important'}}}
              />
            </>
          ))}
        </Box>
      )}
      <Box sx={{height, ml: -4 - (hideYTicks ? 4 : 0), mb: hideXTicks ? -4 : 0, ...sx}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart height={height - 60} data={mappedData}>
            <CartesianGrid strokeDasharray="3 3" strokeWidth={1}/>
            <Legend wrapperStyle={{position: 'relative', marginTop: -16}}/>
            <XAxis tick={!hideXTicks} dataKey="date"/>
            <YAxis tick={!hideYTicks}/>
            <Tooltip wrapperStyle={{zIndex: 100, borderRadius: 4}}/>
            {curves.map((_, i) => (
              <Line
                isAnimationActive={!disableAnimation}
                key={_.key}
                name={_.label}
                type="monotone"
                dataKey={_.key}
                stroke={_.color ?? colors(theme)[i] ?? colors(theme)[0]}
                strokeWidth={2}
              >
                {showCurves[i] && (
                  <LabelList
                    dataKey={_.key}
                    position="top"
                    style={{
                      fill: _.color ?? colors(theme)[i] ?? colors(theme)[0],
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
})

export const ScBarChart = ({curves, height}: ScLineChartProps) => {
  const theme = useTheme()

  const mappedData = useMemo(() => {
    const res: any[] = []
    curves.forEach((curve, i) => {
      Object.values(curve.curve).forEach((data, j) => {
        if (!res[j]) res[j] = {date: data.label} as any
        res[j][curve.key] = data.value
      })
      res.push()
    })
    return res
  }, [curves])

  return (
    <div style={{height: height ?? 300}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={mappedData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date"/>
          <YAxis/>
          <Tooltip/>
          <Legend wrapperStyle={{position: 'relative', marginTop: -16}}/>
          {curves.map((_, i) => (
            <Bar
              stackId="_"
              key={_.key}
              name={_.label}
              type="monotone"
              dataKey={_.key}
              fill={_.color ?? colors(theme)[i] ?? colors(theme)[0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
