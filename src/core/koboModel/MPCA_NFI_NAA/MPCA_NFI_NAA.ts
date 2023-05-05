import {MPCA_NFI_NAAOptions} from './MPCA_NFI_NAAOptions'

type Opt<T extends keyof typeof MPCA_NFI_NAAOptions> = keyof (typeof MPCA_NFI_NAAOptions)[T]

export interface MPCA_NFI_NAA {
  start: string,
  end: string,
  today: string,
  // Record your current location
  location_geopoint: string,
  // Are you happy to proceed with the questionnaire?
  consent_mod_1: Opt<'consent_mod_1'>,
  // What is your surname name (as shown in personal ID)?
  patron: string | undefined,
  // What is your first name (as shown in personal ID)?
  name_resp: string | undefined,
  // What is your patronymic name?
  last_resp: string | undefined,
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
  // Indicate the total number of people in your household, including the HHH
  Total_Family: number | undefined,
  // HH members (including HHH)
  group_in3fh72: {AgeHH: number | undefined,GenderHH: string | undefined}[],
  // Please indicate the AGE of HH member
  AgeHH: number | undefined,
  // Please indicate the GENDER of HH member
  GenderHH: Opt<'GenderHH'>,
  // Kits to be provided
  Kits_to_be_provided: Opt<'Kits_to_be_provided'>[],
  // HKMV Family hygiene kit for IDPs on the move: How many?
  HKMV_: number | undefined,
  // HKF Hygiene kit: How many?
  HKF_: number | undefined,
  // BLN High Thermal Blankets: How many?
  BLN_: number | undefined,
  // WKB1: How many?
  WKB1_How_many: number | undefined,
  // WKB2: How many?
  WKB2_How_many: number | undefined,
  // WKB3: How many?
  WKB3_How_many: number | undefined,
  // WKB4: How many?
  WKB4_How_many: number | undefined,
  // BK1: How many?
  BK1_How_many: number | undefined,
  // BK2: How many?
  BK2_How_many: number | undefined,
  // BK3: How many?
  BK3_How_many: number | undefined,
  // BK4: How many?
  BK4_How_many: number | undefined,
  // NFKF + KS Family NFI Kit (+ Kitchen set): How many?
  NFKF_KS_Family_NFI_itchen_set_How_many: number | undefined,
  // In accordance with the Law of Ukraine "On the Protection of Personal Data" No. 2297-IV of June 1, 2010, we will need your consent for the following statement: "I give consent to the Representative Office of the Danish Refugee Council in Ukraine for the processing, use, access, distribution and transfer of my personal data to third parties that I provide about myself. The purpose of processing personal data to ensure the implementation of Assistance Programs.
  consent_signature_payment: string,
}