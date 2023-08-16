import {Shelter_NTAOptions} from './Shelter_NTAOptions'

type Opt<T extends keyof typeof Shelter_NTAOptions> = keyof (typeof Shelter_NTAOptions)[T]

export interface Shelter_NTA {
  start: string,
  end: string,
  // [select_one] 1.1 Select Office
  back_office: undefined | Opt<'back_office'>,
  // [select_one] Enumerator Name
  enum_name: undefined | Opt<'enum_name'>,
  // [note] DRC is a Danish non-governmental humanitarian organization and that currently implements a project providing shelter support to households with damaged shelters. DRC is conducting an initial assessment to determine which households are eligible to be targeted by for the project.
  drc_intro: string,
  // [select_one] Consent
  consent: undefined | Opt<'pregnant_lac'>,
  // [note] Thank you for your time today, we have no further questions
  thank_no_further: string,
  // [select_one] Select oblast where registration is taking place
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Select raion where registration is taking place
  ben_det_raion: undefined | string,
  // [select_one] Select hromada where registration is taking place
  ben_det_hromada: undefined | string,
  // [select_one] Select residential status
  ben_det_res_stat: undefined | Opt<'ben_det_res_stat'>,
  // [select_one] Is the damage a result of ongoing hostilities?
  damage_hostilities: undefined | Opt<'pregnant_lac'>,
  // [note] ℹ️ Because of limited financial resources in the project, it’s important to note that participating in this initial assessment does not guarantee that assistance will be provided.
  damage_note: string,
  // [select_one] Please confirm that the resident of the shelter is available in the next three months and grants access to DRC for the rehabilitation work
  resident_available: undefined | Opt<'pregnant_lac'>,
  // [note] 🛑 **You did not reach the criteria for shelter support, thank you for your time**
  uneligible: string,
  // [text] What is your name?
  interviewee_name: string | undefined,
  // [select_one] Are you the head of household AND/OR able to speak on behalf of the household?
  hh_char_hhh: undefined | Opt<'pregnant_lac'>,
  // [select_one] Select gender of respondent?
  hh_char_res_gender: undefined | Opt<'hh_char_hh_det_gender'>,
  // [integer] Age of Respondent
  hh_char_res_age: number | undefined,
  // [image] Picture of passport/ ID of the Head of Household
  hh_yes_pp: string,
  // [image] Picture of passport/ ID of interviewee
  pp_picture: string,
  // [select_one] What is the gender of head of household?
  hh_char_hhh_gender: undefined | Opt<'hh_char_hh_det_gender'>,
  // [integer] What is the age of the Head of Household?
  hh_char_hhh_age: number | undefined,
  // [select_one] What is the civil status of the Head of Household?
  hh_char_civ_stat: undefined | Opt<'hh_char_civ_stat'>,
  calc_char_civ_stat: string,
  // [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
  hh_char_chh: string,
  // [integer] Head of Household mobile number
  hh_yes_mobile: number | undefined,
  // [text] What is the name of the head of household?
  hh_no: string | undefined,
  // [integer] What is the phone number of the head of household?
  hh_phone: number | undefined,
  // [select_one] What is your relationship to the head of household?
  What_is_your_relatio_he_head_of_household: undefined | Opt<'What_is_your_relatio_he_head_of_household'>,
  // [select_one] Is this a house or apartment?
  dwelling_type: undefined | Opt<'dwelling_type'>,
  // [text] House Number
  house_number: string | undefined,
  // [text] Building Number
  building_number: string | undefined,
  // [integer] Apartment Number
  apartment_number: number | undefined,
  // [text] Street
  street: string | undefined,
  // [text] Settlement
  settlement: string | undefined,
  // [geopoint] GPS Coordinates
  gps_coordinates: string,
  // [select_one] Are you an owner or a tenant?
  owner_tenant_type: undefined | Opt<'owner_tenant_type'>,
  // [image] Picture of personal documents
  pd_picture1: string,
  // [image] Picture of personal documents
  pd_picture2: string,
  // [image] Picture of personal documents
  pd_picture3: string,
  // [image] Picture of personal documents
  pd_picture4: string,
  // [image] Picture of personal documents
  pd_picture5: string,
  // [text] Individual tax number of the person with whom the contract will be signed ?
  pay_det_tax_id_num: string | undefined,
  // [image] Take a photo of the Tax ID
  pay_det_tax_id_ph: string,
  // [select_one] Does an ownership verification exist?
  ownership_verification: undefined | Opt<'pregnant_lac'>,
  // [select_one] Type of document verifying ownership?
  document_type: undefined | Opt<'document_type'>,
  // [text] Other:
  doth: string | undefined,
  // [select_one] Is this document available for a picture?
  doc_available: undefined | Opt<'doc_available'>,
  // [image] Picture of ownership verification
  doc_available_yes1: string,
  // [image] Picture of ownership verification
  doc_available_yes2: string,
  // [image] Picture of ownership verification
  doc_available_yes3: string,
  // [image] Picture of ownership verification
  doc_available_yes4: string,
  // [image] Picture of ownership verification
  doc_available_yes5: string,
  // [select_one] Does the place of residence (according to registration) correspond to the address of the damaged home
  dplre: undefined | Opt<'pregnant_lac'>,
  // [text] If the document is not available, please explain why
  not_available: string | undefined,
  // [select_one] Is the rightful owner of this property currently in Ukraine?
  Is_the_rightful_owne_currently_in_Ukraine: undefined | Opt<'rehab_solo'>,
  // [text] What is the name of the owner of this property?
  owner_name: string | undefined,
  // [integer] What is the phone number of the owner of this property?
  owner_number: number | undefined,
  // [text] House/Apartment Number of the owner of this property
  house_apt_number: string | undefined,
  // [text] Building Number of the owner of this property
  building_apt_number: string | undefined,
  // [text] Street of the owner of this property
  street_name: string | undefined,
  // [text] Settlement of the owner of this property
  settlement_name: string | undefined,
  // [select_one] Is there a written tenancy agreement in place?
  written_tenancy: undefined | Opt<'pregnant_lac'>,
  // [select_one] Do you have a copy of this tenancy agreement to present today?
  written_tenancy_available: undefined | Opt<'pregnant_lac'>,
  // [image] Picture of tenancy agreement
  picture_agreement: string,
  // [image] Picture of tenancy agreement
  picture_agreement1: string,
  // [select_one] If no, can you present it later?
  tenancy_present_later: undefined | Opt<'rehab_solo'>,
  // [text] If the document is not available, please explain why
  why_not_available: string | undefined,
  // [integer] Indicate the total number of people in your household/shelter, including the Household Head
  ben_det_hh_size: number | undefined,
  // [begin_repeat] 3.1.7 HH Members
  hh_char_hh_det: {hh_char_hh_det_gender: undefined | Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined,calc_u18: string | undefined,calc_o60: string | undefined,calc_ed_age: string | undefined,calc_preg: string | undefined,calc_female_60_i: string | undefined,calc_male_60_i: string | undefined}[] | undefined,
  // [select_one] Do you take care of the child/children yourself?
  hh_char_hhh_care_child: undefined | Opt<'pregnant_lac'>,
  // [note] Specify the type and quantity of damage
  damage_type_quality: string,
  // [select_one] Is the roof damaged?
  roof_damage: undefined | Opt<'rehab_solo'>,
  // [integer] How many windows are damaged?
  window_number: number | undefined,
  // [select_one] Is there damage to the external brick walls?
  external_brick_damage: undefined | Opt<'rehab_solo'>,
  // [select_one] Is there damage to the household entrance door?
  damag_house_entrance: undefined | Opt<'rehab_solo'>,
  // [integer] How many interior doors have been damaged?
  interior_door_damage: number | undefined,
  // [select_one] Are there any cracks on the indoor walls?
  wall_cracks: undefined | Opt<'rehab_solo'>,
  // [select_one] Is there damage to the electricity?
  electricity_damage: undefined | Opt<'rehab_solo'>,
  // [select_one] Is there damage to the water pipes?
  waterpipe_damage: undefined | Opt<'rehab_solo'>,
  // [select_one] Is there any structural damage?
  structural_damage: undefined | Opt<'rehab_solo'>,
  c_roof_damage: string,
  c_external_damage: string,
  c_house_entrance: string,
  c_cracks_indoor: string,
  c_damage_electricity: string,
  c_damage_water: string,
  c_damage_structure: string,
  total_damage: string,
  // [note] **Outcome of Analyses**
  total_damage_label: string,
  // [note] 🟢⚪⚪ Light damaged
  total_damage_light: string,
  // [note] 🟠🟠⚪ Medium damaged
  total_damage_medium: string,
  // [note] 🔴🔴🔴 Heavy damaged
  total_damage_heavy: string,
  // [integer] How many windows are damaged?
  apartment_window: number | undefined,
  // [integer] How many balcony doors have damage?
  apartment_balcony: number | undefined,
  // [select_one] Is there damage to the apartment entrance door?
  apartment_entrance: undefined | Opt<'rehab_solo'>,
  // [select_one] Do you live on the top floor of the apartment?
  top_floor: undefined | Opt<'rehab_solo'>,
  // [select_one] Is the roof flat or non-flat?
  roof_type: undefined | Opt<'roof_type'>,
  // [select_one] Non flat, is there damage?
  non_flat_damage: undefined | Opt<'rehab_solo'>,
  // [select_one] If flat, is the roof leaking?
  flat_roofleak: undefined | Opt<'rehab_solo'>,
  // [integer] How many interior doors have damage?
  interior_apt_door_damage: number | undefined,
  // [select_one] Are there any cracks on the indoor walls?
  indoor_cracks: undefined | Opt<'rehab_solo'>,
  // [select_one] Is there damage to the electricity?
  damage_electricity_apt: undefined | Opt<'rehab_solo'>,
  // [select_one] Is there damage to the water pipes?
  water_damage_apt: undefined | Opt<'rehab_solo'>,
  apt_entrance: string,
  nonflat_dam: string,
  flat_leak: string,
  cracks_app: string,
  electricity_apt_damage: string,
  water_apt_damage: string,
  // [calculate] Total Apartment Damage Calculate
  total_apt_damage: string,
  // [note] **Outcome of Analyses**
  total_apt_damage_label: string,
  // [note] 🟢⚪ Light damaged
  total_apt_damage_light: string,
  // [note] 🟠🟠 Medium damaged
  total_apt_damage_medium: string,
  // [note] Complete shelter displaying the damage
  npi: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage1: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage2: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage3: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage4: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage5: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage6: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage7: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage8: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage9: string,
  // [image] Photo of the damage to the house
  pictures_apt_damage10: string,
  // [select_one] Do you see yourself capable and willing to rehabilitate the shelter yourswelf in case DRC only provides the required materials and tools?
  rehab_solo: undefined | Opt<'rehab_solo'>,
  // [select_one] Have you been temporarily displaced and returned to your shelter?
  displaced: undefined | Opt<'pregnant_lac'>,
  // [select_one] If yes, when did you return?
  return_time: undefined | Opt<'return_time'>,
  // [calculate] Recent Returnee
  calc_recentr: string,
  // [calculate] Returnee
  calc_ret: string,
  // [calculate] Not Applicable
  calc_na: string,
  // [note] **3.3 The next set of questions ask about difficulties you or members of your household may have doing certain activities.**
  hh_char_dis_note: string,
  // [select_multiple] Please select any of the below that apply to you or a member of your household
  hh_char_dis_select: undefined | Opt<'hh_char_dis_select'>[],
  // [integer] How many household individuals struggle with seeing?
  see_number: number | undefined,
  // [integer] How many household individuals struggle with hearing?
  hear_number: number | undefined,
  // [integer] How many household individuals struggle with walking?
  walk_number: number | undefined,
  // [integer] How many household issues have  medical issues?
  medical_number: number | undefined,
  // [integer] How many household members have a mental or chronic illness?
  mental_number: number | undefined,
  calc_diff_see: string,
  calc_diff_hear: string,
  calc_diff_walk: string,
  calc_diff_medical: string,
  calc_diff_mental: string,
  calc_dis_level: string,
  calc__60: string,
  // [note] Older Person at Risk: Outcome Analysis
  older_risk: string,
  // [calculate] Male over 60
  calc_male_60: string,
  // [calculate] Female over 60
  calc_female_60: string,
  // [calculate] Two or more individuals over 60
  calc_2_60: string,
  // [calculate] Total number of individuals over 60 plus children under 18
  calc_total_individuals_60_18: string,
  // [calculate] Single father with one child (under 18)
  calc_single_one_male: string,
  // [calculate] Single father with two children (under 18)
  calc_single_two_male: string,
  // [calculate] Single father with three children or more (under 18)
  calc_single_three_male: string,
  // [calculate] Single mother with one child (under 18)
  calc_single_one_female: string,
  // [calculate] Single mother with two children (under 18)
  calc_single_two_female: string,
  // [calculate] Single mother with three children or more (under 18)
  calc_single_three_female: string,
  // [calculate] Couple
  calc_couple: string,
  // [calculate] Couple with 1 child < 18
  cal_couple_one_chil: string,
  // [calculate] Couple with 2 children < 18
  cal_couple_two_chil: string,
  // [calculate] Couple with 3 children or more < 18
  cal_couple_three_chil: string,
  // [integer] How many children under the age of 18 that are not related to the household members, are hosted by the household?
  how_u18_notrelated: number | undefined,
  // [select_one] Are there any pregnant or lactating women in this household?
  pregnant_lac: undefined | Opt<'pregnant_lac'>,
  // [integer] If yes, how many?
  pregnant_count: number | undefined,
  // [select_one] What is the total household income per month?
  what_income: undefined | Opt<'what_income'>,
  // [calculate] Calculate: household composition
  calc_dems: string,
  // [calculate] Calculate: household income
  calculate_householdincome: string,
  // [calculate] Calculate: high dependence ration
  calculate_highdependence: string,
  // [calculate] Calculate: household size
  calculate_householdsize: string,
  // [calculate] Calculate: household score
  hh_score: string,
  // [calculate] Calculate: apartment score
  apt_score: string,
  // [calculate] Calculate: displacement score
  displ_score: string,
  // [calculate] Calculate: socio-economic vulernability
  socio_score: string,
  // [calculate] TOTAL
  total_score: string,
  // [text] Other Comments from Respondent
  fin_det_res: string | undefined,
  // [text] Other Comments from Enumerator
  fin_det_enum: string | undefined,
  // [note] Thank you for your time today, we have no further questions
  end_survey: string,
}