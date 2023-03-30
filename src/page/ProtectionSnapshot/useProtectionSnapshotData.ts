import {useMemo} from 'react'
import {ChartDataVal, ChartTools} from '../../core/chartTools'
import {format} from 'date-fns'
import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {useI18n} from '../../core/i18n'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {chain} from '../../utils/utils'
import {OblastISO, ukraineSvgPath} from '../../shared/UkraineMap/ukraineSvgPath'
import Answer = KoboFormProtHH.Answer
import Gender = KoboFormProtHH.Gender
import sortBy = ChartTools.sortBy

const hasntIdpCertificate = (_: (KoboFormProtHH.GetType<'_14_2_1_Do_you_or_your_househo'>)[] | undefined) => {
  return !_ || (!_.includes('idp_certificate') && !_.includes('idp_e_registration'))
}

export type UseProtectionSnapshotData = ReturnType<typeof useProtectionSnapshotData>
export const useProtectionSnapshotData = (data: _Arr<Answer>, {
  start,
  end,
}: {
  start: Date
  end: Date
}) => {

  const {m} = useI18n()
  // TODO Relation IDP host community entre west and ouest


  // TODO Durable solution - factors to return, checker by area: nord/sud/east GCA/east NGCA (Gov contorl area)

  return useMemo(() => {
    const categoryCurrentOblasts = Enum.keys(ukraineSvgPath).reduce(
      (acc, k) => ({...acc, [k]: (_: Answer): boolean => _._4_What_oblast_are_you_from_iso === k}),
      {} as Record<OblastISO, (_: Answer) => boolean>
    )

    const categoryFilters = {
      idp: KoboFormProtHH.filterByIDP,
      hohh60: KoboFormProtHH.filterByHoHH60,
      hohhFemale: KoboFormProtHH.filterByHoHHFemale,
      memberWithDisability: KoboFormProtHH.filterWithDisability,
      // all: _ => true,
    }

    const initOblastIndex = <T>(initialValue: T): Record<OblastISO, T> => {
      const oblastIndex: Record<OblastISO, T> = {} as any
      Enum.keys(ukraineSvgPath).forEach(k => {
        oblastIndex[k] = initialValue
      })
      return oblastIndex
    }

    return {

      _18_1_2_What_are_the_factors_t: chain(ChartTools.multiple({
        data: data.map(_ => _._18_1_2_What_are_the_factors_t),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._18_1_2_What_are_the_factors_t))
        .map(ChartTools.sortBy.value)
        .get,

      _18_1_1_Please_rate_your_sense_of_safe_map: ChartTools.byCategory({
        data: data,
        categories: categoryCurrentOblasts,
        filter: _ => _._18_1_1_Please_rate_your_sense_of_safe === '2__unsafe' || _._18_1_1_Please_rate_your_sense_of_safe === '1__very_unsafe'
      }),

      dnipPssRomane: ChartTools.percentage({
        data: data.filter(_ => _._12_1_What_oblast_are_you_from_001 === 'dnip').map(_ => _._24_2_Have_you_observed_pers),
        value: _ => _ === true
      }),
      zapPssRomane: ChartTools.percentage({
        data: data.filter(_ => _._12_1_What_oblast_are_you_from_001 === 'zap').map(_ => _._24_2_Have_you_observed_pers),
        value: _ => _ === true
      }),

      khaPssRomane: ChartTools.percentage({
        data: data.filter(_ => _._12_1_What_oblast_are_you_from_001 === 'kha').map(_ => _._24_2_Have_you_observed_pers),
        value: _ => _ === true
      }),

      _14_1_1_idp_female_without_cert: ChartTools.percentage({
        data: data
          .filter(KoboFormProtHH.filterByIDP)
          .flatMap(_ => _.persons)
          .filter(_ => _.age && _.age >= 18 && _.gender && _.gender === 'female')
          .map(_ => _.statusDoc),
        value: hasntIdpCertificate,
      }),

      _14_1_1_idp_male_without_cert: ChartTools.percentage({
        data: data
          .filter(KoboFormProtHH.filterByIDP)
          .flatMap(_ => _.persons)
          .filter(_ => _.age && _.age >= 18 && _.gender && _.gender === 'male')
          .map(_ => _.statusDoc),
        value: hasntIdpCertificate,
      }),

      _14_1_1_elderly_without_cert: ChartTools.percentage({
        data: data.flatMap(_ => _.persons).filter(_ => _.age && _.age > 60).map(_ => _.personalDoc),
        value: _ => !_ || !_.includes('pensioner_certificate_ret5irement'),
      }),

      _14_1_1_children_without_cert: ChartTools.percentage({
        data: data.flatMap(_ => _.persons).filter(_ => _.age && _.age < 18).map(_ => _.personalDoc),
        value: _ => !_ || !_.includes('birth_certificate7'),
      }),

      _14_1_1_What_type_of_ocuments_do_you_have: chain(ChartTools.multiple({
        data: data.flatMap(_ => _.persons).map(_ => _.personalDoc).compact(),
        map: _ => _ === 'national_passport_diia_app7' || _ === 'national_passport_book7' || _ === 'national_passport_card7' ? 'national_passport' : _
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._14_1_1_What_type_of_ocuments_do_you_have))
        .map(ChartTools.sortBy.value)
        .val,

      _16_1_2_What_are_the_barriers_: chain(ChartTools.multiple({
        data: data.map(_ => _._16_1_2_What_are_the_barriers_).compact(),
        filterValue: ['other25']
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.barriersToPersonalDocuments))
        .map(ChartTools.sortBy.value)
        .val,

      _16_1_1_Have_you_experienced_a: ChartTools.percentage({
        data: data.map(_ => _._16_1_1_Have_you_experienced_a),
        value: _ => _ === true,
      }),

      _11_What_is_your_citizenship: ChartTools.percentage({
        data: data.map(_ => _._11_What_is_your_citizenship),
        value: _ => _ === 'ukrainian',
      }),

      _19_1_1_Please_rate_your_relationshipByOblast: ChartTools.byCategory({
        data: data,
        categories: categoryCurrentOblasts,
        filter: _ => _._19_1_1_Please_rate_your_relationship_ === '1__very_bad'
          || _._19_1_1_Please_rate_your_relationship_ === '2__bad'
          // || _._19_1_1_Please_rate_your_relationship_ === '3__acceptable'
      }),

      _19_1_1_Please_rate_your_relationship_: chain(ChartTools.single({
        data: data
          .filter(_ => _._12_Do_you_identify_as_any_of === 'idp')
          .map(_ => _._19_1_1_Please_rate_your_relationship_)
          .compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._19_1_1_Please_rate_your_relationship_))
        .map(x => {
          console.log('???', x)
          return x
        })
        .map(ChartTools.sortBy.custom([
          '1__very_bad',
          '2__bad',
          '3__acceptable',
          '4__good',
          '5__very_good',
        ]))
        .val,

      _18_1_1_Please_rate_your_sense_of_safe: chain(ChartTools.single({
        data: data.map(_ => _._18_1_1_Please_rate_your_sense_of_safe).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._18_1_1_Please_rate_your_sense_of_safe))
        .map(ChartTools.sortBy.custom([
          '1__very_unsafe',
          '2__unsafe',
          '3__acceptable',
          '4__safe',
          '5__very_safe',
        ]))
        .val,

      _33_What_is_the_aver_income_per_household: chain(ChartTools.single({
        data: data.map(_ => _._33_What_is_the_aver_income_per_household).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.monthlyIncomes))
        .map(ChartTools.sortBy.custom([
          'up_to_1_500_uah',
          'between_1_501__3_000_uah',
          'between_3_001__5_000_uah',
          'between_5_001__7_000_uah',
          'between_7_001__11_000_uah',
          'more_than_11_000_uah',
        ]))
        .val,

      _32_What_is_the_main_source_of_inc: chain(ChartTools.multiple({
        data: data.map(_ => _._32_What_is_the_main_source_of_inc).compact(),
        filterValue: ['other43']
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.incomeSource))
        .map(ChartTools.sortBy.value)
        .val,

      _31_2_What_type_of_work: chain(ChartTools.multiple({
        data: data.map(_ => _._31_2_What_type_of_work).compact(),
        filterValue: ['other43', 'casual_daily_work'],
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.employmentTypes))
        .map(ChartTools.sortBy.value)
        .val,

      _29_nfiNeededByOblast: chain(
        ChartTools.groupBy({
          data,
          groupBy: _ => _._4_What_oblast_are_you_from_iso,
          filterBase: _ => true,
          filter: _ => _._29_Which_NFI_do_you_need !== undefined && !_._29_Which_NFI_do_you_need.includes('do_not_require41')
        })).val,

      _40_1_firstPriorityByOblast: chain(
        ChartTools.groupBy({
          data,
          groupBy: _ => _._4_What_oblast_are_you_from_iso,
          filterBase: _ => true,
          filter: _ => _._40_1_What_is_your_first_priorty !== undefined && _._40_1_What_is_your_first_priorty.includes(KoboFormProtHH.PriorityNeed.cash)
        })).val,

      _31_Is_anyone_from_the_household_percent: ChartTools.percentage({
        data: data.map(_ => _._31_Is_anyone_from_the_household_),
        value: _ => _ === true,
      }),

      _33_incomeByCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => _._33_What_is_the_aver_income_per_household !== undefined && (_._33_What_is_the_aver_income_per_household === 'up_to_1_500_uah' || _._33_What_is_the_aver_income_per_household === 'between_1_501__3_000_uah'),
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _29_nfiNeededByCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => _._29_Which_NFI_do_you_need !== undefined && !_._29_Which_NFI_do_you_need.includes('do_not_require41')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_cash_byCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes('cash')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_shelter_byCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes('shelter')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_health_byCategory: chain(ChartTools.byCategory({
        data,
        categories: categoryFilters,
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes('health')
      }))
        .map(x => x)
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_What_is_your_first_priorty: chain(ChartTools.single({
        data: data.map(_ => _._40_1_What_is_your_first_priorty).compact(),
      }))
        .map(ChartTools.sortBy.value)
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.priorityNeeds))
        .val,

      _27_Has_your_house_apartment_been_: ChartTools.percentage({
        data: data.map(_ => _._27_Has_your_house_apartment_been_),
        value: _ => _ === true
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
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.priorityNeeds))
        .val,

      _27_1_If_yes_what_is_level_of_the_damage: chain(ChartTools.single({
        data: data.filter(_ => _._27_Has_your_house_apartment_been_).map(_ => _._27_1_If_yes_what_is_level_of_the_damage).compact(),
      }))
        .map(sortBy.custom([
          'fully_damaged_needs_full_reconstruction',
          'partially_damaged__considerable_repair_i',
          'partially_damage',
          'light_damage',
        ]))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.propertyDamageTitle))
        .map(ChartTools.setDesc(m.protHHSnapshot.enum.propertyDamageDesc))
        .val,

      C_Vulnerability_catergories_that: chain(ChartTools.multiple({
        data: data.map(_ => _.C_Vulnerability_catergories_that).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.vulnerability))
        .val,

      _28_Do_you_have_acce_current_accomodation: chain(ChartTools.multiple({
        data: data.map(_ => _._28_Do_you_have_acce_current_accomodation).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.basicNeeds))
        .val,

      _12_8_1_What_would_be_the_deciding_fac: chain(ChartTools.multiple({
        data: data.map(_ => _._12_8_1_What_would_be_the_deciding_fac).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum.factorsToReturn))
        .map(ChartTools.sortBy.value)
        .val,

      _12_7_1_planToReturn: ChartTools.percentage({
        data: data.map(_ => _._12_7_1_Do_you_plan_to_return_to_your_),
        value: _ => _ === 'yes' || _ === 'yes_but_no_clear_timeframe'
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

      // idpsWithoutCertByOblast: data
      //   .filter(_ => _._12_Do_you_identify_as_any_of === 'idp')
      //   .map(_ => _.persons.filter(_ => _.age && _.gender && _.age >= 18 && _.gender === 'male'))
      //   .map(_ => _._4_What_oblast_are_you_from_iso),

      idpsWithoutCertByOblast: chain(
        data.reduce((acc, row) => {
          if (row._12_Do_you_identify_as_any_of !== 'idp') return acc
          const k = row._4_What_oblast_are_you_from_iso
          if (!k) return acc
          const adults = row.persons.filter(_ => _.gender === 'male' && _.age && _.age >= 18)
          const adultsWithCert = adults.map(_ => _.statusDoc).filter(hasntIdpCertificate)
          return {
            ...acc, [k]: {
              value: acc[k].value + adultsWithCert.length,
              base: acc[k].base + adults.length,
            }
          }
        }, initOblastIndex({value: 0, base: 0}))
      ).get,

      femaleIdpsWithoutCertByOblast: chain(
        data.reduce((acc, row) => {
          if (row._12_Do_you_identify_as_any_of !== 'idp') return acc
          const k = row._4_What_oblast_are_you_from_iso
          if (!k) return acc
          const adults = row.persons.filter(_ => _.gender === 'female' && _.age && _.age >= 18)
          const adultsWithCert = adults.map(_ => _.statusDoc).filter(hasntIdpCertificate)
          return {
            ...acc, [k]: {
              value: acc[k].value + adultsWithCert.length,
              base: acc[k].base + adults.length,
            }
          }
        }, initOblastIndex({value: 0, base: 0}))
      ).get,


      oblastOrigins: data
        .map(_ => _._12_1_What_oblast_are_you_from_001_iso)
        .compact()
        .reduceObject<Record<OblastISO, ChartDataVal>>((_, acc) => [_, {value: (acc[_]?.value ?? 0) + 1}]),

      oblastCurrent: data
        .map(_ => _._4_What_oblast_are_you_from_iso)
        .compact()
        .reduceObject<Record<OblastISO, ChartDataVal>>((_, acc) => [_, {value: (acc[_]?.value ?? 0) + 1}]),

      totalMembers: data.sum(_ => _._8_What_is_your_household_size ?? 0),

      _8_What_is_your_household_sizeByIncome: ChartTools.sumByCategory({
        data,
        categories: {
          up_to_1_500_uah: _ => _._33_What_is_the_aver_income_per_household === 'up_to_1_500_uah',
          between_1_501__3_000_uah: _ => _._33_What_is_the_aver_income_per_household === 'between_1_501__3_000_uah',
          between_3_001__5_000_uah: _ => _._33_What_is_the_aver_income_per_household === 'between_3_001__5_000_uah',
          between_5_001__7_000_uah: _ => _._33_What_is_the_aver_income_per_household === 'between_5_001__7_000_uah',
          between_7_001__11_000_uah: _ => _._33_What_is_the_aver_income_per_household === 'between_7_001__11_000_uah',
          more_than_11_000_uah: _ => _._33_What_is_the_aver_income_per_household === 'more_than_11_000_uah',
        },
        filter: _ => _._8_What_is_your_household_size ?? 0,
      }),

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
          byAgeGroup: sortBy.custom(Object.keys(KoboFormProtHH.ageGroup))(byAgeGroup),
          byGender: byGender,
        }
      })()
    }
  }, [data])
}
