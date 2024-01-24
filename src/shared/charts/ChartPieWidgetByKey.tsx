import {StringArrayKeys, StringKeys} from '@/core/type/generic'
import * as React from 'react'
import {useMemo} from 'react'
import {ChartPieWidgetBy, ChartPieWidgetProps} from '@/shared/charts/ChartPieWidgetBy'

export const ChartPieWidgetByKey = <T, K extends StringKeys<T> | StringArrayKeys<T>>({
  property,
  filter,
  filterBase,
  data,
  compare,
  ...props
}: ChartPieWidgetProps<T> & {
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
    <ChartPieWidgetBy
      data={dataDefined as any}
      compare={compareDefined}
      filter={_ => filter(_[property])}
      filterBase={filterBase ? (_ => filterBase(_[property])) : undefined}
      {...props}
    />
  )
}