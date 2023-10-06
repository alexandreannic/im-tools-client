import {Bn_OldMpcaNfi} from './Bn_OldMpcaNfi'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapBn_OldMpcaNfi = (_: Record<keyof Bn_OldMpcaNfi, any>): Bn_OldMpcaNfi => ({
  ..._,
  phone: _.phone ? +_.phone : undefined,
  hh_elderly_check: _.hh_elderly_check ? +_.hh_elderly_check : undefined,
  agex: _.agex ? +_.agex : undefined,
  Total_Family: _.Total_Family ? +_.Total_Family : undefined,
  group_in3fh72: _.group_in3fh72?.map(extractQuestionName),
  AgeHH: _.AgeHH ? +_.AgeHH : undefined,
  Does_anyone_in_your_elect_all_that_apply: _.Does_anyone_in_your_elect_all_that_apply?.split(' '),
  Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
  HKMV_: _.HKMV_ ? +_.HKMV_ : undefined,
  HKF_: _.HKF_ ? +_.HKF_ : undefined,
  NFKF_NFI_: _.NFKF_NFI_ ? +_.NFKF_NFI_ : undefined,
  KS_: _.KS_ ? +_.KS_ : undefined,
  BK_Baby_Kit_: _.BK_Baby_Kit_ ? +_.BK_Baby_Kit_ : undefined,
  BK_Baby_Kit: _.BK_Baby_Kit ? +_.BK_Baby_Kit : undefined,
  BK_Baby_Kit_001: _.BK_Baby_Kit_001 ? +_.BK_Baby_Kit_001 : undefined,
  BK_Baby_Kit_002: _.BK_Baby_Kit_002 ? +_.BK_Baby_Kit_002 : undefined,
  WKB1_1_: _.WKB1_1_ ? +_.WKB1_1_ : undefined,
  WKB2_2_: _.WKB2_2_ ? +_.WKB2_2_ : undefined,
  WKB3_3_: _.WKB3_3_ ? +_.WKB3_3_ : undefined,
  WKB4_4_: _.WKB4_4_ ? +_.WKB4_4_ : undefined,
  BLN_: _.BLN_ ? +_.BLN_ : undefined,
  BLN: _.BLN ? +_.BLN : undefined,
  income_month: _.income_month ? +_.income_month : undefined,
  internal_referral_specific: _.internal_referral_specific?.split(' '),
  reason: _.reason?.split(' '),
  Please_select_all_th_urrently_enrolled_in: _.Please_select_all_th_urrently_enrolled_in?.split(' '),
}) as Bn_OldMpcaNfi