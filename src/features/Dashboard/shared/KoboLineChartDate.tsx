import {format} from 'date-fns'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import React, {useMemo} from 'react'
import {ScLineChart2} from '@/shared/Chart/ScLineChart2'
import {Utils} from '@/utils/utils'
import {BoxProps} from '@mui/material'

export type DateKeys<T> = {
  [K in keyof T]: T[K] extends (Date | undefined) ? K : never;
}[keyof T]

export const KoboLineChartDate = <T, K extends DateKeys<T>>({
  data,
  question,
  label,
  start,
  end = new Date(),
  translations,
  ...props
}: {
  label?: string | string[]
  question: K | K[]
  data: T[]
  start?: Date
  end?: Date
  // @ts-ignore
  translations?: Partial<Record<T[K], string>>
} & Pick<BoxProps, 'sx'>) => {
  const curve = useMemo(() => {
    const questions = ([question].flat() as K[])
    // const _end = format(end, 'yyyy-MM')
    const res: Record<string, Record<K, number>> = {}
    data.forEach(d => {
      questions.map(q => {
        if (!d[q]) return
        const date = d[q] as Date
        const yyyyMM = format(date, 'yyyy-MM')
        if (date.getTime() > end.getTime() || (start && date.getTime() < start.getTime())) return
        if (!res[yyyyMM]) res[yyyyMM] = {} as any
        if (!res[yyyyMM][q]) res[yyyyMM][q] = 0
        res[yyyyMM][q] += 1
      })
    })
    return Enum.entries(res)
      .map(([date, v]) => {
        questions.forEach(q => {
          if (!v[q]) v[q] = 0
        })
        return [date, v] as [string, Record<K, number>]
      })
      .map(([date, v]) => ({name: date, ...v}))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data, question, end])

  return (
    <>
      <ScLineChart2
        {...props}
        hideLabelToggle={true}
        height={220}
        data={curve}
        translation={translations as any}
      />
      {/*<Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>*/}
      {/*{map(curve.head, start => <Box>{start.label}</Box>)}*/}
      {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
      {/*</Txt>*/}
    </>
  )
}