import {MPCA_NFIOptions} from './MPCA_NFIOptions'

type Opt<T extends keyof typeof MPCA_NFIOptions> = keyof (typeof MPCA_NFIOptions)[T]

export interface MPCA_NFI {
  start: Date,
  end: Date,
  today: string,
  // Programme
  Programme: Opt<'Programme'>,
  // Please select DRC project and donor that the MPCA registration is for
  DRC_project: Opt<'DRC_project'>,
  // Office in charge of distribution/registration
  drc_base: Opt<'drc_base'>,
  // Record your current location
  location_geopoint: string,
  // Select DRC staff name
  staff_names: Opt<'staff_names'>,
  // Select BHA Consortium geographical area
  BHA_area: Opt<'BHA_area'>,
  // Are you happy to proceed with the questionnaire?
  consent_mod_1: Opt<'confirm_truth'>,
  // Select oblast where registration is taking place
  oblast: Opt<'oblast'>,
  // Select raion where registration is taking place
  raion: Opt<'raion'>,
  // Select hromada where registration is taking place
  hromada: Opt<'hromada'>,
  // What is your surname name (as shown in personal ID)?
  patron: string | undefined,
  // What is your first name (as shown in personal ID)?
  name_resp: string | undefined,
  // What is your patronymic name?
  last_resp: string | undefined,
  // Select status
  status: Opt<'status'>,
  // What is your phone number?
  phone: number | undefined,
  // Does the beneficiary have an individual tax number (ITN)?
  Does_the_beneficiary_have_an_i: Opt<'Does_the_beneficiary_have_an_i'>,
  // Other ID identification
  Other_ID_identification: Opt<'Other_ID_identification'>,
  // Number of ID
  Number_of_ID: string | undefined,
  // Individual tax number (ITN) of the HHH
  ITN: string | undefined,
  // Select gender of respondent
  gender_respondent: Opt<'gender_respondent'>,
  // Are you the head of your household?
  Are_you_the_head_of_your_house: Opt<'Are_you_the_head_of_your_house'>,
  // If no, what is the gender of head of household?
  sex: Opt<'sex'>,
  // How old is the head of household?
  hh_elderly_check: number | undefined,
  // How old are you?
  agex: number | undefined,
  // You have stated you are under 18 years, can you confirm you are the head of household?
  child_hhh_confirm: Opt<'child_hhh_confirm'>,
  // Indicate the total number of people in your household, including the HHH
  Total_Family: number | undefined,
  // HH members (excluding HHH)
  group_in3fh72: {AgeHH: number | undefined,GenderHH: string | undefined}[],
  // Please indicate the AGE of HH member
  AgeHH: number | undefined,
  // Please indicate the GENDER of HH member
  GenderHH: Opt<'GenderHH'>,
  // Does anyone in your family present with any disability? Select all that apply.
  Does_anyone_in_your_elect_all_that_apply: Opt<'Does_anyone_in_your_elect_all_that_apply'>[],
  // Kits to be provided
  Kits_to_be_provided: Opt<'Kits_to_be_provided'>[],
  // HKMV Family hygiene kit for IDPs on the move: How many?
  HKMV_: number | undefined,
  // HKF Hygiene kit: How many?
  HKF_: number | undefined,
  // NFKF Family NFI Kit: How many?
  NFKF_NFI_: number | undefined,
  // KS Family kitchen set: How many?
  KS_: number | undefined,
  // BK1 Baby Hygiene Kit 1: How many?
  BK_Baby_Kit_: number | undefined,
  // BK2 Baby Hygiene Kit 2: How many?
  BK_Baby_Kit: number | undefined,
  // BK3 Baby Hygiene Kit 3: How many?
  BK_Baby_Kit_001: number | undefined,
  // BK4 Baby Hygiene Kit 4: How many?
  BK_Baby_Kit_002: number | undefined,
  // WKB1 Baby Winterization Kit 1: How many?
  WKB1_1_: number | undefined,
  // WKB1 Baby Winterization Kit 2: How many?
  WKB2_2_: number | undefined,
  // WKB1 Baby Winterization Kit 3: How many?
  WKB3_3_: number | undefined,
  // WKB1 Baby Winterization Kit 4: How many?
  WKB4_4_: number | undefined,
  // BLN High Thermal Blankets: How many?
  BLN_: number | undefined,
  // Solar lamps: How many?
  BLN: number | undefined,
  // There are ${Total_Kits} planned for this family.
  Kits_Check: string,
  // Are you registered to receive cash from an NGO?
  ingo: Opt<'confirm_truth'>,
  // What was the income of your household in the last 30 days in UAH?
  income_month: number | undefined,
  // This household is not eligible for cash assistance because they are receiving or due to receive cash from an NGO.
  exclusion_1: Opt<'exclusion_1'>,
  // This household is not eligible for cash assistance because they earn more than 5,400 UAH per person per month
  exclusion_2: Opt<'exclusion_2'>,
  // This household has passed the exclusion criteria and can be screened for inclusion and vulnerability criteria - proceed to next step
  vul_screen: Opt<'vul_screen'>,
  // Has your household been displaced within in the last 3 days?
  recent_displacement: Opt<'confirm_truth'>,
  // Where are you currently staying?
  safe_shelter_001: Opt<'safe_shelter_001'>,
  // Has this location been damaged or shelled by the conflict since February 2022?
  Has_this_location_been_damaged: Opt<'Has_this_location_been_damaged'>,
  // Was your house damaged or destroyed since Feb. 2022?
  idp_host_shelter_damaged: Opt<'idp_host_shelter_damaged'>,
  // Is this the main reason you are not currently living in your house?
  main_reason_damaged_shelter: Opt<'main_reason_damaged_shelter'>,
  // Has your family lived under occupation?
  occupation: Opt<'confirm_truth'>,
  // Have you been displaced due to the occupation and are now returning to your place of residency?
  returnee: Opt<'confirm_truth'>,
  // Was your home impacted or destroyed by the conflict?
  safe_shelter: Opt<'confirm_truth'>,
  // Has your home been damaged or destroyed by shelling?
  displaced_ngca: Opt<'displaced_ngca'>,
  // For DRC staff only - Was this household referred by DRC Protection?
  For_DRC_staff_only_Was_this_: Opt<'For_DRC_staff_only_Was_this_'>,
  // Is this household female-headed?
  Is_this_household_female_heade: Opt<'Is_this_household_female_heade'>,
  // Is this person living alone and have a chronic illness/disease/disability/temporary impairment?
  single_PWD: Opt<'single_PWD'>,
  // Does this household have 2 or more children?
  large_hh: Opt<'large_hh'>,
  // Does this household have at least 1 child (under 18 years) and 1 elderly (60+ years) person?
  child_elderly: Opt<'child_elderly'>,
  // Does this household have at least 1 child (under 18 years) and 1 member with a chronic illness/disease/disability/temporary impairment?
  child_pwd: Opt<'child_pwd'>,
  // Is there any pregnant or lactating women in your household?
  plw: Opt<'plw'>,
  // Has this household been displaced in the last 30 days?
  displaced_30days: Opt<'displaced_30days'>,
  // Is this household caring for other children (guardianship or custody)?
  child_custody: Opt<'child_custody'>,
  // Is this household affected by sudden shelling including those where people have lost family member, houses, livelihoods (damaged shop/lost, farm, livestock)?
  damaged_inclusion_criteria: Opt<'damaged_inclusion_criteria'>,
  // Should this household be referred to another DRC department?
  internal_referral: Opt<'internal_referral'>,
  // Select to which DRC department
  internal_referral_specific: Opt<'internal_referral_specific'>[],
  // For DRC staff - Please enter any additional comments regarding specific needs of this household?
  additional_specific_needs: string | undefined,
  // This household is eligible for MPCA because they satisfy the inclusion criteria for the category of area
  mpca_eligible_inclusion_area: Opt<'mpca_eligible_inclusion_area'>,
  // This household is eligible for MPCA because they were referred to from DRC Protection and pass the exclusion criteria
  protection_referral: Opt<'protection_referral'>,
  // This household is eligible for MPCA because they are elderly-headed.
  mpca_yes_ehh: Opt<'mpca_yes_ehh'>,
  // This household is eligible for MPCA because they meet at least one of the vulnerability targeting criteria.
  mpca_eligible_vul: Opt<'mpca_eligible_vul'>,
  // Is this household currently renting or planning to rent an apartment/home?
  Is_this_household_currently_re: Opt<'Is_this_household_currently_re'>,
  // Do you have an IDP certificate?
  idp_certificate: Opt<'idp_certificate'>,
  // Please state main reason why you do not have an IDP certificate
  reason_no_idp_certificate: string | undefined,
  // Do you have a resident permit from a conflict-affected location?
  resident_permit: Opt<'resident_permit'>,
  // For staff member ONLY - is this person from a recognized conflict-affected area? (within the decree of cabinet of ministers)
  For_staff_member_ONL_cabinet_of_ministers: Opt<'For_staff_member_ONL_cabinet_of_ministers'>,
  // If no, what is the main reason for not having a resident permit?
  no_resident_permit: string | undefined,
  // Enter passport series
  passport_serial: string | undefined,
  // Enter passport number
  passport_number: string | undefined,
  // What is your Tax ID?
  your_id: string | undefined,
  // Enter registration address
  registration_address: string | undefined,
  // Confirm phone number of person receiving MPCA
  confirm_phone: string | undefined,
  // What is your area of origin prior to displacement? (Select Oblast)
  area_of_origin: Opt<'area_of_origin'>,
  // What is your preferred payment method?
  What_is_your_preferred_payment: Opt<'What_is_your_preferred_payment'>,
  // If banks are not an option, for what reason?
  reason: Opt<'reason'>[],
  // If none of the options are available, please specify the reason
  specify: string | undefined,
  // Are you currently enrolled in any social protection assistance?
  Are_you_currently_enrolled_in_: Opt<'Are_you_currently_enrolled_in_'>,
  // Have you received your social protection benefits in the last 3 months?
  Have_you_received_yo_in_the_last_3_months: Opt<'Have_you_received_yo_in_the_last_3_months'>,
  // Are you able to provide information on which social protection assistance programe you are enrolled in?
  Are_you_able_to_provide_inform: Opt<'Are_you_able_to_provide_inform'>,
  // Please select all the social protection assistance programs you are currently enrolled in
  Please_select_all_th_urrently_enrolled_in: Opt<'Please_select_all_th_urrently_enrolled_in'>[],
  // Were you enrolled to these social assistance benefits before February 2022?
  Were_you_enrolled_to_before_February_2022: Opt<'Were_you_enrolled_to_before_February_2022'>,
  // We would now like to ask you some questions about shelter, NFI and protection. Do you agree to proceed with the additional questions?
  We_would_now_like_to_ask_you_s: Opt<'We_would_now_like_to_ask_you_s'>,
  // Are you currently paying for rent?
  rent: Opt<'confirm_truth'>,
  // Do you anticipate that your household will need to pay rent next month?
  rent_2: Opt<'confirm_truth'>,
  // Are you currently paying for any shelter repairs?
  repairs: Opt<'confirm_truth'>,
  // Do you anticipate that you need to pay for shelter repairs in the next month?
  repairs_2: Opt<'confirm_truth'>,
  // Do you provide DRC consent to take photos or copies of your personal documentation at this time? Following DRC Data Protection Protocols and Ukraine Law on Data Protection, we will not share copies or photos of your documents with anyone outside DRC and these will only be used for the sole purpose of processing your information in order to provide you with cash assistance. You can decide to say no at this time and we will need to collect your documents at a later point in time.
  consent_document: Opt<'consent_document'>,
  // Does the respondent have personal documentation? (passport or IDP certificate)
  Does_the_respondent_have_perso: Opt<'Does_the_respondent_have_perso'>,
  // Photo of IDP Certificate
  Photo_of_IDP_Certificate: string,
  // Photo of ITN Certificate
  Photo_of_IDP_Certificate_001: string,
  // Photo of IBAN
  Photo_of_IBAN: string,
  // Photo of Passport 1st page
  photo_reg_passport: string,
  // Photo of Registration Page in Passport
  photo_reg_passport_001: string,
  // Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter and protection in order to see if you are eligible for other type of assistance, and proceed with the NFI distribution. Do you agree to proceed with the additional questions?
  not_eligible_note: Opt<'not_eligible_note'>,
  // Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter and protection in order to see if you are eligible for other type of assistance, and proceed with the NFI distribution. Do you agree to proceed with the additional questions?
  not_eligible_note2: Opt<'not_eligible_note2'>,
  // Are you currently paying for rent?
  cfr_no_mpca: Opt<'cfr_no_mpca'>,
  // Do you anticipate that your household will need to pay rent next month?
  cfr_no_mpca_2: Opt<'cfr_no_mpca_2'>,
  // Are you currently paying any shelter repairs?
  Are_you_currently_pa_any_shelter_repairs: Opt<'Are_you_currently_pa_any_shelter_repairs'>,
  // Do you anticipate that your household will need to pay for shelter repairs next month?
  Do_you_anticipate_th_r_repairs_next_month: Opt<'Do_you_anticipate_th_r_repairs_next_month'>,
  // Do you confirm that all of the information you have provided is true and accurate?
  confirm_truth: Opt<'confirm_truth'>,
  // DRC staff member ONLY - Can this person provide an e-signature?
  consent_to_esign: Opt<'consent_to_esign'>,
  // In accordance with the Law of Ukraine "On the Protection of Personal Data" No. 2297-IV of June 1, 2010, we will need your consent for the following statement: "I give consent to the Representative Office of the Danish Refugee Council in Ukraine for the processing, use, access, distribution and transfer of my personal data to third parties that I provide about myself. The purpose of processing personal data to ensure the implementation of Assistance Programs.
  consent_signature_payment: string,
}