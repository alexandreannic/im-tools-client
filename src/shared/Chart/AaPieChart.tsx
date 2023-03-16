import {Box, colors, SxProps, Theme, useTheme} from '@mui/material'
import {Cell, Legend, Pie, PieChart, PieLabelRenderProps, PieProps, ResponsiveContainer, Tooltip} from 'recharts'
import React, {ReactElement, ReactNode} from 'react'
import {objToArray} from '../../utils/utils'
import {Enum} from '@alexandreannic/ts-utils'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < .01) {
    return <text/>
  }
  return (
    <text x={x} y={y} fill="white" fontWeight="bold" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomizedLabel = ({x, y, fill, value, percent, textAnchor}: PieLabelRenderProps) => {
  return <text
    x={x}
    y={y}
    fontSize="16"
    fontFamily="sans-serif"
    fill={fill}
    textAnchor={textAnchor}>
    {(percent! * 100).toFixed(1)}%
  </text>
}


export const AaPieChart = <T extends Record<string, number>>({
  sx,
  height,
  width,
  data,
  children,
  colors,
  m,
  outerRadius,
  ...props
}: {
  data: T
  outerRadius?: number
  m: Record<keyof T, string>,
  colors?: Partial<Record<keyof T, string>>
  height?: number
  width?: number
  children: ReactNode,
  sx?: SxProps<Theme>
}) => {
  const theme = useTheme()
  height = height ?? width ?? 200
  width = width ?? height ?? 200
  return (
    <Box sx={{height, width, mx: -1}} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip/>
          {children}
          <Pie
            data={objToArray(data).map(_ => {
              _.name = m[_.name]
              return _
            })}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            dataKey="value"
            fill={theme.palette.primary.main}
            label={renderCustomizedLabel}
            // label={renderCustomizedLabel(data)}
          >
            {colors && Object.keys(colors).map(k => <Cell key={k} fill={colors[k] ?? theme.palette.primary.main}/>)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
