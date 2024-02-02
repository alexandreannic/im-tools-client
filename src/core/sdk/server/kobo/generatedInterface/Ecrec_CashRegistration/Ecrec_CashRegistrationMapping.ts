import {Ecrec_CashRegistration} from './Ecrec_CashRegistration'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapEcrec_CashRegistration = (_: Record<keyof Ecrec_CashRegistration, any>): Ecrec_CashRegistration => ({
	..._,
	ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
	ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	hh_char_res_age: _.hh_char_res_age ? +_.hh_char_res_age : undefined,
	hh_char_hhh_age: _.hh_char_hhh_age ? +_.hh_char_hhh_age : undefined,
	hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
	hh_char_dis_select: _.hh_char_dis_select?.split(' '),
	eligible_assistance_agricultural: _.eligible_assistance_agricultural?.split(' '),
	many_sheep_goat: _.many_sheep_goat ? +_.many_sheep_goat : undefined,
	many_milking: _.many_milking ? +_.many_milking : undefined,
	many_cow: _.many_cow ? +_.many_cow : undefined,
	many_pig: _.many_pig ? +_.many_pig : undefined,
	many_poultry: _.many_poultry ? +_.many_poultry : undefined,
	eligible_cash_feed: _.eligible_cash_feed?.split(' '),
	cash_animal_shelter: _.cash_animal_shelter?.split(' '),
	income_spent_food: _.income_spent_food ? +_.income_spent_food : undefined,
	income_spent_nonfood: _.income_spent_nonfood ? +_.income_spent_nonfood : undefined,
	lcs_reason: _.lcs_reason?.split(' '),
}) as Ecrec_CashRegistration