import {RapidResponseMechanismOptions} from './RapidResponseMechanismOptions'

type Opt<T extends keyof typeof RapidResponseMechanismOptions> = keyof (typeof RapidResponseMechanismOptions)[T]

export interface RapidResponseMechanism {
  start: string,
  end: string,
  // [select_one] Select the form length
  form_length: undefined | Opt<'form_length'>,
  // [select_one] Do you have approval to use the short tool?
  form_approval: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [note] **Unique ID/Case Number**
  back_un_id: string,
  // [select_one] Please select the shock(s)
  shock: undefined | Opt<'shock'>,
  // [select_multiple] Programme Type
  back_prog_type: undefined | Opt<'back_prog_type'>[],
  // [select_one] 1.3 Project & Donor
  back_donor: undefined | Opt<'back_donor'>,
  // [text] What is your surname name (as shown in personal ID)?
  ben_det_surname: string | undefined,
  // [text] What is your first name (as shown in personal ID)?
  ben_det_first_name: string | undefined,
  // [text] What is your patronymic name?
  ben_det_pat_name: string | undefined,
  // [integer] What is your phone number?
  ben_det_ph_number: number | undefined,
  // [select_one] Do you give permission to contact you in the future for any additional questions?
  consent_contact: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] Select oblast where registration is taking place
  ben_det_oblast: undefined | Opt<'ben_det_prev_oblast_l'>,
  // [select_one] Select raion where registration is taking place
  ben_det_raion: undefined | Opt<'ben_det_raion_l'>,
  // [select_one] Select hromada where registration is taking place
  ben_det_hromada: undefined | Opt<'ben_det_hromada_l'>,
  // [geopoint] GPS Coordinates
  gps_coordinates: string,
  // [integer] Indicate the total number of people in your household, including the HHH
  ben_det_hh_size: number | undefined,
  // [select_one] What is the level of damage?
  level_damage: undefined | Opt<'level_damage'>,
  // [integer] What is the number of broken/ damaged windows?
  windows: number | undefined,
  // [integer] What is the number of broken/ damaged doors?
  doors: number | undefined,
  // [integer] Estimation of the area of damaged roof?
  estimation_roof: number | undefined,
  // [integer] Estimation of the area of damaged walls?
  estimation_walls: number | undefined,
  // [image] Photo of damage
  img_dmg: string,
  // [image] Photo of act of damage
  img_act_of_dmg: string,
  // [text] Comment
  shelter_comment: string | undefined,
  // [select_one] What form of ID do you have?
  pay_det_id_type: undefined | Opt<'pay_det_id_type'>,
  // [text] Input Passport Series
  pay_det_pass_ser: string | undefined,
  // [text] Number of ID
  pay_det_pass_num: string | undefined,
  // [image] Take a photo of the ID
  pay_det_id_ph: string,
  // [text] What is your individual tax number?
  pay_det_tax_id_num: string | undefined,
  // [image] Take a photo of the Tax ID
  pay_det_tax_id_ph: string,
  // [select_one] What is your preferred payment method?
  pay_det_pay_meth: undefined | Opt<'pay_det_pay_meth'>,
  // [text] What is your IBAN number?
  pay_det_iban: string | undefined,
  // [image] Take a picture of IBAN number if available
  pay_det_iban_im: string,
  // [text] Your address
  pay_address: string | undefined,
  // [text] Your ZIP code
  pay_zip: string | undefined,
  // [image] Take a picture of the address page of passport
  pay_det_add_im: string,
  // [text] What other Payment methods do you prefer?
  pay_det_pay_meth_oth: string | undefined,
  // [text] Can you highlight the main reason that none of these payment methods are suitable to you?
  pay_det_pay_meth_none: string | undefined,
  hkf_count: string,
  hkmv_count: string,
  // [note] **How many of the following kits have been distributed?**
  nfi_dist_label: string,
  // [integer] Family Hygiene Kits (HKF)
  nfi_dist_hkf: number | undefined,
  // [integer] Family Hygiene Kits for IDPs on the Move distributed (HKMV)
  nfi_dist_hkmv: number | undefined,
  // [integer] Family NFI Kit (including Kitchen Set)
  nfi_dist_hkf_001: number | undefined,
  // [note] **Unique ID/Case Number**
  back_un_id_l: string,
  // [select_one] 1.1 Select Office
  back_office_l: undefined | Opt<'back_office_l'>,
  // [select_one] 1.2 Enumerator
  back_enum_l: undefined | Opt<'back_enum_l'>,
  // [select_one] 1.3 Project & Donor
  back_donor_l: undefined | Opt<'back_donor_l'>,
  // [select_multiple] 1.4 Programme Type
  back_prog_type_l: undefined | Opt<'back_prog_type_l'>[],
  calc_prog_type_mpca_l: string,
  calc_prog_type_cfr_l: string,
  calc_prog_type_nfi_l: string,
  calc_prog_type_cfe_l: string,
  calc_prog_type_esk_l: string,
  calc_prog_type_iwk_l: string,
  // [calculate] type_ihk
  calc_prog_type_iwk_001_l: string,
  // [select_one] 1.5.1 Was this case an internal DRC referral?
  back_refer_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 1.5.2 From which Department was the referral?
  back_refer_who_l: undefined | Opt<'back_refer_who_l'>,
  // [select_one] 1.6.1 Consent
  back_consent_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [text] 1.6.2 Can you please give the reason for why you do not wish to consent to the questionnaire?
  back_consen_no_reas_l: string | undefined,
  // [note] Thank you very much for your time, we will not proceed with the questionnaire without your consent.
  back_consent_no_note_l: string,
  // [text] 2.1 What is your surname name (as shown in personal ID)?
  ben_det_surname_l: string | undefined,
  // [text] 2.2 What is your first name (as shown in personal ID)?
  ben_det_first_name_l: string | undefined,
  // [text] 2.3 What is your patronymic name?
  ben_det_pat_name_l: string | undefined,
  // [integer] 2.4 What is your phone number?
  ben_det_ph_number_l: number | undefined,
  // [select_one] 2.5.1 Select oblast where registration is taking place
  ben_det_oblast_l: undefined | Opt<'ben_det_prev_oblast_l'>,
  // [select_one] 2.5.2 Select raion where registration is taking place
  ben_det_raion_l: undefined | Opt<'ben_det_raion_l'>,
  // [select_one] 2.5.3 Select hromada where registration is taking place
  ben_det_hromada_l: undefined | Opt<'ben_det_hromada_l'>,
  // [select_one_from_file] 2.5.4 Select settlement where registration is taking place
  ben_det_settlement_l: string,
  // [select_one] 2.5.5 Select residential status
  ben_det_res_stat_l: undefined | Opt<'ben_det_res_stat_l'>,
  // [select_one] 2.5.6 What is your area of origin prior to displacement? (Select Oblast)
  ben_det_prev_oblast_l: undefined | Opt<'ben_det_prev_oblast_l'>,
  // [integer] 2.6 What was the total value in UAH of all the resources your household received in the last one month?
  ben_det_income_l: number | undefined,
  // [integer] 2.7.1 Indicate the total number of people in your household, including the HHH
  ben_det_hh_size_l: number | undefined,
  // [select_one] 3.1.1 Are you the head of your household?
  hh_char_hhh_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 3.1.2 Select gender of respondent?
  hh_char_res_gender_l: undefined | Opt<'hh_char_hh_det_gender_l'>,
  // [integer] 3.1.3 Age of Respondent
  hh_char_res_age_l: number | undefined,
  // [select_one] 3.1.4 What is the gender of head of household?
  hh_char_hhh_gender_l: undefined | Opt<'hh_char_hh_det_gender_l'>,
  // [integer] 3.1.5 What is the age of the Head of Household?
  hh_char_hhh_age_l: number | undefined,
  // [select_one] 3.1.6 What is the civil status of the Head of Household?
  hh_char_civ_stat_l: undefined | Opt<'hh_char_civ_stat_l'>,
  calc_char_civ_stat_l: string,
  // [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
  hh_char_chh_l: string,
  // [begin_repeat] 3.1.7 HH Members
  hh_char_hh_det_l: {hh_char_hh_det_gender_l: undefined | Opt<'hh_char_hh_det_gender_l'> | undefined,hh_char_hh_det_age_l: number | undefined | undefined,calc_u18_l: string | undefined,calc_o60_l: string | undefined,calc_ed_age_l: string | undefined,calc_baby_age_l: string | undefined,calc_preg_l: string | undefined}[] | undefined,
  calc_tot_chi_l: string,
  calc_tot_ed_age_l: string,
  calc_tot_eld_l: string,
  // [select_one] 3.2 Are any of the females in the household pregnat or lactating?
  hh_char_preg_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [note] **3.3 The next set of questions ask about difficulties you or members of your household may have doing certain activities. These questions only relates to household members over the age of 5 years old.**
  hh_char_dis_note_l: string,
  // [select_multiple] 3.3.1 Please select any of the below that apply to you or a member of your household
  hh_char_dis_select_l: undefined | Opt<'hh_char_dis_select_l'>[],
  // [select_one] 3.3.2 What is the level of difficulty for the selected options in the previous questions?
  hh_char_dis_level_l: undefined | Opt<'hh_char_dis_level_l'>,
  calc_dis_level_l: string,
  // [note] **Based on minimum standards this house is eligible for:**
  eligibility_summary_nfi_l: string,
  // [note] **1** Family Hygiene Kit (HKMV)
  nfi_fam_hy_1_l: string,
  // [note] **2** Family Hygiene Kits (HKMV)
  nfi_fam_hy_2_l: string,
  // [note] **3** Family Hygiene Kits (HKMV)
  nfi_fam_hy_3_l: string,
  // [note] **1** Family NFI Kit (NFKF + KS)
  nfi_fam_nfi_1_l: string,
  // [note] **2** Family NFI Kits (NFKF + KS)
  nfi_fam_nfi_2_l: string,
  // [note] **3** Family NFI Kits (NFKF + KS)
  nfi_fam_nfi_3_l: string,
  // [note] **1** Baby Hygiene Kit (BK)
  ihk_nfi_l: string,
  // [note] **1** Baby Winter Kit (WKB)
  iwk_nfi_l: string,
  // [select_one] Did you distribute the NFI Kits at the point of registration
  nfi_kit_disitrbuted_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [note] **How many of the following kits have been distributed?**
  nfi_dist_label_l: string,
  // [integer] Family Hygiene Kits (HKF)
  nfi_dist_hkf_l: number | undefined,
  // [integer] Family Hygiene Kits for IDPs on the Move distributed (HKMV)
  nfi_dist_hkmv_l: number | undefined,
  // [integer] Family NFI kits distributed (NFKF + KS)
  nfi_dist_hkf_001_l: number | undefined,
  // [integer] Baby Kits distributed (BK)
  nfi_dist_bk_l: number | undefined,
  // [integer] Baby Winter Kits S distributed (WKB1)
  nfi_dist_wkb1_l: number | undefined,
  // [integer] Baby Winter Kits M distributed (WKB2)
  nfi_dist_wkb2_l: number | undefined,
  // [integer] Baby Winter Kits L distributed (WKB3)
  nfi_dist_wkb3_l: number | undefined,
  // [integer] Baby Winter Kits XL distributed (WKB4)
  nfi_dist_wkb4_l: number | undefined,
  // [select_one] 4.1 Is there damage to your current shelter?
  shelter_damage_l: undefined | Opt<'shelter_damage_l'>,
  // [note] If there is heavy damage to this property, please refer to the shelter team immediately
  note_heavy_damage_l: string,
  // [integer] 4.2 Can you estimate the square meter or roof or window that is damaged?
  estimate_sqm_damage_l: number | undefined,
  // [note] Based upon the answers above, the household is eligible for the following:
  eligibility_summary_esk_l: string,
  // [note] This household is eligble for One Emergency Shelter kit
  note_eligible_1_l: string,
  // [note] This household is eligble for Two Emergency Shelter Kits
  note_eligible_2_l: string,
  // [select_one] 5.1 What is your current accommodation status?
  cfr_curr_accom_l: undefined | Opt<'cfr_curr_accom_l'>,
  // [select_one] 5.2 Do you intend to continue renting your current accommodation?
  cfr_rent_int_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.3 What is the status of your current rental accommodation?
  cfr_rent_stat_l: undefined | Opt<'cfr_rent_stat_l'>,
  // [select_one] 5.4 What is your future accomodation intentions?
  cfr_accom_int_l: undefined | Opt<'cfr_accom_int_l'>,
  // [select_one] 5.5 Are you currently receiving rent support from another organisation?
  cfr_prev_ass_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [integer] 5.6.1 In square metres, what is the total space of your accommodation?
  cfr_accom_cond_occ_rat_l: number | undefined,
  // [select_one] 5.6.2 Is your dwelling water proof?
  cfr_accom_cond_wat_pr_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.6.3 Do you have access to running water
  cfr_accom_cond_run_wat_l: undefined | Opt<'cfr_accom_cond_heat_l'>,
  // [select_one] 5.6.4 Do you have access to hot water
  cfr_accom_cond_hot_wat_l: undefined | Opt<'cfr_accom_cond_heat_l'>,
  // [select_one] 5.6.5 Do you have access to adequate washing facilities?
  cfr_accom_cond_wash_l: undefined | Opt<'cfr_accom_cond_heat_l'>,
  // [select_one] 5.6.6 Do you have access to adequate sanitation facilities?
  cfr_accom_cond_san_l: undefined | Opt<'cfr_accom_cond_heat_l'>,
  // [select_one] 5.6.7 Do you have access to adequate heating?
  cfr_accom_cond_heat_l: undefined | Opt<'cfr_accom_cond_heat_l'>,
  // [select_one] 5.6.8 Does your property have draft proofing?
  cfr_accom_cond_draft_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.6.9 Is your property adequately insulated?
  cfr_accom_cond_insul_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.6.10 Does your property have double-glazed windows?
  cfr_accom_cond_glaz_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.6.11 Does you have formal written agreement of tenancy with your landlord?
  cfr_accom_cond_ten_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.6.12 Do you have access to external locked doors on your property?
  cfr_accom_cond_lock_doors_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 5.6.13 Does your houeshold have access to private space (space you don’t share with other households)
  cfr_accom_cond_pri_sp_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [note] **Based upon your previous answers you will now be informed of your inclusion/exclusion in any cash based programs you have been assessed for.**
  ass_inc_note_l: string,
  calc_vulnerability_l: string,
  calc_gen_mpca_inc_l: string,
  // [note] **You have met the critera for inclusion in the cash assistance programme. We will conduct further internal checks and revert to you with a final result.**
