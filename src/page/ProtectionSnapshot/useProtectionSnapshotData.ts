import {useMemo} from 'react'
import {ChartTools} from '../../core/chartTools'
import {format} from 'date-fns'
import {_Arr, Arr, Enum, mapFor} from '@alexandreannic/ts-utils'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {useI18n} from '../../core/i18n'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {objToArray} from '../../utils/utils'
import Person = KoboFormProtHH.Person
import Answer = KoboFormProtHH.Answser
import Gender = KoboFormProtHH.Gender
import PropertyDamage = KoboFormProtHH.PropertyDamage
import {HorizontalBarChartGoogleData} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'

export type UseProtectionSnapshotData = ReturnType<typeof useProtectionSnapshotData>

export const useProtectionSnapshotData = (data: _Arr<Answer>, {
  start,
  end,
}: {
  start: Date
  end: Date
}) => {
  const {m} = useI18n()

  return useMemo(() => {
    return {
      _27_Has_your_house_apartment_been_: ChartTools.percentage({
        data: data.map(_ => _._27_Has_your_house_apartment_been_),
        value: _ => _ === 'yes39'
      }),

      _12_Do_you_identify_as_any_of: ChartTools.single({
        data: data.map(_ => _._12_Do_you_identify_as_any_of).compact(),
      }).sort((a, b) => b.value - a.value),
      
      _27_1_If_yes_what_is_level_of_the_damage: ChartTools.single({
        data: data.map(_ => _._27_1_If_yes_what_is_level_of_the_damage).compact(),
      }).sort((a, b) => {
        const obj = Enum.keys(PropertyDamage)
        return obj.indexOf(b.name) - obj.indexOf(a.name)
      }).map(_ => ({
        ..._,
        name: m.protectionHHSnapshot.propertyDamaged[_.name].title,
        desc: m.protectionHHSnapshot.propertyDamaged[_.name].desc,
      })),

      _12_8_1_What_would_be_the_deciding_fac: ChartTools.multiple({
        data: data.map(_ => _._12_8_1_What_would_be_the_deciding_fac).compact(),
      }).map(_ => ({..._, name: (m.factorsToReturn as any)[_.name]})),

      _12_7_1_planToReturn: (() => {
        return ChartTools.percentage({
          data: data.map(_ => _._12_7_1_Do_you_plan_to_return_to_your_),
          value: _ => _ === 'yes21' || _ === 'yes_but_no_clear_timeframe'
        })
      })(),
      // _12_7_1_planToReturn: (() => {
      //   const curve = ChartTools.indexByDate({
      //     data: data,
      //     getDate: _ => format(_.start, 'yyyy-MM'),
      //     percentageOf: _ => _._12_7_1_Do_you_plan_to_return_to_your_ === 'yes21'
      //   })
      //   return map(Object.values(curve), _ => (_[1]?.count ?? 0 - _[0]?.count ?? 0) * 100)!
      // })(),

      _12_3_1_dateDeparture: ChartTools.indexByDate({
        data: data
          .map(_ => _._12_3_1_When_did_you_your_area_of_origin)
          .compact()
          .filter(_ => _ > '2021-12' && _ < format(end, 'yyyy-dd'))
          .sort(),
        getDate: _ => _.replace(/-\d{2}$/, ''),
      }),

      oblastOrigins: data.map(_ => _['_12_1_What_oblast_are_you_from_001'])
        .map(_ => OblastIndex.findByKoboKey(_!)?.iso)
        .reduceObject<Record<string, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1]),

      oblastCurrent:
        data.map(_ => _['_4_What_oblast_are_you_from'])
          .map(_ => OblastIndex.findByKoboKey(_!)?.iso)
          .reduceObject<Record<string, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1]),

      totalMembers: data.sum(_ => _._8_What_is_your_household_size ?? 0),

      _8_individuals: (() => {
        const ageFields: [keyof Answer, keyof Answer][] = [
          ['_8_1_1_For_household_member_1_', '_8_1_2_For_household_member_1_'],
          ...mapFor(6, i => [`_8_2_1_For_household_${i + 2}_what_is_their_age`, `_8_2_2_For_household_${i + 2}_what_is_their_sex`
          ] as [keyof Answer, keyof Answer]),
        ]
        const persons: Person[] = data.flatMap((d) =>
          ageFields.map(([ageCol, sexCol]) => ({
            age: d[ageCol] as number | undefined,
            gender: d[sexCol] as Gender | undefined
          }))
        ).filter(x => x.gender !== undefined || x.age !== undefined)

        const byAgeGroup = Arr(persons).reduceObject<Record<keyof typeof KoboFormProtHH.ageGroup, number>>((p, acc) => {
          const group = Enum.keys(KoboFormProtHH.ageGroup).find(k => {
            const [min, max] = KoboFormProtHH.ageGroup[k]
            return p.age && p.age >= min && p.age <= max
          })
          if (group) return [group, (acc[group] ?? 0) + 1]
        })

        const byGender = Arr(persons).reduceObject<Record<Gender | 'undefined', number>>((p, acc) => {
          return [p.gender ?? 'undefined', (acc[p.gender!] ?? 0) + 1]
        })

        return {
          persons: persons,
          byAgeGroup: objToArray(byAgeGroup).sort((a, b) => KoboFormProtHH.ageGroup[a.name][0] - KoboFormProtHH.ageGroup[b.name][0]),
          byGender: byGender,
        }
      })()
    }
  }, [data])
}
