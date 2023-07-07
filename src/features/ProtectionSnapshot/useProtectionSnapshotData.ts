import {useMemo} from 'react'
import {ChartDataVal, ChartTools} from '../../core/chartTools'
import {format} from 'date-fns'
import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {useI18n} from '../../core/i18n'
import {KoboFormProtHH} from '../../core/koboModel/koboFormProtHH'
import {chain} from '../../utils/utils'
import {OblastISOSVG, ukraineSvgPath} from '../../shared/UkraineMap/ukraineSvgPath'
import {omit, pick} from 'lodash'
import {OblastISO} from '../../shared/UkraineMap/oblastIndex'
import {ageGroup} from '../../core/type'
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

    const categoryOblasts = (column: '_4_What_oblast_are_you_from_iso' | '_12_1_What_oblast_are_you_from_001_iso' = '_4_What_oblast_are_you_from_iso') => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, k) => ({...acc, [k]: (_: Answer): boolean => _[column] === k}),
        {} as Record<OblastISOSVG, (_: Answer) => boolean>
      )

    const categoryFilters = {
      notIdp: KoboFormProtHH.filterByNoIDP,
      idp: KoboFormProtHH.filterByIDP,
      hohh60: KoboFormProtHH.filterByHoHH60,
      hohhFemale: KoboFormProtHH.filterByHoHHFemale,
      memberWithDisability: KoboFormProtHH.filterWithDisability,
      all: (_: Answer) => true,
    }

    const initOblastIndex = <T>(initialValue: T): Record<OblastISOSVG, T> => {
      const oblastIndex: Record<OblastISOSVG, T> = {} as any
      Enum.keys(ukraineSvgPath).forEach(k => {
        oblastIndex[k] = initialValue
      })
      return oblastIndex
    }

    const totalMember = data.sum(_ => _._8_What_is_your_household_size ?? 1)
    const idps = data.filter(KoboFormProtHH.filterByIDP)
    const idpsCount = idps.length
    const noIdpsCount = data.count(KoboFormProtHH.filterByNoIDP)
    const flattedData = data.flatMap(_ => _.persons.map(p => ({...p, ..._})))
    return {
      totalMember,
      totalIdpsMember: idps.sum(_ => _._8_What_is_your_household_size ?? 1),
      idps,
      idpsCount,
      noIdpsCount,
      currentStatusAnswered: data.filter(_ => _._12_Do_you_identify_as_any_of !== undefined).length,

      _28_accessToHotByOblast: ChartTools.byCategory({
        categories: categoryOblasts(),
        data: data,
        filter: _ => !_._28_Do_you_have_acce_current_accomodation?.find(_ => _ === 'hot_water' || _ === 'heating_system'),
        filterBase: _ => _._28_Do_you_have_acce_current_accomodation !== undefined
      }),

      _28_planToReturnByOblast: ChartTools.byCategory({
        categories: categoryOblasts('_12_1_What_oblast_are_you_from_001_iso'),
        // data: data,
        data: data.filter(_ => _._12_Do_you_identify_as_any_of === 'idp'),
        filter: _ => _._12_7_1_Do_you_plan_to_return_to_your_ === 'yes' || _._12_7_1_Do_you_plan_to_return_to_your_ === 'yes_but_no_clear_timeframe',
        // filterBase: _ => _._28_Do_you_have_acce_current_accomodation !== undefined
      }),

      _28_accessToHotByOblastForIDPs: ChartTools.byCategory({
        categories: categoryOblasts(),
        // filterZeroCategory: true,
        data: data.filter(_ => _._12_Do_you_identify_as_any_of !== 'idp'),
        filter: _ => !_._28_Do_you_have_acce_current_accomodation?.find(_ => _ === 'hot_water' || _ === 'heating_system'),
        filterBase: _ => _._28_Do_you_have_acce_current_accomodation !== undefined
      }),

      _13_4_1_Are_you_separated_fromByOblast: ChartTools.byCategory({
        categories: categoryOblasts(),
        data: data,
        filter: _ => !!_._13_4_1_Are_you_separated_from_any_of_,
      }),

      numberByOfficeByDate: () => {
        const byDate = data.groupBy(_ => format(_.start, 'yyyy-MM'))
        const res = {} as any
        Enum.keys(byDate).forEach((k) => {
          res[k] = Enum.entries(byDate[k].groupBy(_ => _.B_Interviewer_to_in_ert_their_DRC_office)).reduce((acc, [k, v]) => ({
            ...acc,
            [k]: v.sum(_ => _._8_What_is_your_household_size ?? 0)
          }), {} as any)
          res[k] = {...res[k], total: byDate[k].sum(_ => _._8_What_is_your_household_size ?? 0)}
        })
      },

      categoriesTotal: ChartTools.byCategory({
        data: data,
        filter: _ => true,
        categories: categoryFilters,
      }),

      _33_incomeByIndividualsBelow3000: data
        .filter(_ => !!_._33_What_is_the_aver_income_per_household && _._33_What_is_the_aver_income_per_household !== 'more_than_11_000_uah')
        .map(d => {
          const maxIncome = fnSwitch(d._33_What_is_the_aver_income_per_household!, {
            up_to_1_500_uah: 3000,
            between_1_501__3_000_uah: 6000,
            between_3_001__5_000_uah: 9000,
            between_5_001__7_000_uah: 12000,
            between_7_001__11_000_uah: 15000,
          }, _ => {
            throw new Error(`Should not happend`)
          })
          return maxIncome / d.persons.length
        }).groupBy(_ => _ <= 3000) as {true: _Arr<number>, false: _Arr<number>},

      _33_incomeByIndividualsBelow3000Max: data
        .filter(_ => !!_._33_What_is_the_aver_income_per_household)
        .map(d => {
          const maxIncome = fnSwitch(d._33_What_is_the_aver_income_per_household!, {
            up_to_1_500_uah: 3000,
            between_1_501__3_000_uah: 3000,
            between_3_001__5_000_uah: 6000,
            between_5_001__7_000_uah: 9000,
            between_7_001__11_000_uah: 12000,
            more_than_11_000_uah: 15000,
          }, _ => {
            throw new Error(`Should not happend`)
          })
          return maxIncome / d.persons.length
        }).groupBy(_ => _ <= 3000) as {true: _Arr<number>, false: _Arr<number>},

      _18_1_2_What_are_the_factors_t: chain(ChartTools.multiple({
        data: data.map(_ => _._18_1_2_What_are_the_factors_t),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._18_1_2_What_are_the_factors_t))
        .map(ChartTools.sortBy.value)
        .get,

      _18_1_1_Please_rate_your_sense_of_safe_map: ChartTools.byCategory({
        data: data,
        categories: categoryOblasts(),
        filter: _ => _._18_1_1_Please_rate_your_sense_of_safe === '2__unsafe' || _._18_1_1_Please_rate_your_sense_of_safe === '1__very_unsafe'
      }),

      _12_5_1_shellingDuringDisplacementMap: ChartTools.byCategory({
        data: idps,
        categories: categoryOblasts('_12_1_What_oblast_are_you_from_001_iso'),
        filter: _ => !!_._12_5_1_During_your_displacement_journ?.includes('shelling_or_missile_attacks_an')
      }),

      _12_5_1_During_your_displacement_journPercent: ChartTools.percentage({
        data: data.map(_ => _._12_5_1_During_your_displacement_journ).compact(),
        value: _ => !_.includes('none215')
      }),

      _12_5_1_During_your_displacement_journ: chain(ChartTools.multiple({
        data: idps.map(_ => _._12_5_1_During_your_displacement_journ).compact().filter(_ => !_.includes('other_please_explain215') && !_.includes('none215')),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._12_5_1_During_your_displacement_journ))
        .map(ChartTools.sortBy.value)
        .get,

      _27_Has_your_house_apartmentByOblast: ChartTools.byCategory({
        data: data,
        categories: categoryOblasts('_12_1_What_oblast_are_you_from_001_iso'),
        filter: _ => !!_._27_Has_your_house_apartment_been_
      }),
      _27_1_If_yes_what_is_level_of_the_damageByOblast: ChartTools.byCategory({
        data: data,
        categories: categoryOblasts('_12_1_What_oblast_are_you_from_001_iso'),
        filter: _ => _._27_1_If_yes_what_is_level_of_the_damage === 'fully_damaged_needs_full_reconstruction'
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

      _14_1_1_idp_nomale_without_cert: ChartTools.percentage({
        data: data
          .filter(KoboFormProtHH.filterByIDP)
          .flatMap(_ => _.persons)
          .filter(_ => !(_.age && _.age >= 18 && _.age <= 60 && _.gender && _.gender === 'male'))
          .map(_ => _.statusDoc),
        value: hasntIdpCertificate,
      }),

      _14_1_1_idp_male_without_cert: ChartTools.percentage({
        data: data
          .filter(KoboFormProtHH.filterByIDP)
          .flatMap(_ => _.persons)
          .filter(_ => _.age && _.age >= 18 && _.age <= 60 && _.gender && _.gender === 'male')
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

      _13_4_1_Are_you_separated_from_any_of_percent: ChartTools.percentage({
        data: data.map(_ => _._13_4_1_Are_you_separated_from_any_of_),
        value: _ => !!_
      }),

      _39_What_type_of_information_wouldPercent: ChartTools.percentage({
        data: data.map(_ => _._39_What_type_of_information_would).compact(),
        value: _ => _.includes('legal_aid')
      }),

      _39_What_type_of_information_wouldbyCat: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, ['notIdp']),
        filter: _ => _._39_What_type_of_information_would !== undefined
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType as any))
        .val,

      _38_Have_you_recveived_informationbyCat: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, ['notIdp', 'all']),
        filter: row => {
          const neededInfo: any[] = row._39_What_type_of_information_would?.filter(_ => _ !== 'otheri').map(_ => _.replaceAll(/\d/g, '')) ?? []
          const receivedInfo: any[] = row._38_Have_you_recveived_information?.filter(_ => _ !== 'othere').map(_ => _.replaceAll(/\d/g, '')) ?? []
          return !!neededInfo.find(_ => receivedInfo.includes(_))
          // return true
          // return info
          // _._38_Have_you_recveived_information?.includes('none_of_the_abovee')
          // && _._39_What_type_of_information_would !== undefined,
        }
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType as any))
        .val,

      _39_What_type_of_information_would: chain(ChartTools.multiple({
        data: data.map(_ => _._39_What_type_of_information_would).compact(),
        filterValue: ['otheri']
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._39_What_type_of_information_would))
        .map(ChartTools.sortBy.value)
        // .map(x => Enum.entries(x).splice(0, 3).reduce((acc, [k, v]) => ({...acc, [k]: v}), {}))
        .val,

      _19_1_2_What_factors_are_influencing_t: chain(ChartTools.multiple({
        data: data.map(_ => _._19_1_2_What_factors_are_influencing_t).compact(),
        filterValue: ['other_please_specify28']
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._19_1_2_What_factors_are_influencing_t))
        .map(ChartTools.sortBy.value)
        .val,

      _14_1_1_What_type_of_ocuments_do_you_have: chain(ChartTools.multiple({
        data: data
          .flatMap(_ => _.persons)
          .map(_ => _.personalDoc)
          .map((_: any) => _ === 'national_passport_diia_app7' || _ === 'national_passport_book7' || _ === 'national_passport_card7' ? 'national_passport' : _)
          .compact(),
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

      _13_4_3_If_separated_from_a_household_: chain(ChartTools.single({
        data: data.map(_ => _._13_4_3_If_separated_from_a_household_).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._13_4_3_If_separated_from_a_household_))
        .map(ChartTools.sortBy.value)
        .val,

      _19_1_1_Please_rate_your_relationshipByOblast: ChartTools.byCategory({
        data: data,
        categories: categoryOblasts(),
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

      // Wrong way to count, use 26.4
      // _15_1_1_What_housing_land_and: ChartTools.percentage({
      //   data: data.filter(_ => {
      //     const hasHouse: KoboFormProtHH.GetType<'_26_1_1_Where_do_you_live_now'>[] = [
      //       'owned_apartment_or_house',
      //       'rented_house_or_apartment__wit',
      //       'modular_houses',
      //       'rented_accomodation__cash_for_',
      //     ]
      //     return _._26_1_1_Where_do_you_live_now?.find(_ => hasHouse.includes(_)) && _._15_1_1_What_housing_land_and !== undefined
      //   }),
      //   value: _ => isEqual(_._15_1_1_What_housing_land_and ?? [], ['none_of_the_above24'])
      // }),

      disabilityWithoutAllowance: ChartTools.percentage({
        data: data.filter(_ => _._16_2_1_Do_you_have_a_household_member?.filter(_ => _ !== 'no').length ?? -1 > 0),
        value: _ => _._17_1_1_Does_any_of_them_recieve_state !== true && !_._17_1_2_If_not_why?.includes('registered_for_assistance_but_'),
      }),

      _26_4_noHouseFormalDocPercent: ChartTools.percentage({
        data: data.filter(_ => {
          const hasHouse: KoboFormProtHH.GetType<'_26_1_1_Where_do_you_live_now'>[] = [
            'rented_house_or_apartment__wit',
            'modular_houses',
            'temporary_shelter',
            'public_or_communal_building__e',
            'rented_accomodation__cash_for_',
          ]
          return _._26_1_1_Where_do_you_live_now?.find(_ => hasHouse.includes(_)) && _._26_4_Do_you_have_fo_in_your_accomodation !== undefined
        }),
        value: _ => !!_._26_4_Do_you_have_fo_in_your_accomodation && (_._26_4_Do_you_have_fo_in_your_accomodation === 'no_formal_documents' || _._26_4_Do_you_have_fo_in_your_accomodation === 'verbal_agreement')
      }),

      _26_4_Do_you_have_fo_in_your_accomodation: chain(ChartTools.single({
        data: data.map(_ => _._26_4_Do_you_have_fo_in_your_accomodation).compact(),
      }))
        .map(ChartTools.setLabel(m.protHHSnapshot.enum._26_4_Do_you_have_fo_in_your_accomodation))
        .map(ChartTools.sortBy.value)
        .val,

      B_Interviewer_to_in_ert_their_DRC_office: chain(ChartTools.single({
        data: data.map(_ => _.B_Interviewer_to_in_ert_their_DRC_office).compact(),
      }))
        .map(ChartTools.sortBy.value)
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

      _31_Is_anyone_from_the_household_percent: ChartTools.byCategory({
        categories: pick(categoryFilters, ['hohhFemale', 'idp', 'notIdp', 'all']),
        data,
        filter: _ => _._31_Is_anyone_from_the_household_ === true,
      }),

      _32_1_What_type_of_allowances_byElderly: ChartTools.percentage({
        data: data.filter(_ => !!_.persons.find(_ => _.age && _.age >= 60)),
        value: _ => !!_._32_1_What_type_of_allowances_do_you?.includes('pension'),
      }),

      _32_1_What_type_of_allowances_byChildrens: ChartTools.percentage({
        data: data.filter(_ => _.persons.filter(_ => _.age && _.age < 18).length >= 3),
        value: _ => !!_._32_1_What_type_of_allowances_do_you?.includes('pension_for_three_or_more_chil'),
      }),

      _32_1_What_type_of_allowances_byIdp: ChartTools.percentage({
        data: data.filter(_ => _._12_Do_you_identify_as_any_of === 'idp'),
        value: _ => !!_._32_1_What_type_of_allowances_do_you?.includes('idp_allowance_from_the_governm'),
      }),

      _32_dependingOnAllowancePercent: ChartTools.byCategory({
        data,
        categories: pick(categoryFilters, ['idp', 'all', 'notIdp']),
        filter: (_: Answer) => {
          return (!!_._32_What_is_the_main_source_of_inc?.includes('allowance__state')
              || !!_._32_What_is_the_main_source_of_inc?.includes('humanitarian_assistance'))
            && !_._32_What_is_the_main_source_of_inc?.includes('employment')
            && !_._32_What_is_the_main_source_of_inc?.includes('other43')
        }
      }),

      _32_dependingOnAllowance: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, 'notIdp'),
        filter: _ => (!!_._32_What_is_the_main_source_of_inc?.includes('allowance__state')
            || !!_._32_What_is_the_main_source_of_inc?.includes('humanitarian_assistance'))
          && !_._32_What_is_the_main_source_of_inc?.includes('employment')
          && !_._32_What_is_the_main_source_of_inc?.includes('other43'),
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _33_incomeByCategory: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, 'notIdp'),
        filter: _ => _._33_What_is_the_aver_income_per_household !== undefined && (_._33_What_is_the_aver_income_per_household === 'up_to_1_500_uah' || _._33_What_is_the_aver_income_per_household === 'between_1_501__3_000_uah'),
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _29_nfiNeededByCategory: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, ['notIdp']),
        filter: _ => _._29_Which_NFI_do_you_need !== undefined && !_._29_Which_NFI_do_you_need.includes('do_not_require41')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType as any))
        .val,

      _40_1_pn_cash_byCategory: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, ['all', 'notIdp']),
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes('cash')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType as any))
        .val,

      _40_1_pn_shelter_byCategory: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, 'notIdp'),
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes('shelter')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_pn_health_byCategory: chain(ChartTools.byCategory({
        data,
        categories: omit(categoryFilters, 'notIdp'),
        filter: _ => !!_._40_1_What_is_your_first_priorty?.includes('health')
      }))
        .map(ChartTools.sortBy.percent)
        .map(ChartTools.setLabel(m.hhCategoryType))
        .val,

      _40_1_first_priortyBy: (() => {
        const compute = (filter: (_: Answer) => boolean) => chain(ChartTools.single({
          data: data.filter(filter).map(_ => _._40_1_What_is_your_first_priorty).compact(),
        }))
          .map(ChartTools.sortBy.value)
          .map(ChartTools.take(3))
          .map(ChartTools.setLabel(m.protHHSnapshot.enum.priorityNeeds))
          .val
        return {
          idp: compute(categoryFilters.idp),
          hohh60: compute(categoryFilters.hohh60),
          hohhFemale: compute(categoryFilters.hohhFemale),
          memberWithDisability: compute(categoryFilters.memberWithDisability),
        }
      })(),

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
        data: data.filter(_ => _._12_Do_you_identify_as_any_of === 'idp').map(_ => _._12_7_1_Do_you_plan_to_return_to_your_),
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

      ...(() => {
        const idpsWithoutCertByOblast = (sex: 'male' | 'female') => ChartTools.sumByCategory({
          data: data.filter(_ => _._12_Do_you_identify_as_any_of === 'idp'),
          categories: categoryOblasts(),
          filter: _ => _.persons.filter(_ => _.gender === sex && _.age && _.age >= 18 && _.age <= 60 && hasntIdpCertificate(_.statusDoc)).length,
          sumBase: _ => _.persons.filter(_ => _.gender === sex && _.age && _.age >= 18 && _.age <= 60).length,
        })
        return {
          idpsWithoutCertByOblast: idpsWithoutCertByOblast('male'),
          femaleIdpsWithoutCertByOblast: idpsWithoutCertByOblast('female'),
        }
      })(),

      oblastOrigins: idps
        // .filter(_ => _._4_What_oblast_are_you_from === 'dnip')
        .reduceObject<Record<OblastISO, ChartDataVal>>((_, acc) => {
          const oblast = _._12_1_What_oblast_are_you_from_001_iso
          const peoples = _._8_What_is_your_household_size ?? 1
          if (oblast)
            return [oblast, {value: (acc[oblast]?.value ?? 0) + peoples}]
        }),

      oblastCurrent: ChartTools.byCategory({
        data: flattedData,
        categories: categoryOblasts(),
        filter: _ => _._12_Do_you_identify_as_any_of === 'idp',
      }),

      // oblastCurrent: idps
      //   .reduceObject<Record<OblastISO, ChartDataVal>>((_, acc) => {
      //     const oblast = _._4_What_oblast_are_you_from_iso
      //     const peoples = _._8_What_is_your_household_size ?? 1
      //     if (oblast)
      //       return [oblast, {value: (acc[oblast]?.value ?? 0) + peoples}]
      //   }),

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
        const byAgeGroup = Arr(persons).reduceObject<Record<keyof typeof ageGroup.bha, {value: number}>>((p, acc) => {
          const group = Enum.keys(ageGroup.bha).find(k => {
            const [min, max] = ageGroup.bha[k]
            return p.age && p.age >= min && p.age <= max
          })
          if (group) return [group, {value: (acc[group]?.value ?? 0) + 1}]
        })

        const byGender = Arr(persons).reduceObject<Record<Gender | 'undefined', number>>((p, acc) => {
          return [p.gender ?? 'undefined', (acc[p.gender!] ?? 0) + 1]
        })

        return {
          persons: persons,
          byAgeGroup: sortBy.custom(Object.keys(ageGroup))(byAgeGroup),
          byGender: byGender,
        }
      })()
    }
  }, [data])
}
