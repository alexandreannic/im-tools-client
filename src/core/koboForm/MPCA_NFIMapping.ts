import {MPCA_NFI} from './MPCA_NFI'

export const mapMPCA_NFI = (_: Record<keyof MPCA_NFI, string | undefined>): MPCA_NFI => ({
	..._,
	Does_anyone_in_your_elect_all_that_apply: _.Does_anyone_in_your_elect_all_that_apply?.split(' '),
	Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
	internal_referral_specific: _.internal_referral_specific?.split(' '),
	reason: _.reason?.split(' '),
	Please_select_all_th_urrently_enrolled_in: _.Please_select_all_th_urrently_enrolled_in?.split(' '),
}) as MPCA_NFI