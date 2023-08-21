import {PieChartIndicator, PieChartIndicatorProps} from '@/shared/PieChartIndicator'
import * as React from 'react'
import {useMemo} from 'react'
import {_Arr} from '@alexandreannic/ts-utils'
import {StringArrayKeys, StringKeys} from '../../../core/type'

/** @deprecated*/
export const KoboPieChartIndicatorMultiple = <T, K extends StringArrayKeys<T>>({
  title,
  question,
  data,
  filter,
  filterBase,
  ...props
}: {
  title?: string
  question: K
  filter: (_: T[K]) => boolean
  filterBase?: (_: T[K]) => boolean
  data: _Arr<T>
} & Omit<PieChartIndicatorProps, 'value' | 'base'>) => {
  const baseData = useMemo(() => {
    const t = data.map(_ => _[question]).compact()
    // @ts-ignore
    return filterBase ? t.filter(filterBase) : t
  }, [data, filterBase])

  const res = useMemo(() => {
    return baseData.filter(filter)
  }, [baseData, filter])

  return (
    <PieChartIndicator title={title} value={res.length} base={data.length} {...props}/>
  )
}

export const KoboPieChartIndicator = <T, K extends StringKeys<T> | StringArrayKeys<T>>({
  title,
  question,
  compare,
  data,
  filter,
  filterBase,
  hideEvolution,
  ...props
}: {
  compare?: {before: _Arr<T>, now?: _Arr<T>}
  title?: string
  question: K
  filter: (_: T[K]) => boolean
  filterBase?: (_: T[K]) => boolean
  data: _Arr<T>
  showValue?: boolean
  showBase?: boolean
  hideEvolution?: boolean
} & Omit<PieChartIndicatorProps, 'base' | 'value'>) => {

  const percent = ({res, base}: {res: number, base: number}) => res / base

  const run = (d: _Arr<T>) => {
    const t = d.map(_ => _[question] as any).compact()
    const base = filterBase ? t.filter(filterBase) : t
    return {
      res: base.filter(filter).length,
      base: base.length || 1,
    }
  }
  const all = useMemo(() => run(data), [data, filter, filterBase])
  const comparedData = useMemo(() => {
    if (compare) {
      return {
        before: run(compare.before),
        now: compare.now ? run(compare.now) : undefined,
      }
    }
  }, [compare, filter, filterBase])

  return (
    <PieChartIndicator
      title={title}
      value={all.res}
      base={all.base}
      evolution={hideEvolution ? undefined : comparedData ? percent(comparedData.now ?? all) - percent(comparedData.before) : undefined}
      {...props}
    />
  )
}
