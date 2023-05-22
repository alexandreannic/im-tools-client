import {useMemo} from 'react'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '../../../utils/utils'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import {OblastISOSVG, ukraineSvgPath} from '../../../shared/UkraineMap/ukraineSvgPath'
import {ProtHHS2Enrich} from './DashboardProtHHS2'

export const useProtHHS2Data = ({
  data,
}: {
  data: _Arr<ProtHHS2Enrich>
}) => {

  return useMemo(() => {
    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast' | 'what_is_your_area_of_origin_oblast' = 'where_are_you_current_living_oblast'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: ProtHHS2Enrich): boolean => _[column] === isoCode}),
        {} as Record<OblastISOSVG, (_: ProtHHS2Enrich) => boolean>
      )

    return {
      categoryOblasts,
      byGender: chain(ChartTools.single({
        data: data.flatMap(_ => _.persons.map(_ => _.gender)),
        filterValue: ['unable_unwilling_to_answer'],
      }))
        .map(_ => ChartTools.mapValue(_, x => x.value))
        .get,
    }
  }, [data])
}