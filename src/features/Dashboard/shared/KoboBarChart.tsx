import {ChartTools} from '../../../core/chartTools'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {useI18n} from '../../../core/i18n'
import React, {useMemo} from 'react'
import {chain} from '@/utils/utils'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'

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
      .get
  }, [data, question])
  return (
    <HorizontalBarChartGoogle data={res} onClickData={_ => onClickData?.(_ as K)}/>
  )
}


