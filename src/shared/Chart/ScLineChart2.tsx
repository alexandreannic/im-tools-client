import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts'
import * as React from 'react'
import {memo} from 'react'
import {Box, SxProps, Theme, useTheme} from '@mui/material'
import {map} from '@alexandreannic/ts-utils'

export interface ScLineChartPropsBase {
  /**
   * This props may be needed because sometimes label are not showing because of animation.
   * https://github.com/recharts/recharts/issues/1135
   */
  disableAnimation?: boolean
  hideLabelToggle?: boolean
  translation?: Record<string, string>
  height?: number
  sx?: SxProps
  hideYTicks?: boolean
  hideXTicks?: boolean
}

interface Props extends ScLineChartPropsBase {
  data: ScLineChart2Data[]
}

export type ScLineChart2Data = Record<string, number> & {
  name: string
}

const colors = (t: Theme) => [t.palette.primary.main, '#e48c00', 'red', 'green']

export const ScLineChart2 = memo(({
  data,
  sx,
  translation,
  hideYTicks,
  hideXTicks,
  disableAnimation,
  hideLabelToggle,
  height = 220
}: Props) => {
  const theme = useTheme()
  // const [showCurves, setShowCurves] = useState<boolean[]>(new Array(curves.length).fill(false))
  // const mappedData = useMemo(() => {
  //   const res: any[] = []
  //   curves.forEach((curve, i) => {
  //     Object.entries(curve.curve).forEach(([k, data], j) => {
  //       if (!res[j]) res[j] = {date: data.label ?? k} as any
  //       res[j][curve.key] = data.value
  //     })
  //     res.push()
  //   })
  //   return res
  // }, [curves])

  const lines = Object.keys(data[0] ?? {}).filter(_ => _ !== 'name')
  return (
    <>
      {/*{!hideLabelToggle && (*/}
      {/*  <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>*/}
      {/*    {curves.map((c, i) => (*/}
      {/*      <>*/}
      {/*        <Checkbox*/}
      {/*          key={c.key}*/}
      {/*          checked={showCurves[i]}*/}
      {/*          onChange={e => setShowCurves(prev => prev.map((_, index) => (i === index ? e.currentTarget.checked : _)))}*/}
      {/*          sx={{'& svg': {fill: c.color ?? colors(theme)[i] ?? colors(theme)[0] + ' !important'}}}*/}
      {/*        />*/}
      {/*      </>*/}
      {/*    ))}*/}
      {/*  </Box>*/}
      {/*)}*/}
      <Box sx={{height, ml: -4 - (hideYTicks ? 4 : 0), mb: hideXTicks ? -4 : 0, ...sx}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart height={height - 60} data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeWidth={1}/>
            <XAxis tick={!hideXTicks} dataKey="name"/>
            <YAxis tick={!hideYTicks}/>
            <Tooltip wrapperStyle={{zIndex: 100, borderRadius: 4}} formatter={_ => `${_}%`}/>
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
                {/*{showCurves[i] && (*/}
                {/*  <LabelList*/}
                {/*    dataKey={_.key}*/}
                {/*    position="top"*/}
                {/*    style={{*/}
                {/*      fill: _.color ?? colors(theme)[i] ?? colors(theme)[0],*/}
                {/*      fontSize: styleUtils(theme).fontSize.small,*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
})
