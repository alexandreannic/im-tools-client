import {Obj, Seq} from '@alexandreannic/ts-utils'
import React, {useMemo} from 'react'
import {ChartLine, ChartLineData} from '@/shared/chart/ChartLine'
import {BoxProps} from '@mui/material'

export const ChartLineBy = <
  T extends Record<string, any>,
>({
  data,
  getX,
  getY,
  height,
  label,
  ...props
}: {
  height?: number
  getX: (_: T) => string
  getY: (_: T) => number
  label: string
  data: Seq<T>
} & BoxProps) => {
  const transform = useMemo(() => {
    const gb = data.groupBy(getX)
    return Obj.entries(gb).map(([k, v]) => {
      return ({
        name: k,
        [label]: v.sum(getY as any),
      }) as unknown as ChartLineData
    })
  }, [data])
  return (
    <ChartLine
      sx={props.sx}
      data={transform}
      percent
      height={height}
      hideLabelToggle
    />
  )
}