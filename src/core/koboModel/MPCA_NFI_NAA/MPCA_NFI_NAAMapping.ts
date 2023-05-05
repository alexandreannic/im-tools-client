import {MPCA_NFI_NAA} from './MPCA_NFI_NAA'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMPCA_NFI_NAA = (_: Record<keyof MPCA_NFI_NAA, any>): MPCA_NFI_NAA => ({
	..._,
	phone: _.phone ? +_.phone : undefined,
	Total_Family: _.Total_Family ? +_.Total_Family : undefined,
	group_in3fh72: _.group_in3fh72.map(extractQuestionName),
	AgeHH: _.AgeHH ? +_.AgeHH : undefined,
	Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
	HKMV_: _.HKMV_ ? +_.HKMV_ : undefined,
	HKF_: _.HKF_ ? +_.HKF_ : undefined,
	BLN_: _.BLN_ ? +_.BLN_ : undefined,
	WKB1_How_many: _.WKB1_How_many ? +_.WKB1_How_many : undefined,
	WKB2_How_many: _.WKB2_How_many ? +_.WKB2_How_many : undefined,
	WKB3_How_many: _.WKB3_How_many ? +_.WKB3_How_many : undefined,
	WKB4_How_many: _.WKB4_How_many ? +_.WKB4_How_many : undefined,
	BK1_How_many: _.BK1_How_many ? +_.BK1_How_many : undefined,
	BK2_How_many: _.BK2_How_many ? +_.BK2_How_many : undefined,
	BK3_How_many: _.BK3_How_many ? +_.BK3_How_many : undefined,
	BK4_How_many: _.BK4_How_many ? +_.BK4_How_many : undefined,
	NFKF_KS_Family_NFI_itchen_set_How_many: _.NFKF_KS_Family_NFI_itchen_set_How_many ? +_.NFKF_KS_Family_NFI_itchen_set_How_many : undefined,
}) as MPCA_NFI_NAA