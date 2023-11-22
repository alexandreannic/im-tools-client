import {Ecrec_CashRegistrationOptions} from './Ecrec_CashRegistrationOptions'

type Opt<T extends keyof typeof Ecrec_CashRegistrationOptions> = keyof (typeof Ecrec_CashRegistrationOptions)[T]

// Form id: aE5md7RfHiy4LJmddoFAQH
export interface Ecrec_CashRegistration {
  start: string,
  end: string,
  // [select_one] 1.1 Select Office
  back_office: undefined | Opt<'back_office'>,
  // [select_one] 1.2 Enumerator
  back_enum: undefined | Opt<'back_enum'>,
  // [select_one] 1.3 Project
  back_donor: undefined | Opt<'back_donor'>,
  // [select_one] 1.4 Was this case an internal DRC referral?
  back_refer: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 1.4.1 From which Department was the referral?
  back_refer_who: undefined | Opt<'back_refer_who'>,
  // [select_one] 1.5 Consent
  back_consent: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] 1.5.1 Can you please give the reason for why you do not wish to consent to the questionnaire?
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
  calc_char_civ_stat: string,
  // [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
  hh_char_chh: string,
  // [begin_repeat] 3.1.7 HH Members
  hh_char_hh_det: {hh_char_hh_det_gender: undefined | Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined,calc_u18: string | undefined,calc_o60: string | undefined,calc_ed_age: string | undefined,calc_baby_age: string | undefined,calc_preg: string | undefined}[] | undefined,
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
  // [select_one] What is the primary livelihood in the household:
  what_primary_livelihood: undefined | Opt<'what_primary_livelihood'>,
  // [text] If "Other", please specify
  what_primary_livelihood_other: string | undefined,
  // [select_one] Do you consume a majority of the crops you produce / livestock that you manage:
  consume_majority: undefined | Opt<'pay_det_tax_exempt'>,
  // [decimal] How much land do you own:
  land_own: number | undefined,
  // [decimal] How much land do you cultivate or manage for crops and/or livestock:
  land_cultivate: number | undefined,
  // [select_one] Do you depend on farming to meet your basic needs?
  depend_basic_needs: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_multiple] If eligible for assistance, what agricultural inputs do you intend to purchase:
  eligible_assistance_agricultural: undefined | Opt<'eligible_assistance_agricultural'>[],
  // [text] If "Other", please specify
  eligible_assistance_agricultural_other: string | undefined,
  // [note] ##### How many of the following livestock do you have:
  not_many_livestock: string,
  // [integer] Sheep/goat:
  many_sheep_goat: number | undefined,
  // [integer] Milking/lactating cow:
  many_milking: number | undefined,
  // [integer] Dry cow:
  many_cow: number | undefined,
  // [integer] Pig:
  many_pig: number | undefined,
  // [integer] Poultry:
  many_poultry: number | undefined,
  cal_cost_sheep_goat: string,
  cal_cost_milking: string,
  cal_cost_cow: string,
  cal_cost_pig: string,
  cal_cost_poultry: string,
  cal_cost_all: string,
  cal_cost_450: string,
  // [note] Total amount of assistance required by the household: ${cal_cost_all}$
  not_cost_all: string,
  // [note] Total amount of assistance: ${cal_cost_450}$
  not_cost_assist: string,
  // [select_one] Do you face barriers in providing sufficient quality and quantity of feed to your livestock?
  barriers_providing_sufficient: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] If "Yes", please specify
  barriers_providing_sufficient_yes: string | undefined,
  // [select_multiple] If eligible for cash for animal feed, what animal feed do you intend to purchase?
  eligible_cash_feed: undefined | Opt<'eligible_cash_feed'>[],
  // [text] If "Other", please specify
  eligible_cash_feed_other: string | undefined,
  // [select_one] Is your animal shelter in need of rehabilitation?
  animal_shelter_need: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_multiple] If eligible for cash for animal shelter assistance, what building materials do you intend to purchase
  cash_animal_shelter: undefined | Opt<'cash_animal_shelter'>[],
  // [text] If "Other", please specify
  cash_animal_shelter_other: string | undefined,
  // [integer] In the last 7 days, what proportion of the overall household income was spent on food (human consumption)?
  income_spent_food: number | undefined,
  // [integer] In the last 7 days, what proportion of the overall household income was spent on non-food items and services such as health and education related services?
  income_spent_nonfood: number | undefined,
  // [select_one] In the last 30 days, did your household sell household assets/goods (furniture/household appliances (i.e. TV, radio, washing machine, etc.) smart phone/jewellery,...) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_sell_hh_assets: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household spend savings or сonsumed stocks "for a rainy day" due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_spent_savings: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household purchase food on credit or borrowed food  due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_forrowed_food: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household send household members to eat/live with another family or friends or eat at a food bank/soup kitchen/collective centre distributing food due to a lack of resources to cover to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_eat_elsewhere: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household sell productive assets or means of transport (sewing machine, bicycle, car, etc.) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_sell_productive_assets: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household reduce essential health expenditures (including drugs,) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities,  fuel for heating, drinking water, etc.)?
  lcs_reduce_health_expenditures: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household reduce essential education expenditures due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water,  etc.)?
  lcs_reduce_education_expenditures: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household sell house or land due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_sell_house: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your HH member(-s) move elsewhere in search of work due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_move_elsewhere: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household use degrading sources of income, illegal work, or high risk jobs due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_degrading_income_source: undefined | Opt<'lcs_ask_stranger'>,
  // [select_one] In the last 30 days, did your household have to ask strangers for money to cover essential needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
  lcs_ask_stranger: undefined | Opt<'lcs_ask_stranger'>,
  // [select_multiple] What were the main reasons why your household decided to use these strategies?
  lcs_reason: undefined | Opt<'lcs_reason'>[],
  // [text] If other, specify
  lcs_reason_other: string | undefined,
  // [note] Your information has been collected and will be reviewed in line with the selection and vulnerability criteria. We will reach out to you to provide decision on eligibility
  not_information: string,
  // [select_one] 6.0 Thank you for answering the questions above, are you willing to provide your payment details?
  pay_consent: undefined | Opt<'pay_det_tax_exempt'>,
  // [select_one] 6.1 What form of ID do you have?
  pay_det_id_type: undefined | Opt<'pay_det_id_type'>,
  // [text] 6.1.1 What other form of ID do you have?
  pay_det_id_type_oth: string | undefined,
  // [text] 6.2.1 Input Passport Series
  pay_det_pass_ser: string | undefined,
  // [text] 6.2.2 Number of ID
  pay_det_pass_num: string | undefined,
  // [image] 6.2.3 Take a photo of the ID
  pay_det_id_ph: string,
  // [select_one] 6.3.1 Do you have an individual tax number (TIN)?
  pay_det_tax_id_yn: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] 6.3.2 What is your individual tax number?
  pay_det_tax_id_num: string | undefined,
  // [image] 6.3.3 Take a photo of the Tax ID
  pay_det_tax_id_ph: string,
  // [select_one] 6.3.4 Do you have a tax exemptions?
  pay_det_tax_exempt: undefined | Opt<'pay_det_tax_exempt'>,
  // [image] 6.3.5 Take a photo of the proof of the tax of exemptions
  pay_det_tax_exempt_im: string,
  // [select_one] 6.4.1 What is your preferred payment method?
  pay_det_pay_meth: undefined | Opt<'pay_det_pay_meth'>,
  // [text] 6.4.2 What is your IBAN number?
  pay_det_iban: string | undefined,
  // [image] 6.4.3 Take a picture of IBAN number if available
  pay_det_iban_im: string,
  // [text] 6.4.4 Your address
  pay_address: string | undefined,
  // [text] 6.4.5 Your ZIP code
  pay_zip: string | undefined,
  // [image] 6.4.6 Take a picture of the address page of passport
  pay_det_add_im: string,
  // [text] 6.4.7 What other Payment methods do you prefer?
  pay_det_pay_meth_oth: string | undefined,
  // [text] 6.4.8 Can you highlight the main reason that none of these payment methods are suitable to you?
  pay_det_pay_meth_none: string | undefined,
  // [text] 7.1 Other Comments from Respondent
  fin_det_res: string | undefined,
  // [text] 7.2 Other Comments from Enumerator
  fin_det_enum: string | undefined,
  // [image] 7.3 Please take picture of any other relevant document
  fin_det_oth_doc_im: string,
  // [image] 7.4.1 Additional photo
  additional_photo1: string,
  // [image] 7.4.2 Additional photo
  additional_photo2: string,
  // [image] 7.4.3 Additional photo
  additional_photo3: string,
  // [image] 7.4.4 Additional photo
  additional_photo4: string,
  // [image] 7.4.5 Additional photo
  additional_photo5: string,
  // [image] 7.4.6 Additional photo
  additional_photo6: string,
  // [image] 7.4.7 Additional photo
  additional_photo7: string,
}