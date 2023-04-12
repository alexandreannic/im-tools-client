import {KoboAnswer, KoboAnswerMetaData} from '../sdk/server/kobo/Kobo'
import {Arr, Enum, fnSwitch, map, mapFor} from '@alexandreannic/ts-utils'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {OblastISO} from '../../shared/UkraineMap/ukraineSvgPath'
import {Messages} from '../i18n/localization/en'

export namespace KoboFormProtHH {

  export const elderlyLimitIncluded = 60
  export const isElderly = (age: number) => age >= elderlyLimitIncluded

  export const ageGroupBHA = Object.freeze({
    '0 - 4': [0, 4],
    '5 - 9': [5, 9],
    '10 - 14': [10, 14],
    '15 - 18': [15, 18],
    '19 - 29': [19, 29],
    '30 - 59': [30, 59],
    '60+': [elderlyLimitIncluded, Infinity],
  })
  export const ageGroup = Object.freeze({
    '0 - 4': [0, 4],
    '5 - 11': [5, 11],
    '12 - 17': [12, 17],
    '18 - 24': [18, 24],
    '25 - 49': [25, 49],
    '50 - 59': [50, 59],
    '60+': [elderlyLimitIncluded, Infinity],
  })

  export const groupByAgeGroup = <T extends {age?: number}>(p: T): keyof typeof ageGroupBHA | undefined => {
    for (const [k, [min, max]] of Enum.entries(ageGroupBHA)) {
      if (p.age && p.age >= min && p.age <= max) return k
    }
  }

  enum KoboGender {
    female = 'female',
    male = 'male',
    prefer_not_to_answer = 'prefer_not_to_answer',
    don_t_know = 'don_t_know',
  }

  export enum Gender {
    female = 'female',
    male = 'male',
  }

  export interface Person<G = Gender> {
    age?: number
    gender?: G
  }
  
  export enum PriorityNeed {
    health = 'health',
    shelter = 'shelter',
    food = 'food',
    livelihoods = 'livelihoods',
    other = 'other',
    winter_items = 'winter_items',
    cash = 'cash',
    civil_documentation = 'civil_documentation',
    university_or_teritary_eduction = 'university_or_teritary_eduction',
    education_for_children = 'education_for_children',
    nfis = 'nfis',
    wash = 'wash',
  }

  export enum Status {
    conflict_affected_person = 'conflict_affected_person',
    idp = 'idp',
    host_community_member = 'host_community_member',
    idp_returnee = 'idp_returnee',
  }

  export type Answer = ReturnType<typeof mapAnswers>

  const mapGender = (g?: any): Gender | undefined => {
    if (g && g !== 'prefer_not_to_answer' && g !== 'don_t_know') return Gender[g as Gender]
  }

  const mapPerson = (a: KoboAnswer) => {
    const fields: [string, string, string, string][] = [
      [
        '_8_1_1_For_household_member_1_',
        '_8_1_2_For_household_member_1_',
        '14.1.1. What type of personal identity documents do you have?',
        '_14_2_1_Do_you_or_your_househo',
      ],
      ...mapFor(6, i => [
        `_8_${i + 2}_1_For_household_${i + 2}_what_is_their_age`,
        `_8_${i + 2}_2_For_household_${i + 2}_what_is_their_sex`,
        `_14_1_${i + 2}_What_type_of_sehold_member_${i + 2}_have`,
        `_14_2_${i + 2}_Do_you_or_your_househo_00${i + 1}`,
      ] as [string, string, string, string]),
    ]
    return Arr(fields)
      .map(([ageCol, sexCol, personalDoc, statusDoc]) => {
        return ({
          age: isNaN(a[ageCol]) ? undefined : a[ageCol],
          gender: mapGender(a[sexCol]),
          personalDoc: a[personalDoc]?.split(' ') as GetType<'_14_1_1_What_type_of_ocuments_do_you_have'>[] | undefined,
          statusDoc: a[statusDoc]?.split(' ') as GetType<'_14_2_1_Do_you_or_your_househo'>[] | undefined
        })
      })
      .filter(x => x.gender !== undefined || x.age !== undefined || x.personalDoc !== undefined)
  }

