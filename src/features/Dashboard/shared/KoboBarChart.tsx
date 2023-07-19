import {ChartDataVal, ChartTools} from '../../../core/chartTools'
import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {useI18n} from '../../../core/i18n'
import React, {useMemo} from 'react'
import {chain} from '@/utils/utils'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Checkbox} from '@mui/material'

export const makeKoboBarChartComponent = <D extends Record<string, any>, O extends Partial<Record<keyof D, Record<string, string>>>>({
  options,
}: {
  options: O,
}) => <K extends keyof D>({
  question,
  data,
  limit,
  onClickData,
  sortBy,
  checked,
  onToggle,
  overrideLabel = {},
  filterValue,
  questionType = 'single',
  base
}: {
  onClickData?: (_: K) => void
  limit?: number
  questionType?: 'multiple' | 'single'
  sortBy?: typeof ChartTools.sortBy.value
  data: _Arr<D>,
  overrideLabel?: Partial<Record<keyof O[K], string>>
  filterValue?: (keyof O[K])[]
  question: K,
  checked?: Record<K, boolean>
  onToggle?: (_: K) => void
  base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
}) => {
  const {m} = useI18n()
  const res = useMemo(() => {
    const source = Arr(data).map(_ => _[question]).compact()
    const chart = questionType === 'multiple'
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
      ...options[question],
      ...overrideLabel,
    }))
      .map(sortBy ?? ChartTools.sortBy.value)
      .map(limit ? ChartTools.take(limit) : _ => _)
      .get as Record<K, ChartDataVal>
  }, [data, question])
  return (
    <HorizontalBarChartGoogle
      data={res}
      onClickData={_ => onClickData?.(_ as K)}
      labels={!onToggle ? undefined :
        Arr(Enum.keys(res)).reduceObject((option => [
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


