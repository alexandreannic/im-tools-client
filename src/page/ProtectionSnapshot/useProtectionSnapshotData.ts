import {useMemo} from 'react'
import {ChartTools} from '../../core/chartTools'
import {format} from 'date-fns'
import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {useI18n} from '../../core/i18n'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {chain, objToArray, sortObject} from '../../utils/utils'
import Answer = KoboFormProtHH.Answer
import Gender = KoboFormProtHH.Gender
import PropertyDamage = KoboFormProtHH.PropertyDamage
import PriorityNeed = KoboFormProtHH.PriorityNeed

export type UseProtectionSnapshotData = ReturnType<typeof useProtectionSnapshotData>

interface Keys<T> extends Record<string, T> {
  hohh60: T
  hohhFemale: T
  memberWithDisability: T
  idp: T
}

export const useProtectionSnapshotData = (data: _Arr<Answer>, {
  start,
  end,
}: {
  start: Date
  end: Date
}) => {
  const {m} = useI18n()

  const categoryFilters = {
    idp: KoboFormProtHH.filterByIDP,
    hohh60: KoboFormProtHH.filterByHoHH60,
    hohhFemale: KoboFormProtHH.filterByHoHHFemale,
    memberWithDisability: KoboFormProtHH.filterWithDisability,
  }

  const sortBy = {
    value: (a: {value: number}, b: {value: number}) => b.value - a.value,
    percent: (a: {value: number, base: number}, b: {value: number, base: number}) => b.value / b.base - a.value / a.base,
  }

  return useMemo(() => {
    return {
      _29_nfiNeededByOblast: chain(
        ChartTools.groupBy({
          data,
          groupBy: _ => _._4_What_oblast_are_you_from,
          filter: _ => _._29_Which_NFI_do_you_need !== undefined && !_._29_Which_NFI_do_you_need.includes(KoboFormProtHH.NFI.do_not_require41)
        })).val,

      _29_nfiNeededByCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => _._29_Which_NFI_do_you_need !== undefined && !_._29_Which_NFI_do_you_need.includes(KoboFormProtHH.NFI.do_not_require41)
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_cash_byCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes(PriorityNeed.cash)
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_shelter_byCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes(PriorityNeed.shelter)
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_health_byCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes(PriorityNeed.health)
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_What_is_your_first_priorty: chain(ChartTools.single({
        data: data.map(_ => _._40_1_What_is_your_first_priorty).compact(),
      }))
        .map(ChartTools.sortBy.value)
        .map(ChartTools.setLabel(m.protectionHHSnapshot.priorityNeeds))
        .val,

      _27_Has_your_house_apartment_been_: ChartTools.percentage({
        data: data.map(_ => _._27_Has_your_house_apartment_been_),
        value: _ => _ === 'yes39'
      }),

      _12_Do_you_identify_as_any_of: chain(ChartTools.single({
        data: data.map(_ => _._12_Do_you_identify_as_any_of).compact(),
      }))
        .map(ChartTools.sortBy.value)
        .map(ChartTools.setLabel(m.statusType))
        .val,

      _40_2_What_is_your_second_priority: chain(ChartTools.single({
        data: data.map(_ => _._40_2_What_is_your_second_priority).compact(),
      }))
        .map(ChartTools.sortBy.value)
        .map(ChartTools.setLabel(m.protectionHHSnapshot.priorityNeeds))
        .val,

      _27_1_If_yes_what_is_level_of_the_damage: chain(ChartTools.single({
        data: data.map(_ => _._27_1_If_yes_what_is_level_of_the_damage).compact(),
      }))
        .map(_ => sortObject(_, ([labelA], [labelB]) => {
          const obj = Enum.keys(PropertyDamage)
          return obj.indexOf(labelB) - obj.indexOf(labelA)
        }))
        .map(ChartTools.setLabel(m.protectionHHSnapshot.propertyDamaged.title))
        .map(ChartTools.setDesc(m.protectionHHSnapshot.propertyDamaged.desc))
        .val,

      C_Vulnerability_catergories_that: chain(ChartTools.multiple({
        data: data.map(_ => _.C_Vulnerability_catergories_that).compact(),
      }))
        .map(ChartTools.setLabel(m.protectionHHSnapshot.vulnerability))
        .val,

      _28_Do_you_have_acce_current_accomodation: chain(ChartTools.multiple({
        data: data.map(_ => _._28_Do_you_have_acce_current_accomodation).compact(),
      }))
        .map(ChartTools.setLabel(m.protectionHHSnapshot.vulnerability))
        .val,

      _12_8_1_What_would_be_the_deciding_fac: chain(ChartTools.multiple({
        data: data.map(_ => _._12_8_1_What_would_be_the_deciding_fac).compact(),
      }))
        .map(ChartTools.setLabel(m.factorsToReturn))
        .val,

      _12_7_1_planToReturn: ChartTools.percentage({
        data: data.map(_ => _._12_7_1_Do_you_plan_to_return_to_your_),
        value: _ => _ === 'yes21' || _ === 'yes_but_no_clear_timeframe'
      }),
      // _12_7_1_planToReturn: (() => {
      //   const curve = ChartTools.indexByDate({
      //     data: data,
      //     getDate: _ => format(_.start, 'yyyy-MM'),
      //     percentageOf: _ => _._12_7_1_Do_you_plan_to_return_to_your_ === 'yes21'
      //   })
      //   return map(Object.values(curve), _ => (_[1]?.count ?? 0 - _[0]?.count ?? 0) * 100)!
      // })(),

      _12_3_1_dateDeparture: ChartTools.groupByDate({
        data: data
          .map(_ => _._12_3_1_When_did_you_your_area_of_origin)
          .compact()
          .filter(_ => _ > '2021-12' && _ < format(end, 'yyyy-dd'))
          .sort(),
        getDate: _ => _.replace(/-\d{2}$/, ''),
      }),

      oblastOrigins: data.map(_ => _._12_1_What_oblast_are_you_from_001)
        .map(_ => OblastIndex.findByKoboKey(_!)?.iso)
        .reduceObject<Record<string, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1]),

      oblastCurrent:
        data.map(_ => _._4_What_oblast_are_you_from)
          .map(_ => OblastIndex.findByKoboKey(_!)?.iso)
          .reduceObject<Record<string, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1]),

      totalMembers: data.sum(_ => _._8_What_is_your_household_size ?? 0),

      _8_individuals: (() => {
        const persons = data.flatMap(_ => _.persons)
        const byAgeGroup = Arr(persons).reduceObject<Record<keyof typeof KoboFormProtHH.ageGroup, {value: number}>>((p, acc) => {
          const group = Enum.keys(KoboFormProtHH.ageGroup).find(k => {
            const [min, max] = KoboFormProtHH.ageGroup[k]
            return p.age && p.age >= min && p.age <= max
          })
          if (group) return [group, {value: (acc[group]?.value ?? 0) + 1}]
        })

        const byGender = Arr(persons).reduceObject<Record<Gender | 'undefined', number>>((p, acc) => {
          return [p.gender ?? 'undefined', (acc[p.gender!] ?? 0) + 1]
        })

        return {
          persons: persons,
          byAgeGroup: byAgeGroup,
          byGender: byGender,
        }
      })()
    }
  }, [data])
}
