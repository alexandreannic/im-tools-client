import {MPCA_NFI_Old} from './MPCA_NFI_Old'

export const mapMPCA_NFI_Old = (_: Record<keyof MPCA_NFI_Old, string | undefined>): MPCA_NFI_Old => ({
	..._,
	_Family_composition: _._Family_composition?.split(' '),
	Does_anyone_in_your_elect_all_that_apply: _.Does_anyone_in_your_elect_all_that_apply?.split(' '),
	Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
	MPCA_vulnerabilities: _.MPCA_vulnerabilities?.split(' '),
}) as MPCA_NFI_Old