<span style="color: red">Do not read this out to the household</span>
  ass_inc_mpca_inc_l: string,
  // [note] The provisional calculated total benefit for this household (HH Size × UAH 2,220 × 3 Months) will be UAH
<span style="color: red">Do not read this out to the household</span>
  ass_inc_mpca_ben_l: string,
  // [note] **Unfortunately based upon our criteria, you do not qualify for the cash assistance program as you do not meet the threshold for vulnerability.**
  ass_inc_mpca_not_vul_l: string,
  // [note] Based upon your answers above, you are entitled to Cash for Education grant
  ass_inc_cfe_inc_l: string,
  // [note] You are entitled a Cash for Education Grant of UAH:
  ass_inc_cfe_ben_l: string,
  // [note] You are not entitled to a Cash for Education Grant.
  ass_inc_cfe_not_inc_l: string,
  calc_gen_cfr_vul_l: string,
  calc_gen_cfr_inc_l: string,
  // [note] You have met the criteria for inclusion in the cash for rent program
  ass_inc_cfr_inc_l: string,
  // [note] Your provisional cash for rent benefit will be a monthly payment of UAH:
  ass_inc_cfr_ben_l: string,
  // [note] You will also receive an additional one-off top-up grant of UAH:
  ass_inc_cfr_top_up_l: string,
  // [note] Unfortunatley based upon our criteria, you not not meet the requirements for cash for rent support
  ass_inc_cfr_not_inc_l: string,
  // [select_one] 7.0 Thank you for answering the questions above, are you willing to provide your payment details?
  pay_consent_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [select_one] 7.1 What form of ID do you have?
  pay_det_id_type_l: undefined | Opt<'pay_det_id_type_l'>,
  // [text] 7.1.1 What other form of ID do you have?
  pay_det_id_type_oth_l: string | undefined,
  // [text] 7.2.1 Input Passport Series
  pay_det_pass_ser_l: string | undefined,
  // [text] 7.2.2 Number of ID
  pay_det_pass_num_l: string | undefined,
  // [image] 7.2.3 Take a photo of the ID
  pay_det_id_ph_l: string,
  // [select_one] 7.3.1 Do you have an individual tax number (TIN)?
  pay_det_tax_id_yn_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [text] 7.3.2 What is your individual tax number?
  pay_det_tax_id_num_l: string | undefined,
  // [image] 7.3.3 Take a photo of the Tax ID
  pay_det_tax_id_ph_l: string,
  // [select_one] 7.3.4 Do you have a tax exemptions?
  pay_det_tax_exempt_l: undefined | Opt<'pay_det_tax_exempt_l'>,
  // [image] 7.3.5 Take a photo of the proof of the tax of exemptions
  pay_det_tax_exempt_im_l: string,
  // [select_one] 7.4.1 What is your preferred payment method?
  pay_det_pay_meth_l: undefined | Opt<'pay_det_pay_meth_l'>,
  // [text] 7.4.2 What is your IBAN number?
  pay_det_iban_l: string | undefined,
  // [image] 7.4.3 Take a picture of IBAN number if available
  pay_det_iban_im_l: string,
  // [text] 7.4.4 Your address
  pay_address_l: string | undefined,
  // [text] 7.4.5 Your ZIP code
  pay_zip_l: string | undefined,
  // [image] 7.4.6 Take a picture of the address page of passport
  pay_det_add_im_l: string,
  // [text] 7.4.7 What other Payment methods do you prefer?
  pay_det_pay_meth_oth_l: string | undefined,
  // [text] 7.4.8 Can you highlight the main reason that none of these payment methods are suitable to you?
  pay_det_pay_meth_none_l: string | undefined,
  // [text] 8.1 Other Comments from Respondent
  fin_det_res_l: string | undefined,
  // [text] 8.2 Other Comments from Enumerator
  fin_det_enum_l: string | undefined,
  // [image] 8.3 Please take picture of any other relevant document
  fin_det_oth_doc_im_l: string,
}