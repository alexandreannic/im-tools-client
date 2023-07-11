import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
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
}: {
  onClickData?: (_: K) => void
  limit?: number
  questionType?: 'multiple' | 'single'
  sortBy?: typeof ChartTools.sortBy.value
  data: _Arr<D>,
  overrideLabel?: Partial<Record<keyof O[K], string>>
  filterValue?: (keyof O[K])[]
  question: K
}) => {
  const {m} = useI18n()
  const res = useMemo(() => {
    const base = Arr(data).map(_ => _[question]).compact()
      .filter(_ => {
        return !filterValue || (questionType === 'single'
            ? !filterValue.includes(_)
            : Arr(filterValue).intersect(_).length === 0
        )
      })
    return {
      base: base.length,
      chart: chain(ChartTools[questionType]({
        data: base as any,
        // filterValue: filterValue as any,
      }))
        .map(ChartTools.setLabel({
          ...options[question],
          ...overrideLabel,
        }))
        .map(sortBy ?? ChartTools.sortBy.value)
        .map(limit ? ChartTools.take(limit) : _ => _)
        .get
    }
  }, [data, question])
  return (
    <HorizontalBarChartGoogle data={res.chart} base={res.base} onClickData={_ => onClickData?.(_ as K)}/>
  )
}


