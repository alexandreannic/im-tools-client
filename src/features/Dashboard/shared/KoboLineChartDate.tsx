import {format} from 'date-fns'
import {Enum} from '@alexandreannic/ts-utils'
import React, {useMemo} from 'react'
import {ScLineChart2, ScLineChartProps} from '@/shared/Chart/ScLineChart2'
import {BoxProps} from '@mui/material'

export type DateKeys<T> = {
  [K in keyof T]: T[K] extends (Date | undefined) ? K : never;
}[keyof T]

export const KoboLineChartDate = <T, K extends DateKeys<T>>({
  data,
  curves,
  label,
  height,
  start,
  end = new Date(),
  // translations,
  ...props
}: {
  height?: number
  curves: Record<string, (_: T) => Date | undefined>
  label?: string | string[]
  data: T[]
  start?: Date
  end?: Date
  // @ts-ignore
  // translations?: Partial<Record<T[K], string>>
} & Pick<ScLineChartProps, 'colors' | 'sx'>) => {
  const curve = useMemo(() => {
    // const questions = ([question].flat() as K[])
    // const _end = format(end, 'yyyy-MM')
    const res: Record<string, Record<string, number>> = {}
    data.forEach(d => {
      Enum.entries(curves).map(([q, fn]) => {
        const date = fn(d) as Date | undefined
        if (!date) return
        const yyyyMM = format(date, 'yyyy-MM')
        if (date.getTime() > end.getTime() || (start && date.getTime() < start.getTime())) return
        if (!res[yyyyMM]) res[yyyyMM] = {} as any
        if (!res[yyyyMM][q]) res[yyyyMM][q] = 0
        res[yyyyMM][q] += 1
      })
    })
    return Enum.entries(res)
      .map(([date, v]) => {
        Enum.keys(curves).forEach(q => {
          if (!v[q]) v[q] = 0
        })
        return [date, v] as [string, Record<K, number>]
      })
      .map(([date, v]) => ({name: date, ...v}))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data, curves, end])

  return (
    <>
      <ScLineChart2
        {...props}
        hideLabelToggle={true}
        height={height ?? 220}
        data={curve}
        // translation={translations as any}
      />
      {/*<Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>*/}
      {/*{map(curve.head, start => <Box>{start.label}</Box>)}*/}
      {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
      {/*</Txt>*/}
    </>
  )
}