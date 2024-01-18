import {Bn_ReOptions} from './Bn_ReOptions'

type Opt<T extends keyof typeof Bn_ReOptions> = keyof (typeof Bn_ReOptions)[T]

// Form id: aKgX4MNs6gCemDQKPeXxY8
export interface Bn_Re {
  start: string,
  end: string,
  // [note] **Unique ID/Case Number**
  back_un_id: string,
  // [select_one] 1.1 Select Office
  back_office: undefined | Opt<'back_office'>,
  // [select_one] 1.2 Enumerator
  back_enum: undefined | Opt<'back_enum'>,
  // [select_multiple] 1.3 Programme Type
  back_prog_type: undefined | Opt<'back_prog_type'>[],
  // [select_one] 1.3.1 Which donor for MPCA
  donor_mpca: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.2 Which donor for NFI
  donor_nfi: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.3 Which donor for Emergency Shelter Kit
  donor_esk: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.4 Which donor for Cash for Rent
  donor_cfr: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.5 Which donor for Cash for Fuel
  donor_cff: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.6 Which donor for Cash for Education
  donor_cfe: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.7 Which donor for Infant Winterclothing Kit
  donor_iwk: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.8 Which donor for Infant Hygiene Kit
  donor_ihk: undefined | Opt<'back_donor'>,
  // [select_one] 1.3.9 Which donor for Cash for Utilities
  donor_cfu: undefined | Opt<'back_donor'>,
  // [select_multiple] 1.4 Selected Project & Donor
  back_donor: undefined | Opt<'back_donor'>[],
  calc_prog_type_mpca: string,
  calc_prog_type_cfr: string,
  calc_prog_type_nfi: string,
  calc_prog_type_cfe: string,
  calc_prog_type_esk: string,
  calc_prog_type_iwk: string,
  // [calculate] type_ihk
  calc_prog_type_iwk_001: string,
  calc_prog_type_csf: string,
  // [select_one] 1.5.1 Was this case an internal DRC referral?
  back_refer: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 1.5.2 From which Department was the referral?
  back_refer_who: undefined | Opt<'back_refer_who'>,
  // [select_one] 1.6.1 Consent
  back_consent: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] 1.6.2 Can you please give the reason for why you do not wish to consent to the questionnaire?
  back_consen_no_reas: string | undefined,
  // [note] Thank you very much for your time, we will not proceed with the questionnaire without your consent.
  back_consent_no_note: string,
  // [text] 2.1 What is your surname name (as shown in personal ID)?
  ben_det_surname: string | undefined,
  // [text] 2.2 What is your first name (as shown in personal ID)?
  ben_det_first_name: string | undefined,
  // [text] 2.3 What is your patronymic name?
  ben_det_pat_name: string | undefined,
  // [integer] 2.4 What is your phone number?
  ben_det_ph_number: number | undefined,
  // [select_one] 2.5.1 Select oblast where registration is taking place
  ben_det_oblast: undefined | Opt<'ben_det_prev_oblast'>,
  // [select_one] 2.5.2 Select raion where registration is taking place
  ben_det_raion: undefined | Opt<'ben_det_raion'>,
  // [select_one] 2.5.3 Select hromada where registration is taking place
  ben_det_hromada: undefined | Opt<'ben_det_hromada'>,
  // [select_one_from_file] 2.5.4 Select settlement where registration is taking place
  ben_det_settlement: string,
  // [select_one] 2.5.5 Select residential status
  ben_det_res_stat: undefined | Opt<'ben_det_res_stat'>,
  // [select_one] 2.5.6 What is your area of origin prior to displacement? (Select Oblast)
  ben_det_prev_oblast: undefined | Opt<'ben_det_prev_oblast'>,
  // [integer] 2.6 What was the total value in UAH of all the resources your household received in the last one month?
  ben_det_income: number | undefined,
  // [integer] 2.7.1 Indicate the total number of people in your household, including the HHH
  ben_det_hh_size: number | undefined,
  // [select_one] 3.1.1 Are you the head of your household?
  hh_char_hhh: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 3.1.2 Select gender of respondent?
  hh_char_res_gender: undefined | Opt<'hh_char_hh_det_gender'>,
  // [integer] 3.1.3 Age of Respondent
  hh_char_res_age: number | undefined,
  // [select_one] 3.1.4 What is the gender of head of household?
  hh_char_hhh_gender: undefined | Opt<'hh_char_hh_det_gender'>,
  // [integer] 3.1.5 What is the age of the Head of Household?
  hh_char_hhh_age: number | undefined,
  // [select_one] 3.1.6 What is the civil status of the Head of Household?
  hh_char_civ_stat: undefined | Opt<'hh_char_civ_stat'>,
  // [select_one] 3.1.7 Is there anyone in the household who receives a pension?
  hh_char_pensioner: undefined | Opt<'pay_det_tax_exempt'>,
  calc_char_civ_stat: string,
  // [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
  hh_char_chh: string,
  // [begin_repeat] 3.1.7 HH Members
  hh_char_hh_det: {hh_char_hh_det_gender: Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined,calc_u18: string | undefined,calc_o60: string | undefined,calc_ed_age: string | undefined,calc_baby_age: string | undefined,calc_preg: string | undefined}[] | undefined,
  calc_tot_chi: string,
  calc_tot_ed_age: string,
  calc_tot_eld: string,
  // [select_one] 3.2 Are any of the females in the household pregnat or lactating?
  hh_char_preg: undefined | Opt<'pay_det_tax_exempt'>,
  // [note] **3.3 The next set of questions ask about difficulties you or members of your household may have doing certain activities. These questions only relates to household members over the age of 5 years old.**
  hh_char_dis_note: string,
  // [select_multiple] 3.3.1 Please select any of the below that apply to you or a member of your household
  hh_char_dis_select: undefined | Opt<'hh_char_dis_select'>[],
  // [select_one] 3.3.2 What is the level of difficulty for the selected options in the previous questions?
  hh_char_dis_level: undefined | Opt<'hh_char_dis_level'>,
  calc_dis_level: string,
  // [select_one] 3.4 Do you or anyone in your household receive financial assistance from the government or other agencies?
  receive_financial_assistance: undefined | Opt<'pay_det_tax_exempt'>,
  // [note] **Based on minimum standards this house is eligible for:**
  eligibility_summary_nfi: string,
  // [note] **1** Family Hygiene Kit (HKMV)
  nfi_fam_hy_1: string,
  // [note] **2** Family Hygiene Kits (HKMV)
  nfi_fam_hy_2: string,
  // [note] **3** Family Hygiene Kits (HKMV)
  nfi_fam_hy_3: string,
  // [note] **1** Family NFI Kit (NFKF + KS)
  nfi_fam_nfi_1: string,
  // [note] **2** Family NFI Kits (NFKF + KS)
  nfi_fam_nfi_2: string,
  // [note] **3** Family NFI Kits (NFKF + KS)
  nfi_fam_nfi_3: string,
  // [note] **1** Baby Hygiene Kit (BK)
  ihk_nfi: string,
  // [note] **1** Baby Winter Kit (WKB)
  iwk_nfi: string,
  // [select_one] Did you distribute the NFI Kits at the point of registration
  nfi_kit_disitrbuted: undefined | Opt<'pay_det_tax_exempt'>,
  // [note] **How many of the following kits have been distributed?**
  nfi_dist_label: string,
  // [integer] Family Hygiene Kits (HKF)
  nfi_dist_hkf: number | undefined,
  // [integer] Family Hygiene Kits for IDPs on the Move distributed (HKMV)
  nfi_dist_hkmv: number | undefined,
  // [integer] Family NFI kits distributed (NFKF + KS)
  nfi_dist_hkf_001: number | undefined,
  // [integer] Baby Kits distributed (BK)
  nfi_dist_bk: number | undefined,
  // [integer] Baby Winter Kits S distributed (WKB1)
  nfi_dist_wkb1: number | undefined,
  // [integer] Baby Winter Kits M distributed (WKB2)
  nfi_dist_wkb2: number | undefined,
  // [integer] Baby Winter Kits L distributed (WKB3)
  nfi_dist_wkb3: number | undefined,
  // [integer] Baby Winter Kits XL distributed (WKB4)
  nfi_dist_wkb4: number | undefined,
  // [integer] NFI Kit for Collective Center distributed
  nfi_kit_cc: number | undefined,
  // [integer] Folding Beds distributed
  nfi_bed: number | undefined,
  // [select_one] 4.1 Is there damage to your current shelter?
  shelter_damage: undefined | Opt<'shelter_damage'>,
  // [note] If there is heavy damage to this property, please refer to the shelter team immediately
  note_heavy_damage: string,
  // [integer] 4.2 Can you estimate the square meter or roof or window that is damaged?
  estimate_sqm_damage: number | undefined,
  // [note] Based upon the answers above, the household is eligible for the following:
  eligibility_summary_esk: string,
  // [note] This household is eligble for One Emergency Shelter kit
  note_eligible_1: string,
  // [note] This household is eligble for Two Emergency Shelter Kits
  note_eligible_2: string,
  // [select_one] Are you currently receiving Government financial assistance to cover your fuel/utilities payment needs?
  current_gov_assist_cff: undefined | Opt<'current_gov_assist_cff'>,
  // [select_one] This year, is your primary source of heating from mains utilities (e.g. Piped gas, electric, community heating) or solid fuel (Wood, pellets, charcoal, coal etc)
  utilities_fuel: undefined | Opt<'utilities_fuel'>,
  // [select_multiple] What is your main source of heating from mains utilities?
  mains_utilities: undefined | Opt<'mains_utilities'>[],
  // [text] If "Other", please specify
  mains_utilities_other: string | undefined,
  // [select_multiple] What is your primary source of solid fuel heating?
  mains_fuel: undefined | Opt<'mains_fuel'>[],
  // [text] If "Other", please specify
  mains_fuel_other: string | undefined,
  // [select_one] Is there a functioning fuel delivery/supplier in your area?
  functioning_fuel_delivery: undefined | Opt<'functioning_fuel_delivery'>,
  // [select_one] 5.1 What is your current accommodation status?
  cfr_curr_accom: undefined | Opt<'cfr_curr_accom'>,
  // [select_one] 5.2 Do you intend to continue renting your current accommodation?
  cfr_rent_int: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.3 What is the status of your current rental accommodation?
  cfr_rent_stat: undefined | Opt<'cfr_rent_stat'>,
  // [select_one] 5.4 What is your future accomodation intentions?
  cfr_accom_int: undefined | Opt<'cfr_accom_int'>,
  // [select_one] 5.5 Are you currently receiving rent support from another organisation?
  cfr_prev_ass: undefined | Opt<'pay_det_tax_exempt'>,
  // [integer] 5.6.1 In square metres, what is the total space of your accommodation?
  cfr_accom_cond_occ_rat: number | undefined,
  // [select_one] 5.6.2 Is your dwelling water proof?
  cfr_accom_cond_wat_pr: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.6.3 Do you have access to running water
  cfr_accom_cond_run_wat: undefined | Opt<'cfr_accom_cond_heat'>,
  // [select_one] 5.6.4 Do you have access to hot water
  cfr_accom_cond_hot_wat: undefined | Opt<'cfr_accom_cond_heat'>,
  // [select_one] 5.6.5 Do you have access to adequate washing facilities?
  cfr_accom_cond_wash: undefined | Opt<'cfr_accom_cond_heat'>,
  // [select_one] 5.6.6 Do you have access to adequate sanitation facilities?
  cfr_accom_cond_san: undefined | Opt<'cfr_accom_cond_heat'>,
  // [select_one] 5.6.7 Do you have access to adequate heating?
  cfr_accom_cond_heat: undefined | Opt<'cfr_accom_cond_heat'>,
  // [select_one] 5.6.8 Does your property have draft proofing?
  cfr_accom_cond_draft: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.6.9 Is your property adequately insulated?
  cfr_accom_cond_insul: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.6.10 Does your property have double-glazed windows?
  cfr_accom_cond_glaz: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.6.11 Does you have formal written agreement of tenancy with your landlord?
  cfr_accom_cond_ten: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.6.12 Do you have access to external locked doors on your property?
  cfr_accom_cond_lock_doors: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 5.6.13 Does your houeshold have access to private space (space you don’t share with other households)
  cfr_accom_cond_pri_sp: undefined | Opt<'pay_det_tax_exempt'>,
  // [note] **Based upon your previous answers you will now be informed of your inclusion/exclusion in any cash based programs you have been assessed for.**
  ass_inc_note: string,
  calc_vulnerability: string,
  calc_gen_mpca_inc: string,
  // [note] **You have met the critera for inclusion in the cash assistance programme. We will conduct further internal checks and revert to you with a final result.** <span style="color: red">Do not read this out to the household</span>
  ass_inc_mpca_inc: string,
  // [note] The provisional calculated total benefit for this household (HH Size × UAH 3,600 × 3 Months) will be UAH <span style="color: red">Do not read this out to the household</span>
  ass_inc_mpca_ben: string,
  // [note] **Unfortunately based upon our criteria, you do not qualify for the cash assistance program as you do not meet the threshold for vulnerability.**
  ass_inc_mpca_not_vul: string,
  // [note] Based upon your answers above, you are entitled to Cash for Education grant
  ass_inc_cfe_inc: string,
  // [note] You are entitled a Cash for Education Grant of UAH:
  ass_inc_cfe_ben: string,
  // [note] You are not entitled to a Cash for Education Grant.
  ass_inc_cfe_not_inc: string,
  calc_gen_cfr_vul: string,
  calc_gen_cfr_inc: string,
  // [note] You have met the criteria for inclusion in the cash for rent program
  ass_inc_cfr_inc: string,
  // [note] Your provisional cash for rent benefit will be a monthly payment of UAH:
  ass_inc_cfr_ben: string,
  // [note] You will also receive an additional one-off top-up grant of UAH:
  ass_inc_cfr_top_up: string,
  // [note] Unfortunatley based upon our criteria, you not not meet the requirements for cash for rent support
  ass_inc_cfr_not_inc: string,
  calc_vulnerability_cff: string,
  calc_gen_cff_inc: string,
  // [note] **You have met the critera for inclusion in the cash for fuel assistance programme. We will conduct further internal checks and revert to you with a final result.** <span style="color: red">Do not read this out to the household</span>
  ass_inc_cff_inc: string,
  // [note] **Unfortunately based upon our criteria, you do not qualify for the cash for fuel assistance program as you do not meet the threshold for vulnerability.**
  ass_inc_cff_not_vul: string,
  // [select_one] 7.0 Thank you for answering the questions above, are you willing to provide your payment details?
  pay_consent: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 7.1 What form of ID do you have?
  pay_det_id_type: undefined | Opt<'pay_det_id_type'>,
  // [text] 7.1.1 What other form of ID do you have?
  pay_det_id_type_oth: string | undefined,
  // [text] 7.2.1 Input Passport Series
  pay_det_pass_ser: string | undefined,
  // [text] 7.2.2 Number of ID
  pay_det_pass_num: string | undefined,
  // [image] 7.2.3 Take a photo of the ID
  pay_det_id_ph: string,
  // [select_one] 7.3.1 Do you have an individual tax number (TIN)?
  pay_det_tax_id_yn: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] 7.3.2 What is your individual tax number?
  pay_det_tax_id_num: string | undefined,
  // [image] 7.3.3 Take a photo of the Tax ID
  pay_det_tax_id_ph: string,
  // [select_one] 7.3.4 Do you have a tax exemptions?
  pay_det_tax_exempt: undefined | Opt<'pay_det_tax_exempt'>,
  // [image] 7.3.5 Take a photo of the proof of the tax of exemptions
  pay_det_tax_exempt_im: string,
  // [select_one] 7.4.1 What is your preferred payment method?
  pay_det_pay_meth: undefined | Opt<'pay_det_pay_meth'>,
  // [text] 7.4.2 What is your IBAN number?
  pay_det_iban: string | undefined,
  // [image] 7.4.3 Take a picture of IBAN number if available
  pay_det_iban_im: string,
  // [text] 7.4.4 Your address
  pay_address: string | undefined,
  // [text] 7.4.5 Your ZIP code
  pay_zip: string | undefined,
  // [image] 7.4.6 Take a picture of the address page of passport
  pay_det_add_im: string,
  // [text] 7.4.7 What other Payment methods do you prefer?
  pay_det_pay_meth_oth: string | undefined,
  // [text] 7.4.8 Can you highlight the main reason that none of these payment methods are suitable to you?
  pay_det_pay_meth_none: string | undefined,
  // [text] 8.1 Other Comments from Respondent
  fin_det_res: string | undefined,
  // [text] 8.2 Other Comments from Enumerator
  fin_det_enum: string | undefined,
  // [image] 8.3 Please take picture of any other relevant document
  fin_det_oth_doc_im: string,
}