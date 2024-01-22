import {ChartDataVal, ChartHelperOld} from './chartHelperOld'
import {Enum, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '../../core/i18n'
import React, {ReactNode, useMemo} from 'react'
import {chain, KeyOf} from '@/utils/utils'
import {ChartBar} from '@/shared/chart/ChartBar'
import {Checkbox} from '@mui/material'
import {ChartHelper} from '@/shared/chart/chartHelper'

export interface ChartBarMultipleByProps<
  D extends Record<string, any>,
  R extends string | undefined,
  O extends Record<NonNullable<R>, string>,
> {
  onClickData?: (_: R) => void
  limit?: number
  // sortBy?: typeof ChartHelper2.sortBy.value
  data: Seq<D>,
  mergeOptions?: Partial<Record<KeyOf<O>, KeyOf<O>>>
  label?: O
  filterValue?: KeyOf<O>[]
  by: (_: D) => R[] | undefined,
  checked?: Record<NonNullable<R>, boolean>
  onToggle?: (_: R) => void
  base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
}

export const ChartBarMultipleBy = <
  D extends Record<string, any>,
  K extends string | undefined,
  O extends Record<NonNullable<K>, string>,
>({
  by,
  data,
  limit,
  onClickData,
  // sortBy,
  checked,
  onToggle,
  label,
  filterValue,
  base,
  mergeOptions,
}: ChartBarMultipleByProps<D, K, O>) => {
  const res = useMemo(() => {
    const source = data.map(d => {
      if (by(d) === undefined) return
      if (mergeOptions) {
        return seq(by(d) as string[]).map(_ => (mergeOptions as any)[_] ?? _).distinct(_ => _).get()
      }
      return by(d)
    }).compact()
    return ChartHelper.multiple({
      data: source,
      filterValue,
      base,
    }).setLabel(label).take(limit).get()
  }, [data, by, label])

  return (
    <ChartBar
      data={res}
      onClickData={_ => onClickData?.(_ as K)}
      labels={!onToggle ? undefined :
        seq(Enum.keys(res)).reduceObject<Record<string, ReactNode>>((option => [
            option,
            <Checkbox
              key={option as string}
              size="small"
              checked={(checked as any)?.[option] ?? false}
              onChange={() => onToggle(option)}
            />
          ]
        ))
      }
    />
  )
}


