import {Bn_Re} from './Bn_Re'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapBn_Re = (_: Record<keyof Bn_Re, any>): Bn_Re => ({
	..._,
	back_prog_type: _.back_prog_type?.split(' '),
	back_donor: _.back_donor?.split(' '),
	ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
	ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	hh_char_res_age: _.hh_char_res_age ? +_.hh_char_res_age : undefined,
	hh_char_hhh_age: _.hh_char_hhh_age ? +_.hh_char_hhh_age : undefined,
	hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
	hh_char_dis_select: _.hh_char_dis_select?.split(' '),
	nfi_dist_hkf: _.nfi_dist_hkf ? +_.nfi_dist_hkf : undefined,
	nfi_dist_hkmv: _.nfi_dist_hkmv ? +_.nfi_dist_hkmv : undefined,
	nfi_dist_hkf_001: _.nfi_dist_hkf_001 ? +_.nfi_dist_hkf_001 : undefined,
	nfi_dist_bk: _.nfi_dist_bk ? +_.nfi_dist_bk : undefined,
	nfi_dist_wkb1: _.nfi_dist_wkb1 ? +_.nfi_dist_wkb1 : undefined,
	nfi_dist_wkb2: _.nfi_dist_wkb2 ? +_.nfi_dist_wkb2 : undefined,
	nfi_dist_wkb3: _.nfi_dist_wkb3 ? +_.nfi_dist_wkb3 : undefined,
	nfi_dist_wkb4: _.nfi_dist_wkb4 ? +_.nfi_dist_wkb4 : undefined,
	nfi_kit_cc: _.nfi_kit_cc ? +_.nfi_kit_cc : undefined,
	nfi_bed: _.nfi_bed ? +_.nfi_bed : undefined,
	estimate_sqm_damage: _.estimate_sqm_damage ? +_.estimate_sqm_damage : undefined,
	mains_utilities: _.mains_utilities?.split(' '),
	mains_fuel: _.mains_fuel?.split(' '),
	cfr_accom_cond_occ_rat: _.cfr_accom_cond_occ_rat ? +_.cfr_accom_cond_occ_rat : undefined,
}) as Bn_Re