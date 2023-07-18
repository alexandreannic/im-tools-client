import {ShelterOptions} from './ShelterOptions'

type Opt<T extends keyof typeof ShelterOptions> = keyof (typeof ShelterOptions)[T]

export interface Shelter {
  start: string,
  end: string,
  // 1.1 Select Office
  back_office: Opt<'back_office'>,
  // Enumerator Name
  enum_name: Opt<'enum_name'>,
  // Consent
  consent: Opt<'pregnant_lac'>,
  // Select oblast where registration is taking place
  ben_det_oblast: Opt<'ben_det_oblast'>,
  // Select raion where registration is taking place
  ben_det_raion: Opt<'ben_det_raion'>,
  // Select hromada where registration is taking place
  ben_det_hromada: Opt<'ben_det_hromada'>,
  // Select residential status
  ben_det_res_stat: Opt<'ben_det_res_stat'>,
  // Is the damage a result of ongoing hostilities?
  damage_hostilities: Opt<'pregnant_lac'>,
  // Please confirm that the resident of the shelter is available in the next three months and grants access to DRC for the rehabilitation work
  resident_available: Opt<'pregnant_lac'>,
  // What is your name?
  interviewee_name: string | undefined,
  // Are you the head of household AND/OR able to speak on behalf of the household?
  hh_char_hhh: Opt<'pregnant_lac'>,
  // Select gender of respondent?
  hh_char_res_gender: Opt<'hh_char_hh_det_gender'>,
  // Age of Respondent
  hh_char_res_age: number | undefined,
  // Picture of passport/ ID of the Head of Household
  hh_yes_pp: string,
  // Picture of passport/ ID of interviewee
  pp_picture: string,
  // What is the gender of head of household?
  hh_char_hhh_gender: Opt<'hh_char_hh_det_gender'>,
  // What is the age of the Head of Household?
  hh_char_hhh_age: number | undefined,
  // What is the civil status of the Head of Household?
  hh_char_civ_stat: Opt<'hh_char_civ_stat'>,
  // Head of Household mobile number
  hh_yes_mobile: number | undefined,
  // What is the name of the head of household?
  hh_no: string | undefined,
  // What is the phone number of the head of household?
  hh_phone: number | undefined,
  // What is your relationship to the head of household?
  What_is_your_relatio_he_head_of_household: Opt<'What_is_your_relatio_he_head_of_household'>,
  // Is this a house or apartment?
  dwelling_type: Opt<'dwelling_type'>,
  // House Number
  house_number: string | undefined,
  // Building Number
  building_number: string | undefined,
  // Apartment Number
  apartment_number: number | undefined,
  // Street
  street: string | undefined,
  // Settlement
  settlement: string | undefined,
  // GPS Coordinates
  gps_coordinates: string,
  // Are you an owner or a tenant?
  owner_tenant_type: Opt<'owner_tenant_type'>,
  // Picture of personal documents
  pd_picture1: string,
  // Picture of personal documents
  pd_picture2: string,
  // Picture of personal documents
  pd_picture3: string,
  // Picture of personal documents
  pd_picture4: string,
  // Picture of personal documents
  pd_picture5: string,
  // Does an ownership verification exist?
  ownership_verification: Opt<'pregnant_lac'>,
  // Type of document verifying ownership?
  document_type: Opt<'document_type'>,
  // Other:
  doth: string | undefined,
  // Is this document available for a picture?
  doc_available: Opt<'doc_available'>,
  // Picture of ownership verification
  doc_available_yes1: string,
  // Picture of ownership verification
  doc_available_yes2: string,
  // Picture of ownership verification
  doc_available_yes3: string,
  // Picture of ownership verification
  doc_available_yes4: string,
  // Picture of ownership verification
  doc_available_yes5: string,
  // Does the place of residence (according to registration) correspond to the address of the damaged home
  dplre: Opt<'pregnant_lac'>,
  // If the document is not available, please explain why
  not_available: string | undefined,
  // Is the rightful owner of this property currently in Ukraine?
  Is_the_rightful_owne_currently_in_Ukraine: Opt<'rehab_solo'>,
  // What is the name of the owner of this property?
  owner_name: string | undefined,
  // What is the phone number of the owner of this property?
  owner_number: number | undefined,
  // House/Apartment Number of the owner of this property
  house_apt_number: string | undefined,
  // Building Number of the owner of this property
  building_apt_number: string | undefined,
  // Street of the owner of this property
  street_name: string | undefined,
  // Settlement of the owner of this property
  settlement_name: string | undefined,
  // Is there a written tenancy agreement in place?
  written_tenancy: Opt<'pregnant_lac'>,
  // Do you have a copy of this tenancy agreement to present today?
  written_tenancy_available: Opt<'pregnant_lac'>,
  // Picture of tenancy agreement
  picture_agreement: string,
  // Picture of tenancy agreement
  picture_agreement1: string,
  // If no, can you present it later?
  tenancy_present_later: Opt<'rehab_solo'>,
  // If the document is not available, please explain why
  why_not_available: string | undefined,
  // Indicate the total number of people in your household/shelter, including the Household Head
  ben_det_hh_size: number | undefined,
  // 3.1.7 HH Members
  hh_char_hh_det: {hh_char_hh_det_gender: Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined,calc_u18: string | undefined,calc_o60: string | undefined,calc_ed_age: string | undefined,calc_preg: string | undefined,calc_female_60_i: string | undefined,calc_male_60_i: string | undefined}[] | undefined,
  // Is the roof damaged?
  roof_damage: Opt<'rehab_solo'>,
  // How many windows are damaged?
  window_number: number | undefined,
  // Is there damage to the external brick walls?
  external_brick_damage: Opt<'rehab_solo'>,
  // Is there damage to the household entrance door?
  damag_house_entrance: Opt<'rehab_solo'>,
  // How many interior doors have been damaged?
  interior_door_damage: number | undefined,
  // Are there any cracks on the indoor walls?
  wall_cracks: Opt<'rehab_solo'>,
  // Is there damage to the electricity?
  electricity_damage: Opt<'rehab_solo'>,
  // Is there damage to the water pipes?
  waterpipe_damage: Opt<'rehab_solo'>,
  // Is there any structural damage?
  structural_damage: Opt<'rehab_solo'>,
  // How many windows are damaged?
  apartment_window: number | undefined,
  // How many balcony doors have damage?
  apartment_balcony: number | undefined,
  // Is there damage to the apartment entrance door?
  apartment_entrance: Opt<'rehab_solo'>,
  // Do you live on the top floor of the apartment?
  top_floor: Opt<'rehab_solo'>,
  // Is the roof flat or non-flat?
  roof_type: Opt<'roof_type'>,
  // Non flat, is there damage?
  non_flat_damage: Opt<'rehab_solo'>,
  // If flat, is the roof leaking?
  flat_roofleak: Opt<'rehab_solo'>,
  // How many interior doors have damage?
  interior_apt_door_damage: number | undefined,
  // Are there any cracks on the indoor walls?
  indoor_cracks: Opt<'rehab_solo'>,
  // Is there damage to the electricity?
  damage_electricity_apt: Opt<'rehab_solo'>,
  // Is there damage to the water pipes?
  water_damage_apt: Opt<'rehab_solo'>,
  // Photo of the damage to the house
  pictures_apt_damage1: string,
  // Photo of the damage to the house
  pictures_apt_damage2: string,
  // Photo of the damage to the house
  pictures_apt_damage3: string,
  // Photo of the damage to the house
  pictures_apt_damage4: string,
  // Photo of the damage to the house
  pictures_apt_damage5: string,
  // Photo of the damage to the house
  pictures_apt_damage6: string,
  // Photo of the damage to the house
  pictures_apt_damage7: string,
  // Photo of the damage to the house
  pictures_apt_damage8: string,
  // Photo of the damage to the house
  pictures_apt_damage9: string,
  // Photo of the damage to the house
  pictures_apt_damage10: string,
  // Do you see yourself capable and willing to rehabilitate the shelter yourswelf in case DRC only provides the required materials and tools?
  rehab_solo: Opt<'rehab_solo'>,
  // Have you been temporarily displaced and returned to your shelter?
  displaced: Opt<'pregnant_lac'>,
  // If yes, when did you return?
  return_time: Opt<'return_time'>,
  // Please select any of the below that apply to you or a member of your household
  hh_char_dis_select: Opt<'hh_char_dis_select'>[],
  // How many household individuals struggle with seeing?
  see_number: number | undefined,
  // How many household individuals struggle with hearing?
  hear_number: number | undefined,
  // How many household individuals struggle with walking?
  walk_number: number | undefined,
  // How many household issues have  medical issues?
  medical_number: number | undefined,
  // How many household members have a mental or chronic illness?
  mental_number: number | undefined,
  // How many children under the age of 18 that are not related to the household members, are hosted by the household?
  how_u18_notrelated: number | undefined,
  // Are there any pregnant or lactating women in this household?
  pregnant_lac: Opt<'pregnant_lac'>,
  // If yes, how many?
  pregnant_count: number | undefined,
  // What is the total household income per month?
  what_income: Opt<'what_income'>,
  // Other Comments from Respondent
  fin_det_res: string | undefined,
  // Other Comments from Enumerator
  fin_det_enum: string | undefined,
}