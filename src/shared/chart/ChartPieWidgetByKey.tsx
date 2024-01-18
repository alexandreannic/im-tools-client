import {StringArrayKeys, StringKeys} from '@/core/type'
import * as React from 'react'
import {useMemo} from 'react'
import {ChartPieIndicator, ChartPieIndicatorProps} from '@/shared/chart/KoboPieChartIndicator'

export const ChartPieIndicatorByKey = <T, K extends StringKeys<T> | StringArrayKeys<T>>({
  property,
  filter,
  filterBase,
  data,
  compare,
  ...props
}: ChartPieIndicatorProps<T> & {
  property: K
  filter: (_: T[K]) => boolean
  filterBase?: (_: T[K]) => boolean
  qw?: (_: T[K]) => boolean
}) => {
  const {dataDefined, compareDefined} = useMemo(() => {
    return {
      dataDefined: data.filter(_ => _[property] !== undefined),
      compareDefined: compare ? {
        before: compare?.before?.filter(_ => _[property] !== undefined),
        now: compare?.now?.filter(_ => _[property] !== undefined),
      } : undefined
    }
  }, [data, property])
  return (
    <ChartPieIndicator
      data={dataDefined as any}
      compare={compareDefined}
      filter={_ => filter(_[property])}
      filterBase={filterBase ? (_ => filterBase(_[property])) : undefined}
      {...props}
    />
  )
}