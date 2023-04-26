import {MPCA_NFI_NAA} from './MPCA_NFI_NAA'

export const mapMPCA_NFI_NAA = (_: Record<keyof MPCA_NFI_NAA, string | undefined>): MPCA_NFI_NAA => ({
	..._,
	Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
}) as MPCA_NFI_NAA