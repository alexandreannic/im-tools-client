import {Meal_VerificationWinterizationOptions} from './Meal_VerificationWinterizationOptions'

type Opt<T extends keyof typeof Meal_VerificationWinterizationOptions> = keyof (typeof Meal_VerificationWinterizationOptions)[T]

// Form id: aAWVLi8bSb2S8bHc5CcL8i
export interface Meal_VerificationWinterization {
  start: string,
  end: string,
  // [select_one] 1.1 Select Office
  back_office: undefined | Opt<'back_office'>,
  // [text] 1.2 Enumerator
  back_enum: string | undefined,
  // [select_one] 1.3 Project
  back_donor: undefined | Opt<'back_donor'>,
  // [select_multiple] 1.4 Programme Type
  back_prog_type: undefined | Opt<'back_prog_type'>[],
  // [select_one] 1.5 Where you registered by DRC for a cash transfer for livelihoods?
  reg_drc: undefined | Opt<'back_consent'>,
  // [select_one] 1.6.1 Consent
  back_consent: undefined | Opt<'back_consent'>,
  // [text] 1.6.2 Can you please give the reason for why you do not wish to consent to the questionnaire?
  back_consen_no_reas: string | undefined,
  // [text] 1.7 What is your individual tax number?
  pay_det_tax_id_num: string | undefined,
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
  ben_det_raion: undefined | string,
  // [select_one] 2.5.3 Select hromada where registration is taking place
  ben_det_hromada: undefined | string,
  // [select_one_from_file] 2.5.4 Select settlement where registration is taking place
  ben_det_settlement: string,
  // [select_one] 2.5.5 Select residential status
  ben_det_res_stat: undefined | Opt<'ben_det_res_stat'>,
  // [select_one] 2.5.6 What is your area of origin prior to displacement? (Select Oblast)
  ben_det_prev_oblast: undefined | Opt<'ben_det_prev_oblast'>,
  // [integer] 2.6 What was the total value in UAH of all the resources your household received in the last one month?
  ben_det_income: number | undefined,
  // [integer] 2.7 Indicate the total number of people in your household, including the HHH
  ben_det_hh_size: number | undefined,
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
  // [text] 4.1 Other Comments from Respondent
  fin_det_res: string | undefined,
  // [text] 4.2 Other Comments from Enumerator
  fin_det_enum: string | undefined,
  // [image] 4.3 Please take picture of any other relevant document
  fin_det_oth_doc_im: string,
}