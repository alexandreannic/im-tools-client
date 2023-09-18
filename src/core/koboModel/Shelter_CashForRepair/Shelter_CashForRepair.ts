import {Shelter_CashForRepairOptions} from './Shelter_CashForRepairOptions'

type Opt<T extends keyof typeof Shelter_CashForRepairOptions> = keyof (typeof Shelter_CashForRepairOptions)[T]

export interface Shelter_CashForRepair {
  start: string,
  end: string,
  // [select_one] Select Office
  back_office: undefined | Opt<'back_office'>,
  // [select_one] Name of enumerator
  name_enum: undefined | Opt<'name_enum'>,
  // [note] INFO: Introduction to DRC:
  info: string,
  // [note] DRC is a Danish non-governmental humanitarian organization and that currently implements a project providing shelter support to households with damaged shelters. DRC will determine whether you are eligible for this support, which is the form of cash for repairs.
  infokdrc: string,
  // [select_one] Do you consent to participate in this program?
  giu: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] What is your surname(as shown in personal ID)?
  bis: string | undefined,
  // [text] What is your first name (as shown in personal ID)?
  bif: string | undefined,
  // [text] What is your patronymic name(as shown in personal ID)?
  bip: string | undefined,
  // [text] What is your phone number?
  bin: string | undefined,
  // [integer] How many people live in this house (yourself included)?
  bihm: number | undefined,
  // [select_one] Do you give permission to contact you in the future for any additional questions?
  bigp: undefined | Opt<'sisp'>,
  // [select_one] Select oblast
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Select raion
  ben_det_raion: undefined | Opt<'ben_det_raion'>,
  // [select_one] Select hromada
  ben_det_hromada: undefined | Opt<'ben_det_hromada'>,
  // [text] Settlement
  ben_det_settlement: string | undefined,
  // [text] Street
  sils: string | undefined,
  // [text] Number of building
  siln: string | undefined,
  // [geopoint] GPS coordinates
  sig: string,
  // [select_one] Is it a house or an apartment?
  siha: undefined | Opt<'siha'>,
  // [text] Specify the apartment number
  sihan: string | undefined,
  // [integer] Specify the apartment floor
  sihaf: number | undefined,
  // [select_multiple] How was the shelter damaged?
  shelter_damage: undefined | Opt<'shelter_damage'>[],
  // [select_one] Damage sustained by the property by flooding
  sid: undefined | Opt<'sid'>,
  // [integer] What is the number of broken/ damaged windows?
  shelter_damage_window: number | undefined,
  // [decimal] What is the area of total broken/ damaged windows (m2)?
  shelter_damage_window_area: number | undefined,
  // [integer] What is the number of broken/ damaged doors?
  shelter_damage_doors: number | undefined,
  // [integer] What is the number of broken/ damaged external doors?
  shelter_damage_doors_external: number | undefined,
  // [integer] What is the number of broken/ damaged internal doors?
  shelter_damage_doors_internal: number | undefined,
  // [decimal] Estimation of the area of damaged roof (m2)?
  shelter_damage_roof: number | undefined,
  // [decimal] What is the number of broken/ damaged slope (lm)?
  shelter_damage_slope: number | undefined,
  // [decimal] Estimation of the area of damaged walls (m3)?
  shelter_damage_walls: number | undefined,
  // [image] Pictures of damages
  shelter_damage_image1: string,
  // [image] Pictures of damages
  shelter_damage_image2: string,
  // [image] Pictures of damages
  shelter_damage_image3: string,
  // [image] Pictures of damages
  shelter_damage_image4: string,
  // [select_one] Are you still living inside your house/apartment?
  sis: undefined | Opt<'sisp'>,
  // [select_one] Where are you living?
  sisl: undefined | Opt<'sisl'>,
  // [text] Other – please specify
  sislo: string | undefined,
  // [select_one] Do you plan to return to your house?
  sisp: undefined | Opt<'sisp'>,
  cal_shelter_damage_window: string,
  // [note] Total window cost: ${cal_shelter_damage_window} USD
  not_shelter_damage_window: string,
  cal_shelter_damage_slope: string,
  // [note] Total slope cost: ${cal_shelter_damage_slope} USD
  not_shelter_damage_slope: string,
  cal_shelter_damage_doors_external: string,
  // [note] Total external door cost: ${cal_shelter_damage_doors_external} USD
  not_shelter_damage_doors_external: string,
  cal_shelter_damage_doors_internal: string,
  // [note] Total internal door cost: ${cal_shelter_damage_doors_internal} USD
  not_shelter_damage_doors_internal: string,
  cal_shelter_damage_roof: string,
  // [note] Total roof cost: ${cal_shelter_damage_roof} USD
  not_shelter_damage_roof: string,
  cal_shelter_damage_walls: string,
  // [note] Total wall cost: ${cal_shelter_damage_walls} USD
  not_shelter_damage_walls: string,
  cal_shelter_damage_total: string,
  // [note] Total Repair cost: ${cal_shelter_damage_total} USD
  not_shelter_damage_total: string,
  level_damage: string,
  // [note] Level damage: ${level_damage}
  not_level_damage: string,
  // [select_one] Select level of damage:
  shelter_damage_level: undefined | Opt<'shelter_damage_level'>,
  // [text] Number of ID
  pay_det_pass_num: string | undefined,
  // [image] Take a photo of the ID
  pay_det_id_ph: string,
  // [select_one] Do you have an individual tax number (TIN)?
  pay_det_tax_id_yn: undefined | Opt<'pay_det_tax_exempt'>,
  // [text] What is your individual tax number?
  pay_det_tax_id_num: string | undefined,
  // [image] Take a photo of the Tax ID
  pay_det_tax_id_ph: string,
  // [select_one] Do you have a tax exemptions?
  pay_det_tax_exempt: undefined | Opt<'pay_det_tax_exempt'>,
  // [image] Take a photo of the proof of the tax of exemptions
  pay_det_tax_exempt_im: string,
  // [select_one] What is your preferred payment method?
  pay_det_pay_meth: undefined | Opt<'pay_det_pay_meth'>,
  // [image] Take photo of the registration in the passport
  pay_det_rai_meth: string,
  // [text] What is your IBAN number?
  pay_det_iban: string | undefined,
  // [image] Take a picture of IBAN number if available
  pay_det_iban_im: string,
  // [image] Take a picture of the address page of passport
  pay_det_add_im: string,
  // [text] Can you highlight the main reason that none of these payment methods are suitable to you?
  pay_det_pay_meth_none: string | undefined,
  // [note] Thank you for your time today, we have no further questions
  end_001: string,
}