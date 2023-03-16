import {KoboAnswerMetaData} from '../sdk/kobo/KoboType'
import {map} from '@alexandreannic/ts-utils'

export namespace KoboFormProtHH {

  export const ageGroup = Object.freeze({
    '0 - 4': [0, 4],
    '5 - 11': [5, 11],
    '12 - 17': [12, 17],
    '18 - 24': [18, 24],
    '25 - 49': [25, 49],
    '50 - 59': [50, 59],
    '60+': [60, Infinity],
  })

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

  export enum Information {
    livelihoods = 'livelihoods',
    legal_aid = 'legal_aid',
    health1 = 'health1',
    otheri = 'otheri',
    food = 'food',
    cash = 'cash',
    compensation_regarding_the_mec = 'compensation_regarding_the_mec',
    return = 'return',
    shelter = 'shelter',
    protection = 'protection',
    family_reunification = 'family_reunification',
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

  export enum PropertyDamage {
    light_damage = 'light_damage',
    partially_damage = 'partially_damage',
    partially_damaged__considerable_repair_i = 'partially_damaged__considerable_repair_i',
    fully_damaged_needs_full_reconstruction = 'fully_damaged_needs_full_reconstruction',
  }

  export enum PoC {
    conflict_affected_person = 'conflict_affected_person',
    idp = 'idp',
    host_community_member = 'host_community_member',
    idp_returnee = 'idp_returnee',
  }

  export type T_27_Has_your_house_apartment_been_ = 'no39' | 'yes39' | 'don_t_know39' | 'prefer_not_to_answer39'

  export type T_12_7_1_Do_you_plan_to_return_to_your_ = 'yes21' | 'don_t21' | 'don_t_know21' | 'yes_but_no_clear_timeframe' | 'prefer_not_to_answer21'

  export type Answser = ReturnType<typeof mapAnswers>

  const mapGender = (g?: KoboGender): Gender | undefined => {
    if (g && g !== 'prefer_not_to_answer' && g !== 'don_t_know') return Gender[g]
  }

  export const mapAnswers = (a: KoboAnswerMetaData & Record<string, string | undefined>) => {
    return {
      ...a,
      _12_Do_you_identify_as_any_of: a._12_Do_you_identify_as_any_of as PoC | undefined,
      _39_What_type_of_information_would: a._39_What_type_of_information_would as Information | undefined,
      _40_1_What_is_your_first_priorty: a._40_1_What_is_your_first_priorty as PriorityNeed | undefined,
      _40_2_What_is_your_second_priority: a._40_2_What_is_your_second_priority as PriorityNeed | undefined,
      _40_3_What_is_your_third_priority: a._40_3_What_is_your_third_priority as PriorityNeed | undefined,
      _27_1_If_yes_what_is_level_of_the_damage: a._27_1_If_yes_what_is_level_of_the_damage as PropertyDamage | undefined,
      _27_Has_your_house_apartment_been_: a._27_Has_your_house_apartment_been_ as T_27_Has_your_house_apartment_been_,
      B_Interviewer_to_in_ert_their_DRC_office: a.B_Interviewer_to_in_ert_their_DRC_office,
      _8_What_is_your_household_size: map(a._8_What_is_your_household_size, _ => +_),
      _12_1_What_oblast_are_you_from_001: a._12_1_What_oblast_are_you_from_001,
      _4_What_oblast_are_you_from: a._4_What_oblast_are_you_from,
      _12_8_1_What_would_be_the_deciding_fac: (a._12_8_1_What_would_be_the_deciding_fac?.split(' ') as FactorsToReturn[] | undefined)
        ?.map(_ => _ === 'government_regains_territory_f' ? 'improvement_in_security_situat' : _),
      _12_7_1_Do_you_plan_to_return_to_your_: a._12_7_1_Do_you_plan_to_return_to_your_ as T_12_7_1_Do_you_plan_to_return_to_your_,
      _12_3_1_When_did_you_your_area_of_origin: a._12_3_1_When_did_you_your_area_of_origin,
      _8_1_1_For_household_member_1_: map(a._8_1_1_For_household_member_1_, _ => +_),
      _8_1_2_For_household_member_1_: mapGender(a._8_1_2_For_household_member_1_ as KoboGender),
      _8_2_1_For_household_2_what_is_their_age: map(a._8_2_1_For_household_2_what_is_their_age, _ => +_),
      _8_2_2_For_household_2_what_is_their_sex: mapGender(a._8_2_2_For_household_2_what_is_their_sex as KoboGender),
      _8_2_1_For_household_3_what_is_their_age: map(a._8_2_1_For_household_3_what_is_their_age, _ => +_),
      _8_2_2_For_household_3_what_is_their_sex: mapGender(a._8_2_2_For_household_3_what_is_their_sex as KoboGender),
      _8_2_1_For_household_4_what_is_their_age: map(a._8_2_1_For_household_4_what_is_their_age, _ => +_),
      _8_2_2_For_household_4_what_is_their_sex: mapGender(a._8_2_2_For_household_4_what_is_their_sex as KoboGender),
      _8_2_1_For_household_5_what_is_their_age: map(a._8_2_1_For_household_5_what_is_their_age, _ => +_),
      _8_2_2_For_household_5_what_is_their_sex: mapGender(a._8_2_2_For_household_5_what_is_their_sex as KoboGender),
      _8_2_1_For_household_6_what_is_their_age: map(a._8_2_1_For_household_6_what_is_their_age, _ => +_),
      _8_2_2_For_household_6_what_is_their_sex: mapGender(a._8_2_2_For_household_6_what_is_their_sex as KoboGender),
      _8_2_1_For_household_7_what_is_their_age: map(a._8_2_1_For_household_7_what_is_their_age, _ => +_),
      _8_2_2_For_household_7_what_is_their_sex: mapGender(a._8_2_2_For_household_7_what_is_their_sex as KoboGender),
    }
  }
}
