import {Meal_EcrecVerification} from './Meal_EcrecVerification'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMeal_EcrecVerification = (_: Record<keyof Meal_EcrecVerification, any>): Meal_EcrecVerification => ({
	..._,
	ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
	ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	many_sheep_goat: _.many_sheep_goat ? +_.many_sheep_goat : undefined,
	many_milking: _.many_milking ? +_.many_milking : undefined,
	many_cow: _.many_cow ? +_.many_cow : undefined,
	many_pig: _.many_pig ? +_.many_pig : undefined,
	many_poultry: _.many_poultry ? +_.many_poultry : undefined,
}) as Meal_EcrecVerification