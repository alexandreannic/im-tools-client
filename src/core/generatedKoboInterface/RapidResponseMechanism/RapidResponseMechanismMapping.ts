import {RapidResponseMechanism} from './RapidResponseMechanism'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapRapidResponseMechanism = (_: Record<keyof RapidResponseMechanism, any>): RapidResponseMechanism => ({
	..._,
	back_prog_type: _.back_prog_type?.split(' '),
	ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	windows: _.windows ? +_.windows : undefined,
	doors: _.doors ? +_.doors : undefined,
	estimation_roof: _.estimation_roof ? +_.estimation_roof : undefined,
	estimation_walls: _.estimation_walls ? +_.estimation_walls : undefined,
	nfi_dist_hkf: _.nfi_dist_hkf ? +_.nfi_dist_hkf : undefined,
	nfi_dist_hkmv: _.nfi_dist_hkmv ? +_.nfi_dist_hkmv : undefined,
	nfi_dist_hkf_001: _.nfi_dist_hkf_001 ? +_.nfi_dist_hkf_001 : undefined,
	back_prog_type_l: _.back_prog_type_l?.split(' '),
	ben_det_ph_number_l: _.ben_det_ph_number_l ? +_.ben_det_ph_number_l : undefined,
	ben_det_income_l: _.ben_det_income_l ? +_.ben_det_income_l : undefined,
	ben_det_hh_size_l: _.ben_det_hh_size_l ? +_.ben_det_hh_size_l : undefined,
	hh_char_res_age_l: _.hh_char_res_age_l ? +_.hh_char_res_age_l : undefined,
	hh_char_hhh_age_l: _.hh_char_hhh_age_l ? +_.hh_char_hhh_age_l : undefined,
	hh_char_hh_det_l: _.hh_char_hh_det_l?.map(extractQuestionName),
	hh_char_dis_select_l: _.hh_char_dis_select_l?.split(' '),
	nfi_dist_hkf_l: _.nfi_dist_hkf_l ? +_.nfi_dist_hkf_l : undefined,
	nfi_dist_hkmv_l: _.nfi_dist_hkmv_l ? +_.nfi_dist_hkmv_l : undefined,
	nfi_dist_hkf_001_l: _.nfi_dist_hkf_001_l ? +_.nfi_dist_hkf_001_l : undefined,
	nfi_dist_bk_l: _.nfi_dist_bk_l ? +_.nfi_dist_bk_l : undefined,
	nfi_dist_wkb1_l: _.nfi_dist_wkb1_l ? +_.nfi_dist_wkb1_l : undefined,
	nfi_dist_wkb2_l: _.nfi_dist_wkb2_l ? +_.nfi_dist_wkb2_l : undefined,
	nfi_dist_wkb3_l: _.nfi_dist_wkb3_l ? +_.nfi_dist_wkb3_l : undefined,
	nfi_dist_wkb4_l: _.nfi_dist_wkb4_l ? +_.nfi_dist_wkb4_l : undefined,
	estimate_sqm_damage_l: _.estimate_sqm_damage_l ? +_.estimate_sqm_damage_l : undefined,
	cfr_accom_cond_occ_rat_l: _.cfr_accom_cond_occ_rat_l ? +_.cfr_accom_cond_occ_rat_l : undefined,
}) as RapidResponseMechanism