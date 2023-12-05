import {Enum, seq, Seq} from '@alexandreannic/ts-utils'
import React, {useMemo} from 'react'
import {chain} from '@/utils/utils'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Checkbox} from '@mui/material'
import {ChartDataVal, ChartTools} from '@/core/chartTools'
import {useI18n} from '@/core/i18n'

interface ByPropertyProps<D extends Record<string, any>, K extends keyof D> {
  debug?: boolean
  onClickData?: (_: K) => void
  limit?: number
  multiple?: boolean
  sortBy?: typeof ChartTools.sortBy.value
  data: Seq<D>,
  mergeOptions?: Partial<Record<D[K], D[K]>>
  overrideLabel?: Partial<Record<D[K], string>>
  filterValue?: (D[K])[]
  property: K,
  checked?: Record<K, boolean>
  onToggle?: (_: K) => void
  base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
}

export const ByProperty = <D extends Record<string, any>, K extends keyof D>({
  property,
  data,
  limit,
  onClickData,
  sortBy,
  checked,
  onToggle,
  overrideLabel = {},
  filterValue,
  multiple,
  base,
  mergeOptions,
  debug
}: ByPropertyProps<D, K>) => {
  const {m} = useI18n()
  const res = useMemo(() => {
    const source = seq(data).map(d => {
      if (d[property] === undefined) return
      if (mergeOptions) {
        if (multiple) {
          return seq(d[property] as string[]).map(_ => (mergeOptions as any)[_] ?? _).distinct(_ => _)
        }
        return (mergeOptions as any)[d[property]] ?? d[property]
      }
      return d[property]
    }).compact()
    const chart = multiple
      ? ChartTools.multiple({
        data: source,
        filterValue: filterValue as string[],
        base,
      })
      : ChartTools.single({
        data: source,
        filterValue,
      })
    return chain(chart).map(ChartTools.setLabel({
      ...{} as any,
      ...overrideLabel,
    }))
      .map(sortBy ?? ChartTools.sortBy.value)
      .map(limit ? ChartTools.take(limit) : _ => _)
      .get as Record<K, ChartDataVal>
  }, [data, property])
  return (
    <HorizontalBarChartGoogle
      data={res}
      onClickData={_ => onClickData?.(_ as K)}
      labels={!onToggle ? undefined :
        seq(Enum.keys(res)).reduceObject((option => [
            option,
            <Checkbox
              key={option as string}
              size="small"
              checked={checked?.[option] ?? false}
              onChange={() => onToggle(option)}
            />
          ]
        ))
      }
    />
  )
}


