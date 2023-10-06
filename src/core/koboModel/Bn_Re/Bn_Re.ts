import {bn_ReOptions} from './Bn_ReOptions'

type Opt<T extends keyof typeof bn_ReOptions> = keyof (typeof bn_ReOptions)[T]

export interface Bn_Re {
  start: string,
  end: string,
  // 1.1 Select Office
  back_office: Opt<'back_office'>,
  // 1.2 Enumerator
  back_enum: Opt<'back_enum'>,
  // 1.3 Project & Donor
  back_donor: Opt<'back_donor'>,
  // 1.4 Programme Type
  back_prog_type: Opt<'back_prog_type'>[],
  // 1.5.1 Was this case an internal DRC referral?
  back_refer: Opt<'pay_det_tax_exempt'>,
  // 1.5.2 From which Department was the referral?
  back_refer_who: Opt<'back_refer_who'>,
  // 1.6.1 Consent
  back_consent: Opt<'pay_det_tax_exempt'>,
  // 1.6.2 Can you please give the reason for why you do not wish to consent to the questionnaire?
  back_consen_no_reas: string | undefined,
  // 2.1 What is your surname name (as shown in personal ID)?
  ben_det_surname: string | undefined,
  // 2.2 What is your first name (as shown in personal ID)?
  ben_det_first_name: string | undefined,
  // 2.3 What is your patronymic name?
  ben_det_pat_name: string | undefined,
  // 2.4 What is your phone number?
  ben_det_ph_number: number | undefined,
  // 2.5.1 Select oblast where registration is taking place
  ben_det_oblast: Opt<'ben_det_prev_oblast'>,
  // 2.5.2 Select raion where registration is taking place
  ben_det_raion: Opt<'ben_det_raion'>,
  // 2.5.3 Select hromada where registration is taking place
  ben_det_hromada: Opt<'ben_det_hromada'>,
  // 2.5.4 Select settlement where registration is taking place
  ben_det_settlement: string,
  // 2.5.5 Select residential status
  ben_det_res_stat: Opt<'ben_det_res_stat'>,
  // 2.5.6 What is your area of origin prior to displacement? (Select Oblast)
  ben_det_prev_oblast: Opt<'ben_det_prev_oblast'>,
  // 2.6 What was the total value in UAH of all the resources your household received in the last one month?
  ben_det_income: number | undefined,
  // 2.7.1 Indicate the total number of people in your household, including the HHH
  ben_det_hh_size: number | undefined,
  // 3.1.1 Are you the head of your household?
  hh_char_hhh: Opt<'pay_det_tax_exempt'>,
  // 3.1.2 Select gender of respondent?
  hh_char_res_gender: Opt<'hh_char_hh_det_gender'>,
  // 3.1.3 Age of Respondent
  hh_char_res_age: number | undefined,
  // 3.1.4 What is the gender of head of household?
  hh_char_hhh_gender: Opt<'hh_char_hh_det_gender'>,
  // 3.1.5 What is the age of the Head of Household?
  hh_char_hhh_age: number | undefined,
  // 3.1.6 What is the civil status of the Head of Household?
  hh_char_civ_stat: Opt<'hh_char_civ_stat'>,
  // 3.1.7 HH Members
  hh_char_hh_det: {hh_char_hh_det_gender: Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined,calc_u18: string | undefined,calc_o60: string | undefined,calc_ed_age: string | undefined,calc_baby_age: string | undefined,calc_preg: string | undefined}[] | undefined,
  // 3.2 Are any of the females in the household pregnat or lactating?
  hh_char_preg: Opt<'pay_det_tax_exempt'>,
  // 3.3.1 Please select any of the below that apply to you or a member of your household
  hh_char_dis_select: Opt<'hh_char_dis_select'>[],
  // 3.3.2 What is the level of difficulty for the selected options in the previous questions?
  hh_char_dis_level: Opt<'hh_char_dis_level'>,
  // Did you distribute the NFI Kits at the point of registration
  nfi_kit_disitrbuted: Opt<'pay_det_tax_exempt'>,
  // Family Hygiene Kits (HKF)
  nfi_dist_hkf: number | undefined,
  // Family Hygiene Kits for IDPs on the Move distributed (HKMV)
  nfi_dist_hkmv: number | undefined,
  // Family NFI kits distributed (NFKF + KS)
  nfi_dist_hkf_001: number | undefined,
  // Baby Kits distributed (BK)
  nfi_dist_bk: number | undefined,
  // Baby Winter Kits S distributed (WKB1)
  nfi_dist_wkb1: number | undefined,
  // Baby Winter Kits M distributed (WKB2)
  nfi_dist_wkb2: number | undefined,
  // Baby Winter Kits L distributed (WKB3)
  nfi_dist_wkb3: number | undefined,
  // Baby Winter Kits XL distributed (WKB4)
  nfi_dist_wkb4: number | undefined,
  // 4.1 Is there damage to your current shelter?
  shelter_damage: Opt<'shelter_damage'>,
  // 4.2 Can you estimate the square meter or roof or window that is damaged?
  estimate_sqm_damage: number | undefined,
  // 5.1 What is your current accommodation status?
  cfr_curr_accom: Opt<'cfr_curr_accom'>,
  // 5.2 Do you intend to continue renting your current accommodation?
  cfr_rent_int: Opt<'pay_det_tax_exempt'>,
  // 5.3 What is the status of your current rental accommodation?
  cfr_rent_stat: Opt<'cfr_rent_stat'>,
  // 5.4 What is your future accomodation intentions?
  cfr_accom_int: Opt<'cfr_accom_int'>,
  // 5.5 Are you currently receiving rent support from another organisation?
  cfr_prev_ass: Opt<'pay_det_tax_exempt'>,
  // 5.6.1 In square metres, what is the total space of your accommodation?
  cfr_accom_cond_occ_rat: number | undefined,
  // 5.6.2 Is your dwelling water proof?
  cfr_accom_cond_wat_pr: Opt<'pay_det_tax_exempt'>,
  // 5.6.3 Do you have access to running water
  cfr_accom_cond_run_wat: Opt<'cfr_accom_cond_heat'>,
  // 5.6.4 Do you have access to hot water
  cfr_accom_cond_hot_wat: Opt<'cfr_accom_cond_heat'>,
  // 5.6.5 Do you have access to adequate washing facilities?
  cfr_accom_cond_wash: Opt<'cfr_accom_cond_heat'>,
  // 5.6.6 Do you have access to adequate sanitation facilities?
  cfr_accom_cond_san: Opt<'cfr_accom_cond_heat'>,
  // 5.6.7 Do you have access to adequate heating?
  cfr_accom_cond_heat: Opt<'cfr_accom_cond_heat'>,
  // 5.6.8 Does your property have draft proofing?
  cfr_accom_cond_draft: Opt<'pay_det_tax_exempt'>,
  // 5.6.9 Is your property adequately insulated?
  cfr_accom_cond_insul: Opt<'pay_det_tax_exempt'>,
  // 5.6.10 Does your property have double-glazed windows?
  cfr_accom_cond_glaz: Opt<'pay_det_tax_exempt'>,
  // 5.6.11 Does you have formal written agreement of tenancy with your landlord?
  cfr_accom_cond_ten: Opt<'pay_det_tax_exempt'>,
  // 5.6.12 Do you have access to external locked doors on your property?
  cfr_accom_cond_lock_doors: Opt<'pay_det_tax_exempt'>,
  // 5.6.13 Does your houeshold have access to private space (space you don’t share with other households)
  cfr_accom_cond_pri_sp: Opt<'pay_det_tax_exempt'>,
  // 7.0 Thank you for answering the questions above, are you willing to provide your payment details?
  pay_consent: Opt<'pay_det_tax_exempt'>,
  // 7.1 What form of ID do you have?
  pay_det_id_type: Opt<'pay_det_id_type'>,
  // 7.1.1 What other form of ID do you have?
  pay_det_id_type_oth: string | undefined,
  // 7.2.1 Input Passport Series
  pay_det_pass_ser: string | undefined,
  // 7.2.2 Number of ID
  pay_det_pass_num: string | undefined,
  // 7.2.3 Take a photo of the ID
  pay_det_id_ph: string,
  // 7.3.1 Do you have an individual tax number (TIN)?
  pay_det_tax_id_yn: Opt<'pay_det_tax_exempt'>,
  // 7.3.2 What is your individual tax number?
  pay_det_tax_id_num: string | undefined,
  // 7.3.3 Take a photo of the Tax ID
  pay_det_tax_id_ph: string,
  // 7.3.4 Do you have a tax exemptions?
  pay_det_tax_exempt: Opt<'pay_det_tax_exempt'>,
  // 7.3.5 Take a photo of the proof of the tax of exemptions
  pay_det_tax_exempt_im: string,
  // 7.4.1 What is your preferred payment method?
  pay_det_pay_meth: Opt<'pay_det_pay_meth'>,
  // 7.4.2 What is your IBAN number?
  pay_det_iban: string | undefined,
  // 7.4.3 Take a picture of IBAN number if available
  pay_det_iban_im: string,
  // 7.4.4 Your address
  pay_address: string | undefined,
  // 7.4.5 Your ZIP code
  pay_zip: string | undefined,
  // 7.4.6 Take a picture of the address page of passport
  pay_det_add_im: string,
  // 7.4.7 What other Payment methods do you prefer?
  pay_det_pay_meth_oth: string | undefined,
  // 7.4.8 Can you highlight the main reason that none of these payment methods are suitable to you?
  pay_det_pay_meth_none: string | undefined,
  // 8.1 Other Comments from Respondent
  fin_det_res: string | undefined,
  // 8.2 Other Comments from Enumerator
  fin_det_enum: string | undefined,
  // 8.3 Please take picture of any other relevant document
  fin_det_oth_doc_im: string,
}