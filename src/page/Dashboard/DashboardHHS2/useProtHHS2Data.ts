import {useMemo} from 'react'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {OblastISOSVG, ukraineSvgPath} from '../../../shared/UkraineMap/ukraineSvgPath'
import {ProtHHS2Enrich} from './DashboardProtHHS2'
import {ageGroup, groupByAgeGroup} from '../../../core/type'
import {endOfMonth, startOfMonth, sub} from 'date-fns'

export type UseProtHHS2Data = ReturnType<typeof useProtHHS2Data>

export const useProtHHS2Data = ({
  data,
}: {
  data?: _Arr<ProtHHS2Enrich>
}) => {
  return useMemo(() => {
    if (!data || data.length === 0) return
    const sorted = data.sort((a, b) => a.end.getTime() - b.end.getTime())
    const start = sorted[0].end
    const end = sorted[sorted.length - 1].end
    const currentMonth = data.filter(_ => _.end >= startOfMonth(end))
    const lastMonth = data.filter(_ => _.end < startOfMonth(end) && _.end > startOfMonth(sub(end, {months: 1})))

    const flatData = data.flatMap(_ => _.persons.map(p => ({..._, ...p})))

    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast' | 'what_is_your_area_of_origin_oblast' = 'where_are_you_current_living_oblast'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: ProtHHS2Enrich): boolean => _[column] === isoCode}),
        {} as Record<OblastISOSVG, (_: ProtHHS2Enrich) => boolean>
      )

    const byCurrentOblast = ChartTools.byCategory({
      categories: categoryOblasts('where_are_you_current_living_oblast'),
      data: flatData,
      filter: _ => true,
    })

    const byOriginOblast = ChartTools.byCategory({
      categories: categoryOblasts('what_is_your_area_of_origin_oblast'),
      data: flatData,
      filter: _ => true,
    })

    const idps = data.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')
    const idpsIndividuals = flatData.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')

    return {
      start,
      end,
      currentMonth,
      lastMonth,
      flatData,
      idps,
      idpsIndividuals,
      individuals: data.sum(_ => _.persons.length),
      categoryOblasts,
      ageGroup: chain(data.flatMap(_ => _.persons).filter(_ => _.age !== undefined).groupBy(_ => groupByAgeGroup(_, p => p.age!)))
        .map(_ => Enum.entries(_).map(([group, v]) => ({
            key: group,
            Male: v.filter(_ => _.gender === 'male').length,
            Female: v.filter(_ => _.gender === 'female').length,
            Other: v.filter(_ => _.gender !== 'male' && _.gender !== 'female').length,
          })
        ))
        .map(_ => _.sort((a, b) => Object.keys(ageGroup).indexOf(b.key) - Object.keys(ageGroup).indexOf(a.key)))
        .get
      ,

      byGender: chain(ChartTools.single({
        data: data.flatMap(_ => _.persons.map(_ => _.gender)),
        filterValue: ['unable_unwilling_to_answer'],
      }))
        .map(ChartTools.mapValue(_ => _.value))
        .get,

      byCurrentOblast,
      byOriginOblast,
    }
  }, [data])
}