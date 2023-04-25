import {useMemo} from 'react'
import {ChartTools} from '../../core/chartTools'
import {chain} from '../../utils/utils'
import {ProtHHS_2_1Options} from '../../core/koboForm/ProtHHS_2_1Options'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import {OblastISO, ukraineSvgPath} from '../../shared/UkraineMap/ukraineSvgPath'
import {ProtHHS_2_1Enrich} from './Dashboard'

export const useProtHH_2_1Data = ({
  data,
}: {
  data: _Arr<ProtHHS_2_1Enrich>
}) => {

  return useMemo(() => {
    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast_iso' | 'what_is_your_area_of_origin_oblast_iso' = 'where_are_you_current_living_oblast_iso'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: ProtHHS_2_1Enrich): boolean => _[column] === isoCode}),
        {} as Record<OblastISO, (_: ProtHHS_2_1Enrich) => boolean>
      )

    return {
      do_you_identify_as_any_of_the_following: chain(ChartTools.single({
        data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
      }))
        .map(ChartTools.sortBy.value)
        .map(ChartTools.setLabel(ProtHHS_2_1Options.do_you_identify_as_any_of_the_following))
        .val,

      where_are_you_current_living_oblast: ChartTools.byCategory({
        categories: categoryOblasts('where_are_you_current_living_oblast_iso'),
        data: data,
        filter: _ => true,
      })
    }
  }, [data])
}