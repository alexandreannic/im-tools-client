import {useMemo} from 'react'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import {OblastISOSVG, ukraineSvgPath} from '../../../shared/UkraineMap/ukraineSvgPath'
import {ProtHHS2Enrich} from './DashboardProtHHS2'
import {groupByAgeGroup} from '../../../core/type'

export const useProtHHS2Data = ({
  data,
}: {
  data?: _Arr<ProtHHS2Enrich>
}) => {
  return useMemo(() => {
    if (!data) return

    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast' | 'what_is_your_area_of_origin_oblast' = 'where_are_you_current_living_oblast'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: ProtHHS2Enrich): boolean => _[column] === isoCode}),
        {} as Record<OblastISOSVG, (_: ProtHHS2Enrich) => boolean>
      )

    return {
      flatData: data.flatMap(_ => _.persons.map(p => ({..._, ...p}))),
      individuals: data.flatMap(_ => _.persons).length,
      categoryOblasts,
      ageGroup: chain(data.flatMap(_ => _.persons).filter(_ => _.age !== undefined).groupBy(groupByAgeGroup))
        .map(_ => Enum.entries(_).map(([group, v]) => ({
            key: group,
            Male: v.filter(_ => _.gender === 'male').length,
            Female: v.filter(_ => _.gender === 'female').length,
            Other: v.filter(_ => _.gender === undefined).length,
          })
        ))
        // .map(_ => ChartTools.sortBy.custom(Enum.keys(ageGroup))(_))
        .get
      ,

      byGender: chain(ChartTools.single({
        data: data.flatMap(_ => _.persons.map(_ => _.gender)),
        filterValue: ['unable_unwilling_to_answer'],
      }))
        .map(ChartTools.mapValue(_ => _.value))
        .get,
    }
  }, [data])
}