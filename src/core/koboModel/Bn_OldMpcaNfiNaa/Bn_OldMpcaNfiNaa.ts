import {Bn_OldMpcaNfiNaaOptions} from './Bn_OldMpcaNfiNaaOptions'

type Opt<T extends keyof typeof Bn_OldMpcaNfiNaaOptions> = keyof (typeof Bn_OldMpcaNfiNaaOptions)[T]

export interface Bn_OldMpcaNfiNaa {
  start: string,
  end: string,
  today: string,
  ID: string,
  // [note] Unique ID ${ID}
  unique_id_view: string,
  // [geopoint] Record your current location
  location_geopoint: string,
  // [note] In order to register your application, we'd need to ask you a few questions to understand the composition of your household and how to best transfer financial assistance to you if you are eligible. These questions will take between 10-15 minutes. If you are eligible, we’ll need to share some basic details with the bank in order to make the payment. We are also required to share Tax ID numbers of people we provide assistance to with other humanitarian agencies implementing financial assistance programs, to ensure we are not duplicating assistance. All the other information will be stored safely, in accordance with the Law on protection of personal data, and will not be shared outside of DRC and its partners.. Do you provide DRC consent to take photos or copies of your personal documentation at this time? Following DRC Data Protection Protocols and Ukraine Law on Data Protection, we will not share copies or photos of your documents with anyone outside DRC and these will only be used for the sole purpose of processing your information in order to provide you with cash assistance. You can decide to say no at this time and we will need to collect your documents at a later point in time.
  __021: string,
  // [select_one] Are you happy to proceed with the questionnaire?
  consent_mod_1: undefined | Opt<'consent_mod_1'>,
  // [text] What is your surname name (as shown in personal ID)?
  patron: string | undefined,
  // [text] What is your first name (as shown in personal ID)?
  name_resp: string | undefined,
  // [text] What is your patronymic name?
  last_resp: string | undefined,
  // [integer] What is your phone number?
  phone: number | undefined,
  // [select_one] Does the beneficiary have an individual tax number (ITN)?
  Does_the_beneficiary_have_an_i: undefined | Opt<'Does_the_beneficiary_have_an_i'>,
  // [select_one] Other ID identification
  Other_ID_identification: undefined | Opt<'Other_ID_identification'>,
  // [text] Number of ID
  Number_of_ID: string | undefined,
  // [text] Individual tax number (ITN) of the HHH
  ITN: string | undefined,
  // [integer] Indicate the total number of people in your household, including the HHH
  Total_Family: number | undefined,
  // [begin_repeat] HH members (including HHH)
  group_in3fh72: {AgeHH: number | undefined | undefined,GenderHH: undefined | Opt<'GenderHH'> | undefined}[] | undefined,
  // [select_multiple] Kits to be provided
  Kits_to_be_provided: undefined | Opt<'Kits_to_be_provided'>[],
  // [integer] HKMV Family hygiene kit for IDPs on the move: How many?
  HKMV_: number | undefined,
  // [integer] HKF Hygiene kit: How many?
  HKF_: number | undefined,
  // [integer] BLN High Thermal Blankets: How many?
  BLN_: number | undefined,
  // [integer] WKB1: How many?
  WKB1_How_many: number | undefined,
  // [integer] WKB2: How many?
  WKB2_How_many: number | undefined,
  // [integer] WKB3: How many?
  WKB3_How_many: number | undefined,
  // [integer] WKB4: How many?
  WKB4_How_many: number | undefined,
  // [integer] BK1: How many?
  BK1_How_many: number | undefined,
  // [integer] BK2: How many?
  BK2_How_many: number | undefined,
  // [integer] BK3: How many?
  BK3_How_many: number | undefined,
  // [integer] BK4: How many?
  BK4_How_many: number | undefined,
  // [integer] NFKF + KS Family NFI Kit (+ Kitchen set): How many?
  NFKF_KS_Family_NFI_itchen_set_How_many: number | undefined,
  Total_Cost_HKMV: string,
  Total_Cost_HKF: string,
  Total_Cost_BLN: string,
  Total_Cost_Allkits: string,
  // [image] In accordance with the Law of Ukraine "On the Protection of Personal Data" No. 2297-IV of June 1, 2010, we will need your consent for the following statement: "I give consent to the Representative Office of the Danish Refugee Council in Ukraine for the processing, use, access, distribution and transfer of my personal data to third parties that I provide about myself. The purpose of processing personal data to ensure the implementation of Assistance Programs.
  consent_signature_payment: string,
  // [note] Thank you very much for talking to DRC today. We appreciate your time.
  no_consent_note: string,
  // [note] Thank you so much for agreeing to answer the questions. DRC will be reviewing the application and might contact for additional clarification and request for personal documents..
  eligible_end_note: string,
}