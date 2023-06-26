import {ChartTools} from '../../../core/chartTools'
import {format} from 'date-fns'
import {ScLineChart, ScLineChartProps} from '@/shared/Chart/ScLineChart'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import React, {useMemo} from 'react'
import {set} from 'lodash'
import {ScLineChart2} from '@/shared/Chart/ScLineChart2'

export type DateKeys<T> = {
  [K in keyof T]: T[K] extends (Date | undefined) ? K : never;
}[keyof T]

export const KoboLineChartDate = <T, K extends DateKeys<T>>({
  data,
  question,
  label,
  end = new Date(),
  translations,
}: {
  label?: string | string[]
  question: K | K[]
  data: _Arr<T>
  end?: Date
  // @ts-ignore
  translations?: Partial<Record<T[K], string>>
}) => {
  const curve2 = useMemo(() => {
    const questions = ([question].flat() as K[])
    const _end = format(end, 'yyyy-MM')
    const res: Record<string, Record<K, number>> = {}
    data.forEach(d => {
      questions.map(q => {
        if (!d[q]) return
        const date = format(d[q] as Date, 'yyyy-MM')
        if (date.localeCompare(_end) > 0) return
        if (!res[date]) res[date] = {} as any
        if (!res[date][q]) res[date][q] = 0
        res[date][q] += 1
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
  }, [data, question, end, label])

  return (
    <>
      <ScLineChart2
        hideLabelToggle={true}
        height={220}
        data={curve2}
        translation={translations as any}
      />
      {/*<Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>*/}
      {/*{map(curve.head, start => <Box>{start.label}</Box>)}*/}
      {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
      {/*</Txt>*/}
    </>
  )
}