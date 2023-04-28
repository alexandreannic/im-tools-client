import {MPCA_NFI_Old} from './MPCA_NFI_Old'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMPCA_NFI_Old = (_: Record<keyof MPCA_NFI_Old, any>): MPCA_NFI_Old => ({
	..._,
	Total_Family: _.Total_Family ? +_.Total_Family : undefined,
	_Family_composition: _._Family_composition?.split(' '),
	Quantity_02_Male: _.Quantity_02_Male ? +_.Quantity_02_Male : undefined,
	Quantity_02_Female: _.Quantity_02_Female ? +_.Quantity_02_Female : undefined,
	Quantity_24_Male: _.Quantity_24_Male ? +_.Quantity_24_Male : undefined,
	Quantity_24_Female: _.Quantity_24_Female ? +_.Quantity_24_Female : undefined,
	Quantity_517_Male: _.Quantity_517_Male ? +_.Quantity_517_Male : undefined,
	Quantity_517_Female: _.Quantity_517_Female ? +_.Quantity_517_Female : undefined,
	Quantity_1849_Male: _.Quantity_1849_Male ? +_.Quantity_1849_Male : undefined,
	Quantity_1849_Female: _.Quantity_1849_Female ? +_.Quantity_1849_Female : undefined,
	Quantity_5064_Male: _.Quantity_5064_Male ? +_.Quantity_5064_Male : undefined,
	Quantity_5064_Female: _.Quantity_5064_Female ? +_.Quantity_5064_Female : undefined,
	Quantity_65_Male: _.Quantity_65_Male ? +_.Quantity_65_Male : undefined,
	Quantity_65_Female: _.Quantity_65_Female ? +_.Quantity_65_Female : undefined,
	NoIdentification_Age_0_2: _.NoIdentification_Age_0_2 ? +_.NoIdentification_Age_0_2 : undefined,
	NoIdentification_Age_2_4: _.NoIdentification_Age_2_4 ? +_.NoIdentification_Age_2_4 : undefined,
	NoIdentification_Age_5_17: _.NoIdentification_Age_5_17 ? +_.NoIdentification_Age_5_17 : undefined,
	NoIdentification_Age_18_49: _.NoIdentification_Age_18_49 ? +_.NoIdentification_Age_18_49 : undefined,
	NoIdentification_Age_50_64: _.NoIdentification_Age_50_64 ? +_.NoIdentification_Age_50_64 : undefined,
	NoIdentification_Age_65: _.NoIdentification_Age_65 ? +_.NoIdentification_Age_65 : undefined,
	Does_anyone_in_your_elect_all_that_apply: _.Does_anyone_in_your_elect_all_that_apply?.split(' '),
	Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
	HKMV_: _.HKMV_ ? +_.HKMV_ : undefined,
	HKF_: _.HKF_ ? +_.HKF_ : undefined,
	NFKF_NFI_: _.NFKF_NFI_ ? +_.NFKF_NFI_ : undefined,
	KS_: _.KS_ ? +_.KS_ : undefined,
	BK_Baby_Kit_: _.BK_Baby_Kit_ ? +_.BK_Baby_Kit_ : undefined,
	BK_Baby_Kit_1: _.BK_Baby_Kit_1 ? +_.BK_Baby_Kit_1 : undefined,
	BK_Baby_Kit_2: _.BK_Baby_Kit_2 ? +_.BK_Baby_Kit_2 : undefined,
	BK_Baby_Kit_3: _.BK_Baby_Kit_3 ? +_.BK_Baby_Kit_3 : undefined,
	BK_Baby_Kit: _.BK_Baby_Kit ? +_.BK_Baby_Kit : undefined,
	BKA1_BK_1_: _.BKA1_BK_1_ ? +_.BKA1_BK_1_ : undefined,
	BKA2_BK_2_: _.BKA2_BK_2_ ? +_.BKA2_BK_2_ : undefined,
	BKA3_BK_3_: _.BKA3_BK_3_ ? +_.BKA3_BK_3_ : undefined,
	BKA4_BK_4_: _.BKA4_BK_4_ ? +_.BKA4_BK_4_ : undefined,
	WKB1_1_: _.WKB1_1_ ? +_.WKB1_1_ : undefined,
	WKB2_2_: _.WKB2_2_ ? +_.WKB2_2_ : undefined,
	WKB3_3_: _.WKB3_3_ ? +_.WKB3_3_ : undefined,
	WKB4_4_: _.WKB4_4_ ? +_.WKB4_4_ : undefined,
	BLN_: _.BLN_ ? +_.BLN_ : undefined,
	BLN: _.BLN ? +_.BLN : undefined,
	MPCA_vulnerabilities: _.MPCA_vulnerabilities?.split(' '),
}) as MPCA_NFI_Old