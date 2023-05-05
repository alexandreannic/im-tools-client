import {useMemo} from 'react'
import {ChartTools} from '../../core/chartTools'
import {chain} from '../../utils/utils'
import {ProtHHS_2_1Options} from '../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import {OblastISOSVG, ukraineSvgPath} from '../../shared/UkraineMap/ukraineSvgPath'
import {ProtHHS_2_1Enrich} from './Dashboard'

export const useProtHH_2_1Data = ({
  data,
}: {
  data: _Arr<ProtHHS_2_1Enrich>
}) => {

  return useMemo(() => {
    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast' | 'what_is_your_area_of_origin_oblast' = 'where_are_you_current_living_oblast'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: ProtHHS_2_1Enrich): boolean => _[column] === isoCode}),
        {} as Record<OblastISOSVG, (_: ProtHHS_2_1Enrich) => boolean>
      )

    return {
      byGender: chain(ChartTools.single({
        data: data.flatMap(_ => _.persons.map(_ => _.gender)),
        filterValue: ['unable_unwilling_to_answer'],
      }))
        .map(_ => ChartTools.mapValue(_, x => x.value))
        .get,

      do_you_identify_as_any_of_the_following: chain(ChartTools.single({
        data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
      }))
        .map(ChartTools.sortBy.value)
        .map(ChartTools.setLabel(ProtHHS_2_1Options.do_you_identify_as_any_of_the_following))
        .get,

      where_are_you_current_living_oblast: ChartTools.byCategory({
        categories: categoryOblasts('where_are_you_current_living_oblast'),
        data: data,
        filter: _ => true,
      })
    }
  }, [data])
}