  export const filterByHoHH60 = (row: Answer): boolean => {
    return row.persons[0]?.age !== undefined && isElderly(row.persons[0].age)
  }

  export const filterByHoHHFemale = (row: Answer): boolean => {
    return row.persons[0]?.gender !== undefined && row.persons[0].gender === 'female'
  }

  export const filterWithDisability = (row: Answer): boolean => {
    return !!row.C_Vulnerability_catergories_that?.includes('person_with_a_disability')
  }

  export const filterByIDP = (row: Answer): boolean => {
    return row._12_Do_you_identify_as_any_of === Status.idp
  }

  export const filterByNoIDP = (row: Answer): boolean => {
    return row._12_Do_you_identify_as_any_of !== Status.idp
  }

  // const Dico = {
  //   multiple: <T>(): T[] | undefined => {
  //
  //   }
  // }
  //
  // const dictionnaire = {
  //   _29_Which_NFI_do_you_need: Dico.multiple<'infant_clothing' | 'hygiene_items' | 'do_not_require41' | 'other_household_items' | 'blankets' | 'towels_bed_linen' | 'winter_clothes' | 'kitchen_items' | 'clothes_and_shoes'>()
  // }

  export type GetType<T extends keyof Messages['protHHSnapshot']['enum']> = keyof Messages['protHHSnapshot']['enum'][T]

