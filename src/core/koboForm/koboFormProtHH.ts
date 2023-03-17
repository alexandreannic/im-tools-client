import {KoboAnswer, KoboAnswerMetaData} from '../sdk/kobo/KoboType'
import {map, mapFor} from '@alexandreannic/ts-utils'

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

  export enum Vulnerability {
    person_with_a_disability = 'person_with_a_disability',
    elderly_head_of_household__60__with_mino = 'elderly_head_of_household__60__with_mino',
    woman_at_risk = 'woman_at_risk',
    exterme_poverty_impacting_acce = 'exterme_poverty_impacting_acce',
    person_with_a_serious_medical_ = 'person_with_a_serious_medical_',
    child_at_risk = 'child_at_risk',
    single_parent = 'single_parent',
    other_specifyg = 'other_specifyg',
    multiple_displacements = 'multiple_displacements',
    gbv_risk = 'gbv_risk',
    no_legal_documentation = 'no_legal_documentation',
    unaccompanied_or_separated_chi = 'unaccompanied_or_separated_chi',
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

  export enum Status {
    conflict_affected_person = 'conflict_affected_person',
    idp = 'idp',
    host_community_member = 'host_community_member',
    idp_returnee = 'idp_returnee',
  }

  export enum CopingMechanisms {
    spent_savings = 'spent_savings',
    depending_on_support_from_family_host_fm = 'depending_on_support_from_family_host_fm',
    skipping = 'skipping',
    reduced_expenses_on_food__health_and_edu = 'reduced_expenses_on_food__health_and_edu',
    borrowing_food = 'borrowing_food',
    sent_household_members_to_eat_elsewhere = 'sent_household_members_to_eat_elsewhere',
    planning_to_relocate_abroad = 'planning_to_relocate_abroad',
    borrowed_money__from_a_formal_lender_ban = 'borrowed_money__from_a_formal_lender_ban',
    unknown_no_answer341 = 'unknown_no_answer341',
    sold_household_assets_goods = 'sold_household_assets_goods',
    other_specify341 = 'other_specify341',
    asking_strangers_for_money_begging = 'asking_strangers_for_money_begging',
    sold_productive_assets = 'sold_productive_assets',
  }

  export enum NFI {
    infant_clothing = 'infant_clothing',
    hygiene_items = 'hygiene_items',
    do_not_require41 = 'do_not_require41',
    other_household_items = 'other_household_items',
    blankets = 'blankets',
    towels_bed_linen = 'towels_bed_linen',
    winter_clothes = 'winter_clothes',
    kitchen_items = 'kitchen_items',
    clothes_and_shoes = 'clothes_and_shoes',
  }

  export enum BasicNeeds {
    gas = 'gas',
    electricity = 'electricity',
    drinking_water = 'drinking_water',
    toilets = 'toilets',
    shower = 'shower',
    heating_system = 'heating_system',
    hot_water = 'hot_water',
    usage_water = 'usage_water',
    none_of_the_above40 = 'none_of_the_above40',
  }

  export type T_27_Has_your_house_apartment_been_ = 'no39' | 'yes39' | 'don_t_know39' | 'prefer_not_to_answer39'

  export type T_12_7_1_Do_you_plan_to_return_to_your_ = 'yes21' | 'don_t21' | 'don_t_know21' | 'yes_but_no_clear_timeframe' | 'prefer_not_to_answer21'

  export type Answer = ReturnType<typeof mapAnswers>

  const mapGender = (g?: any): Gender | undefined => {
    if (g && g !== 'prefer_not_to_answer' && g !== 'don_t_know') return Gender[g as Gender]
  }

  const mapPerson = (a: KoboAnswer) => {
    const ageFields: [string, string][] = [
      ['_8_1_1_For_household_member_1_', '_8_1_2_For_household_member_1_'],
      ...mapFor(6, i => [`_8_2_1_For_household_${i + 2}_what_is_their_age`, `_8_2_2_For_household_${i + 2}_what_is_their_sex`] as [string, string]),
    ]
    return ageFields
      .map(([ageCol, sexCol]) => ({
        age: a[ageCol] as number | undefined,
        gender: mapGender(a[sexCol])
      }))
      .filter(x => x.gender !== undefined || x.age !== undefined)
  }

  export const filterByHoHH60 = (row: Answer): boolean => {
    return row.persons[0]?.age !== undefined && row.persons[0].age >= 60
  }

  export const filterByHoHHFemale = (row: Answer): boolean => {
    return row.persons[0]?.gender !== undefined && row.persons[0].gender === 'female'
  }

  export const filterWithDisability = (row: Answer): boolean => {
    return !!row.C_Vulnerability_catergories_that?.includes(Vulnerability.person_with_a_disability)
  }

  export const filterByIDP = (row: Answer): boolean => {
    return row._12_Do_you_identify_as_any_of === Status.idp
  }

  export const mapAnswers = (a: KoboAnswerMetaData & Record<string, string | undefined>) => {
    return {
      ...a,
      _29_Which_NFI_do_you_need: a._29_Which_NFI_do_you_need?.split(' ') as NFI[] | undefined,
      _28_Do_you_have_acce_current_accomodation: a._28_Do_you_have_acce_current_accomodation?.split(' ') as BasicNeeds[] | undefined,
      _25_1_1_During_the_last_30_day: a._25_1_1_During_the_last_30_day?.split(' ') as CopingMechanisms[] | undefined,
      C_Vulnerability_catergories_that: a.C_Vulnerability_catergories_that?.split(' ') as Vulnerability[] | undefined,
      _12_Do_you_identify_as_any_of: a._12_Do_you_identify_as_any_of as Status | undefined,
      _39_What_type_of_information_would: a._39_What_type_of_information_would as Information | undefined,
      _40_1_What_is_your_first_priorty: a['_40_What_are_your_priority_needs/_40_1_What_is_your_first_priorty'] as PriorityNeed | undefined,
      _40_2_What_is_your_second_priority: a['_40_What_are_your_priority_needs/_40_2_What_is_your_second_priority'] as PriorityNeed | undefined,
      _40_3_What_is_your_third_priority: a['_40_What_are_your_priority_needs/_40_3_What_is_your_third_priority'] as PriorityNeed | undefined,
      _27_1_If_yes_what_is_level_of_the_damage: a._27_1_If_yes_what_is_level_of_the_damage as PropertyDamage | undefined,
      _27_Has_your_house_apartment_been_: a._27_Has_your_house_apartment_been_ as T_27_Has_your_house_apartment_been_,
      B_Interviewer_to_in_ert_their_DRC_office: a.B_Interviewer_to_in_ert_their_DRC_office,
      _8_What_is_your_household_size: map(a._8_What_is_your_household_size, _ => +_),
      _12_1_What_oblast_are_you_from_001: a._12_1_What_oblast_are_you_from_001,
      _4_What_oblast_are_you_from: a._4_What_oblast_are_you_from,
      _12_8_1_What_would_be_the_deciding_fac: (a._12_8_1_What_would_be_the_deciding_fac?.split(' ') as FactorsToReturn[] | undefined)
        ?.map(_ => _ === 'government_regains_territory_f' ? 'improvement_in_security_situat' : _),
      _12_7_1_Do_you_plan_to_return_to_your_: a._12_7_1_Do_you_plan_to_return_to_your_ as T_12_7_1_Do_you_plan_to_return_to_your_ | undefined,
      _12_3_1_When_did_you_your_area_of_origin: a._12_3_1_When_did_you_your_area_of_origin,
      persons: mapPerson(a),
    }
  }
}
