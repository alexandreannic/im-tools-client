import {KoboAnswerMetaData} from '../sdk/kobo/KoboType'
import {map} from '@alexandreannic/ts-utils'

export namespace KoboFormProtHH {
  export const mapAnswers = (a: KoboAnswerMetaData & Record<string, string | undefined>) => {
    return {
      ...a,
      B_Interviewer_to_in_ert_their_DRC_office: a.B_Interviewer_to_in_ert_their_DRC_office,
      _8_What_is_your_household_size: map(a._8_What_is_your_household_size, _ => +_),
      _12_1_What_oblast_are_you_from_001: a._12_1_What_oblast_are_you_from_001,
      _4_What_oblast_are_you_from: a._4_What_oblast_are_you_from,
      _12_8_1_What_would_be_the_deciding_fac: (a._12_8_1_What_would_be_the_deciding_fac?.split(' ') as FactorsToReturn[] | undefined)
        ?.map(_ => _ === 'government_regains_territory_f' ? 'improvement_in_security_situat' : _),
      _12_7_1_Do_you_plan_to_return_to_your_: a._12_7_1_Do_you_plan_to_return_to_your_ as T_12_7_1_Do_you_plan_to_return_to_your_,
      _12_3_1_When_did_you_your_area_of_origin: a._12_3_1_When_did_you_your_area_of_origin,
      _8_1_1_For_household_member_1_: map(a._8_1_1_For_household_member_1_, _ => +_),
      _8_1_2_For_household_member_1_: a._8_1_2_For_household_member_1_,
      _8_2_1_For_household_2_what_is_their_age: map(a._8_2_1_For_household_2_what_is_their_age, _ => +_),
      _8_2_2_For_household_2_what_is_their_sex: a._8_2_2_For_household_2_what_is_their_sex,
      _8_2_1_For_household_3_what_is_their_age: map(a._8_2_1_For_household_3_what_is_their_age, _ => +_),
      _8_2_2_For_household_3_what_is_their_sex: a._8_2_2_For_household_3_what_is_their_sex,
      _8_2_1_For_household_4_what_is_their_age: map(a._8_2_1_For_household_4_what_is_their_age, _ => +_),
      _8_2_2_For_household_4_what_is_their_sex: a._8_2_2_For_household_4_what_is_their_sex,
      _8_2_1_For_household_5_what_is_their_age: map(a._8_2_1_For_household_5_what_is_their_age, _ => +_),
      _8_2_2_For_household_5_what_is_their_sex: a._8_2_2_For_household_5_what_is_their_sex,
      _8_2_1_For_household_6_what_is_their_age: map(a._8_2_1_For_household_6_what_is_their_age, _ => +_),
      _8_2_2_For_household_6_what_is_their_sex: a._8_2_2_For_household_6_what_is_their_sex,
      _8_2_1_For_household_7_what_is_their_age: map(a._8_2_1_For_household_7_what_is_their_age, _ => +_),
      _8_2_2_For_household_7_what_is_their_sex: a._8_2_2_For_household_7_what_is_their_sex,
    }
  }

  export const ageGroup = Object.freeze({
    '0 - 4': [0, 4],
    '5 - 11': [5, 11],
    '12 - 17': [12, 17],
    '18 - 24': [18, 24],
    '25 - 49': [25, 49],
    '50 - 59': [50, 59],
    '60+': [60, Infinity],
  })

  export enum Gender {
    female = 'female',
    male = 'male',
    prefer_not_to_answer = 'prefer_not_to_answer',
    don_t_know = 'don_t_know',
  }

  export interface Person {
    age?: number
    gender?: Gender
  }

  export type FactorsToReturn =
    'shelter_is_repaired'
    | 'improvement_in_security_situat'
    | 'increased_service_availability'
    | 'infrastructure__including_heat'
    | 'cessation_of_hostilities'
    | 'health_facilties_are_accessibl'
    | 'government_regains_territory_f'
    | 'other219'
    | 'education_facilities__schools_'

  export type T_12_7_1_Do_you_plan_to_return_to_your_ = 'yes21' | 'don_t21' | 'don_t_know21' | 'yes_but_no_clear_timeframe' | 'prefer_not_to_answer21'

  export type Answser = ReturnType<typeof mapAnswers>
}
