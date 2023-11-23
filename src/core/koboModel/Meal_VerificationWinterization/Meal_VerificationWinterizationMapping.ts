import {Meal_VerificationWinterization} from './Meal_VerificationWinterization'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMeal_VerificationWinterization = (_: Record<keyof Meal_VerificationWinterization, any>): Meal_VerificationWinterization => ({
	..._,
	back_prog_type: _.back_prog_type?.split(' '),
	ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
	ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	mains_utilities: _.mains_utilities?.split(' '),
	mains_fuel: _.mains_fuel?.split(' '),
}) as Meal_VerificationWinterization