  const raionsCols = [
    '_4_1_What_raion_in_Ch_currently_living_in',
    '_4_2_What_raion_in_Ch_currently_living_in',
    '_4_3_What_raion_in_Ch_currently_living_in',
    '_4_4_What_raion_in_Av_currently_living_in',
    '_4_5_What_raion_in_Vo_currently_living_in',
    '_4_6_What_raion_in_Dn_currently_living_in',
    '_4_7_What_raion_in_Do_currently_living_in',
    '_4_8_What_raion_in_Vi_currently_living_in',
    '_4_9_What_raion_in_Se_currently_living_in',
    '_4_10_What_raion_in_Z_currently_living_in',
    '_4_11_What_raion_in_Z_currently_living_in',
    '_4_12_What_raion_in_Z_currently_living_in',
    '_4_13_What_raion_in_A_currenrtly_living_in',
    '_4_14_What_raion_in_I_currently_living_in',
    '_4_15_What_raion_in_K_currently_living_in',
    '_4_16_What_raion_in_K_currently_living_in',
    '_4_17_What_raion_in_K_currently_living_in',
    '_4_18_What_raion_in_K_hradska_are_you_from',
    '_4_19_What_raion_in_K_currently_living_in',
    '_4_20_What_raion_in_L_currently_living_in',
    '_4_21_What_raion_in_L_currently_living_in',
    '_4_22_What_raion_in_M_currently_living_in',
    '_4_23_What_raion_in_O_currently_living_in',
    '_4_24_What_raion_in_P_currently_living_in',
    '_4_25_What_raion_in_R_currently_living_in',
    '_4_26_What_raion_in_S_currently_living_in',
    '_4_27_What_raion_in_T_currently_living_in',
  ]
  export const mapAnswers = (a: KoboAnswerMetaData & Record<string, string | undefined>) => {
    return {
      ...a,
      _29_Which_NFI_do_you_need: a._29_Which_NFI_do_you_need?.split(' ') as GetType<'nfi'>[] | undefined,
      _28_Do_you_have_acce_current_accomodation: a._28_Do_you_have_acce_current_accomodation?.split(' ') as GetType<'basicNeeds'>[] | undefined,
      _25_1_1_During_the_last_30_day: a._25_1_1_During_the_last_30_day?.split(' ') as GetType<'copingMechanisms'>[] | undefined,
      C_Vulnerability_catergories_that: a.C_Vulnerability_catergories_that?.split(' ') as GetType<'vulnerability'>[] | undefined,
      _12_Do_you_identify_as_any_of: a._12_Do_you_identify_as_any_of as Status | undefined,
      _38_Have_you_recveived_information: a._38_Have_you_recveived_information?.split(' ') as GetType<'_38_Have_you_recveived_information'>[] | undefined,
      _39_What_type_of_information_would: a._39_What_type_of_information_would?.split(' ') as GetType<'_39_What_type_of_information_would'>[] | undefined,
      _40_1_What_is_your_first_priorty: a['_40_What_are_your_priority_needs/_40_1_What_is_your_first_priorty'] as GetType<'priorityNeeds'> | undefined,
      _40_2_What_is_your_second_priority: a['_40_What_are_your_priority_needs/_40_2_What_is_your_second_priority'] as GetType<'priorityNeeds'> | undefined,
      _40_3_What_is_your_third_priority: a['_40_What_are_your_priority_needs/_40_3_What_is_your_third_priority'] as GetType<'priorityNeeds'> | undefined,
      _27_1_If_yes_what_is_level_of_the_damage: a._27_1_If_yes_what_is_level_of_the_damage as GetType<'propertyDamageTitle'> | undefined,
      _27_Has_your_house_apartment_been_: fnSwitch(a._27_Has_your_house_apartment_been_!, {
        'yes39': true,
        'no39': false,
      }, () => undefined),
      B_Interviewer_to_in_ert_their_DRC_office: a.B_Interviewer_to_in_ert_their_DRC_office,
      _8_What_is_your_household_size: map(a._8_What_is_your_household_size, _ => +_),
      _4_What_oblast_are_you_from: a._4_What_oblast_are_you_from as GetType<'oblast'> | undefined,
      _4_What_oblast_are_you_from_iso: OblastIndex.findByKoboKey(a._4_What_oblast_are_you_from!)?.iso as OblastISO | undefined,
      _12_1_What_oblast_are_you_from_001: a._12_1_What_oblast_are_you_from_001 as undefined | GetType<'oblast'>,
      _12_1_What_oblast_are_you_from_001_iso: OblastIndex.findByKoboKey(a._12_1_What_oblast_are_you_from_001!)?.iso as OblastISO | undefined,
      _12_8_1_What_would_be_the_deciding_fac: (a._12_8_1_What_would_be_the_deciding_fac?.split(' ').map(_ => fnSwitch(_, {
        cessation_of_hostilities: 'improvement_in_security_situat',
        government_regains_territory_f: 'improvement_in_security_situat',
      }, _ => _)) as GetType<'factorsToReturn'>[] | undefined),
      _12_7_1_Do_you_plan_to_return_to_your_: fnSwitch(a._12_7_1_Do_you_plan_to_return_to_your_!, {
        'yes21': 'yes',
        'don_t21': 'no',
        'yes_but_no_clear_timeframe': 'yes_but_no_clear_timeframe',
      }, () => undefined) as undefined | GetType<'_12_7_1_Do_you_plan_to_return_to_your_'>,
      _12_3_1_When_did_you_your_area_of_origin: a._12_3_1_When_did_you_your_area_of_origin,
      persons: mapPerson(a),
      _33_What_is_the_aver_income_per_household: a._33_What_is_the_aver_income_per_household as GetType<'monthlyIncomes'> | undefined,
      _32_What_is_the_main_source_of_inc: a._32_What_is_the_main_source_of_inc?.split(' ') as GetType<'incomeSource'>[] | undefined,
      _31_2_What_type_of_work: a._31_2_What_type_of_work?.split(' ') as GetType<'employmentTypes'>[] | undefined,
      _31_Is_anyone_from_the_household_: fnSwitch(a._31_Is_anyone_from_the_household_ as any, {
        'yes43': true,
        'no43': false,
        'don_t_know43': undefined,
        'prefer_not_to_answer4': undefined,
      }, () => undefined),
      _13_4_1_Are_you_separated_from_any_of_: fnSwitch(a._13_4_1_Are_you_separated_from_any_of_ as any, {
        'yes22': true,
        'no22': false,
        'prefer_not_to_answer22': undefined,
        'don_t_know22': false,
      }, () => undefined),
      _11_What_is_your_citizenship: a._11_What_is_your_citizenship as GetType<'citizenShip'> | undefined,
      _16_1_1_Have_you_experienced_a: fnSwitch(a._16_1_1_Have_you_experienced_a as any, {
        'yes25': true,
        'no25': false,
        'don_t_know25': undefined,
        'prefer_not_to_answer2': undefined,
      }, () => undefined),
      _16_1_2_What_are_the_barriers_: a._16_1_2_What_are_the_barriers_?.split(' ') as GetType<'barriersToPersonalDocuments'>[] | undefined,
      _24_2_Have_you_observed_pers: fnSwitch(a._24_2_Have_you_observed_pers!, {
        'yes34': true,
        'no34': false,
        'don_t_know34': undefined,
        'prefer_not_to_answer3': undefined,
      }, () => undefined),
      _19_1_1_Please_rate_your_relationship_: a._19_1_1_Please_rate_your_relationship_ as GetType<'_19_1_1_Please_rate_your_relationship_'> | undefined,
      _18_1_1_Please_rate_your_sense_of_safe: fnSwitch(a._18_1_1_Please_rate_your_sense_of_safe!, {
        prefer_not_to_answer27: undefined
      }, _ => _) as GetType<'_18_1_1_Please_rate_your_sense_of_safe'> | undefined,
      _18_1_2_What_are_the_factors_t: a._18_1_2_What_are_the_factors_t?.split(' ').map(_ => fnSwitch(_, {
          other__specify: undefined,
          don_t_know271: undefined,
          don_t_want_to_say271: undefined,
        }, _ => _)
      ) as GetType<'_18_1_2_What_are_the_factors_t'>[] | undefined,
      _4_1_What_raion_currently_living_in: map(raionsCols.find(_ => a[_]), _ => a[_]),
      _26_4_Do_you_have_fo_in_your_accomodation: fnSwitch(a._26_4_Do_you_have_fo_in_your_accomodation!, {
        prefer_not_to_answer38: undefined,
        don_t_know38: undefined,
      }, _ => _) as GetType<'_26_4_Do_you_have_fo_in_your_accomodation'> | undefined,
      _32_1_What_type_of_allowances_do_you: a._32_1_What_type_of_allowances_do_you?.split(' ').map(_ => fnSwitch(_, {
        nonec: undefined,
        otherc: undefined,
      }, _ => _)) as GetType<'_32_1_What_type_of_allowances_do_you'>[] | undefined,
      _12_5_1_During_your_displacement_journ: a._12_5_1_During_your_displacement_journ?.split(' ').map(_ => fnSwitch(_, {
        prefer_not_to_answer: undefined,
        extortion: 'looting_robbery',
      }, _ => _)) as GetType<'_12_5_1_During_your_displacement_journ'>[] | undefined,
      _17_1_1_Does_any_of_them_recieve_state: fnSwitch(a._17_1_1_Does_any_of_them_recieve_state!, {
        yes26: true,
        no26: false,
      }, _ => undefined),
      _16_2_1_Do_you_have_a_household_member: a._16_2_1_Do_you_have_a_household_member?.split(' ').map(_ => fnSwitch(_, {
        prefer_not_to_answer: undefined
      }, _ => _)) as GetType<'_16_2_1_Do_you_have_a_household_member'>[] | undefined,
      _19_1_2_What_factors_are_influencing_t: a._19_1_2_What_factors_are_influencing_t?.split(' ') as GetType<'_19_1_2_What_factors_are_influencing_t'>[] | undefined,
      _13_4_3_If_separated_from_a_household_: fnSwitch(a._13_4_3_If_separated_from_a_household_!, {
        prefer_not_to_answer: undefined,
        do_not_know_their_whereabouts: undefined,
      }, _ => _) as GetType<'_13_4_3_If_separated_from_a_household_'> | undefined,
      _15_1_1_What_housing_land_and: a._15_1_1_What_housing_land_and?.split(' ').map(_ => fnSwitch(_, {
        prefer_not_to_answer24: undefined
      }, _ => _)) as GetType<'_15_1_1_What_housing_land_and'>[] | undefined,
      _26_1_1_Where_do_you_live_now: a._26_1_1_Where_do_you_live_now?.split(' ') as GetType<'_26_1_1_Where_do_you_live_now'>[] | undefined,
      _17_1_2_If_not_why: a._17_1_2_If_not_why?.split(' ') as GetType<'_17_1_2_If_not_why'> | undefined,
      // _13_1_2_If_refugee_I_your_area_of_origin: map(a._13_1_2_If_refugee_I_your_area_of_origin, _ => new Date(_)),
      _13_1_2_If_refugee_I_your_area_of_origin: a._13_1_2_If_refugee_I_your_area_of_origin,
    }
  }
}
