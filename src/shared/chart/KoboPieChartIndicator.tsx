import {PieChartIndicator, PieChartIndicatorProps} from '@/shared/chart/PieChartIndicator'
import * as React from 'react'
import {useMemo} from 'react'
import {Seq} from '@alexandreannic/ts-utils'
import {StringArrayKeys, StringKeys} from '../../core/type'

export const ChartPieIndicator = <T, >({
  title,
  compare,
  data,
  filter,
  filterBase,
  hideEvolution,
  ...props
}: {
  compare?: {before: Seq<T>, now?: Seq<T>}
  title?: string
  filter: (_: T) => boolean
  filterBase?: (_: T) => boolean
  data: Seq<T>
  showValue?: boolean
  showBase?: boolean
  hideEvolution?: boolean
} & Omit<PieChartIndicatorProps, 'base' | 'value'>) => {
  const percent = ({res, base}: {res: number, base: number}) => res / base
  const run = (d: Seq<T>) => {
    const base = filterBase ? d.filter(filterBase) : d
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

