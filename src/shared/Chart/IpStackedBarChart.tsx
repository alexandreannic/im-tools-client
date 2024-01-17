import {Bar, BarChart, Legend, LegendProps, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import React, {forwardRef} from 'react'
import {Box, BoxProps, Theme, useTheme} from '@mui/material'
import {chartConfig} from './chartConfig'
import {seq} from '@alexandreannic/ts-utils'

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({x, y, stroke, value, ...rest}: any) => {
  return <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{value}</text>
}

export const commonLegendProps = {
  formatter: (_: any) => <Box component="span" sx={{verticalAlign: 'middle', color: t => t.palette.text.primary}}>{_}</Box>,
  iconType: 'circle'
} as const

export const IpStackedBarChart = ({
  data,
  height,
  width,
  sx,
  colors = chartConfig.defaultColors,
  ...props
}: {
  colors?: (t: Theme) => string[]
  height?: number | string
  width?: number | string
  data: any[]
} & BoxProps) => {
  const theme = useTheme()
  const {key, ...first} = data[0] ?? {key: undefined}
  height = height ?? width ?? 340
  width = width ?? '100%'
  return (
    <Box sx={{position: 'relative', height, width, ...sx}} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          // width={width}
          // height={height}
          data={data}
          margin={{
            // top: 20,
            // right: 30,
            left: -40,
            // bottom: 5,
          }}
        >
          {/*<CartesianGrid strokeDasharray="3 3"/>*/}
          <XAxis type="number" domain={[0, 10]}/>
          <YAxis dataKey="key" type="category" width={110}/>
          <Tooltip/>
          <Legend {...commonLegendProps}/>
          {Object.keys(first).map((k, i) =>
            <Bar key={k} dataKey={k} stackId="a" fill={colors(theme)[i]}/>
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export const IpStackedBarChartSplit = ({
  data,
  height,
  width,
  sx,
  ...props
}: {
  height?: number | string
  width?: number | string
  data: any[]
} & BoxProps) => {
  const theme = useTheme()
  const colors = [
    '#FF4136',
    '#FF851B',
    '#FFDC00',
    '#3D9970',
    '#0074D9',
    '#B10DC9',
    '#FF0066',
    '#F012BE',
    '#FF6F61',
    '#7FDBFF',
  ]
  const allKeys = seq(data.flatMap(({key, ...other}) => Object.keys(other))).distinct(_ => _)
  height = height ?? width ?? 340
  width = width ?? '100%'
  return (
    <Box sx={{position: 'relative', height, width, ...sx}} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          // width={width}
          // height={height}
          data={data}
          // margin={{
          //   top: 20,
          //   right: 30,
          //   left: 20,
          //   bottom: 5,
        >
          {/*<CartesianGrid strokeDasharray="3 3"/>*/}
          <XAxis type="number" domain={[0, 100]}/>
          <YAxis dataKey="key" type="category" width={110}/>
          <Tooltip/>
          <Legend {...commonLegendProps}/>
          {allKeys.map((k, i) =>
            <Bar key={k} dataKey={k} stackId={k} fill={colors[i]}/>
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}