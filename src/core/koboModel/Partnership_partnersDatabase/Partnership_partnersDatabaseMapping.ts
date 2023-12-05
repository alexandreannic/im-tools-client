import {Partnership_partnersDatabase} from './Partnership_partnersDatabase'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapPartnership_partnersDatabase = (_: Record<keyof Partnership_partnersDatabase, any>): Partnership_partnersDatabase => ({
	..._,
	Date_of_assessment: _.Date_of_assessment ? new Date(_.Date_of_assessment) : undefined,
	Date_of_registration: _.Date_of_registration ? new Date(_.Date_of_registration) : undefined,
	Year_starting_humanitarian_work: _.Year_starting_humanitarian_work ? new Date(_.Year_starting_humanitarian_work) : undefined,
	Which_oblasts_does_t_t_and_has_experience: _.Which_oblasts_does_t_t_and_has_experience?.split(' '),
	If_yes_which_types_of_actors: _.If_yes_which_types_of_actors?.split(' '),
	If_yes_which: _.If_yes_which?.split(' '),
	Number_of_offices: _.Number_of_offices ? +_.Number_of_offices : undefined,
	group_ts4rc87: _.group_ts4rc87?.map(extractQuestionName),
	Which_sectors_does_the_organiz: _.Which_sectors_does_the_organiz?.split(' '),
	If_yes_how: _.If_yes_how?.split(' '),
	Select_if_the_organi_inorities_in_Ukraine: _.Select_if_the_organi_inorities_in_Ukraine?.split(' '),
	Own_vehicles: _.Own_vehicles?.split(' '),
	If_not_how_are_items_stored: _.If_not_how_are_items_stored?.split(' '),
	Safety_security_management_i: _.Safety_security_management_i?.split(' '),
	Safety_security_trainings_co: _.Safety_security_trainings_co?.split(' '),
	Safety_equipment_available: _.Safety_equipment_available?.split(' '),
	The_organization_is_g_type_of_activities: _.The_organization_is_g_type_of_activities?.split(' '),
	Operational_challenges: _.Operational_challenges?.split(' '),
	Which_assistance_would_the_CSO: _.Which_assistance_would_the_CSO?.split(' '),
	What_kind_of_capacity_needs_to: _.What_kind_of_capacity_needs_to?.split(' '),
	Number_of_agreements_with_DRC: _.Number_of_agreements_with_DRC ? +_.Number_of_agreements_with_DRC : undefined,
	group_vi2hh32: _.group_vi2hh32?.map(extractQuestionName),
	Date_of_last_vetting_check: _.Date_of_last_vetting_check ? new Date(_.Date_of_last_vetting_check) : undefined,
	group_kd9el87: _.group_kd9el87?.map(extractQuestionName),
	group_rr27n40: _.group_rr27n40?.map(extractQuestionName),
}) as Partnership_partnersDatabase