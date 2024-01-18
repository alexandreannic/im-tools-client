import {Enum, Seq} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'
import React, {useMemo} from 'react'
import {StringKeys} from '../../core/type'
import {ScLineChart2, ScLineChart2Data} from '@/shared/chart/ScLineChart2'

export const KoboLineChart = <T extends {end: Date}, K extends StringKeys<T>, V extends T[K]>({
  data,
  question,
  displayedValues,
  translations,
  height,
}: {
  height?: number
  question: K
  data: Seq<T>
  displayedValues?: V[]
  // @ts-ignore
  translations?: Partial<Record<T[K], string>>
}) => {
  const transform: ScLineChart2Data[] = useMemo(() => {
    return Enum.entries(data.groupBy(_ => format(_.end, 'yyyy-MM'))).map(([date, group]) => {
      const res = {} as ScLineChart2Data
      group
        .map(_ => _[question])
        .filter(_ => _ !== undefined && (!displayedValues || displayedValues?.includes(_ as any)))
        .forEach(_ => {
          // @ts-ignore
          if (!res[_]) res[_] = 1
          // @ts-ignore
          else res[_] += 1
        })
      Enum.keys(res).forEach(k => {
        res[k] = Math.round(res[k] / group.length * 100)
      })
      res.name = date
      return res
    })
  }, [data, question])
  return (
    <ScLineChart2
      data={transform}
      percent
      height={height}
      translation={translations as any}
      hideLabelToggle
    />
  )
}