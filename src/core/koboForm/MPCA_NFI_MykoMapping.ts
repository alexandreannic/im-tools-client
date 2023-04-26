import {MPCA_NFI_Myko} from './MPCA_NFI_Myko'

export const mapMPCA_NFI_Myko = (_: Record<keyof MPCA_NFI_Myko, string | undefined>): MPCA_NFI_Myko => ({
	..._,
	Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
}) as MPCA_NFI_Myko