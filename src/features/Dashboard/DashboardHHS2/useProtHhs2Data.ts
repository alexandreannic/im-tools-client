import {useCallback, useMemo} from 'react'
import {ChartTools} from '../../../shared/Chart/chartTools'
import {chain} from '@/utils/utils'
import {Enum, Seq} from '@alexandreannic/ts-utils'
import {ukraineSvgPath} from '@/shared/UkraineMap/ukraineSvgPath'
import {Person} from '../../../core/type'
import {subDays} from 'date-fns'
import {ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {OblastISO} from '@/shared/UkraineMap/oblastIndex'

export type UseProtHHS2Data = ReturnType<typeof useProtHhs2Data>

export const useProtHhs2Data = ({
  data,
}: {
  data?: Seq<ProtHHS2Enrich>
}) => {
  const ageGroup = useCallback((ageGroup: Person.AgeGroup, hideOther?: boolean) => {
    const gb = Person.groupByGenderAndGroup(ageGroup)(data?.flatMap(_ => _.persons)!)
    return new Enum(gb).entries().map(([k, v]) => ({key: k, ...v}))
  }, [data])

  return useMemo(() => {
    if (!data || data.length === 0) return
    const sorted = data.sort((a, b) => a.end.getTime() - b.end.getTime())
    const start = sorted[0].end
    const end = sorted[sorted.length - 1].end
    // const currentMonth = data.filter(_ => _.end >= startOfMonth(end))
    const lastMonth = data.filter(_ => _.end < subDays(end, 30))

    const flatData = data.flatMap(_ => _.persons.map(p => ({..._, ...p})))

    const idps = data.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')

    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast' | 'what_is_your_area_of_origin_oblast' = 'where_are_you_current_living_oblast'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: ProtHHS2Enrich): boolean => _[column] === isoCode}),
        {} as Record<OblastISO, (_: ProtHHS2Enrich) => boolean>
      )

    const byCurrentOblast = ChartTools.byCategory({
      categories: categoryOblasts('where_are_you_current_living_oblast'),
      data: data,
      filter: _ => true,
    })

    const byOriginOblast = ChartTools.byCategory({
      categories: categoryOblasts('what_is_your_area_of_origin_oblast'),
      data: data,
      filter: _ => true,
    })

    const idpsByCurrentOblast = ChartTools.byCategory({
      categories: categoryOblasts('where_are_you_current_living_oblast'),
      data: idps,
      filter: _ => true,
    })

    const idpsByOriginOblast = ChartTools.byCategory({
      categories: categoryOblasts('what_is_your_area_of_origin_oblast'),
      data: idps,
      filter: _ => true,
    })

    return {
      start,
      end,
      // currentMonth,
      lastMonth,
      flatData,
      individualsCount: data.sum(_ => _.persons.length),
      categoryOblasts,
      ageGroup: ageGroup,
      byGender: chain(ChartTools.single({
        data: data.flatMap(_ => _.persons.map(_ => (_.gender === undefined || _.gender === 'Other') ? 'other' : _.gender)),
      }))
        .map(ChartTools.mapValue(_ => _.value))
        .get,
      idps,
      byCurrentOblast,
      byOriginOblast,
      idpsByOriginOblast,
      idpsByCurrentOblast,
    }
  }, [data])
}