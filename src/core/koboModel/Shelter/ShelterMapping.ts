import {Shelter} from './Shelter'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapShelter = (_: Record<keyof Shelter, any>): Shelter => ({
	..._,
	hh_char_res_age: _.hh_char_res_age ? +_.hh_char_res_age : undefined,
	hh_char_hhh_age: _.hh_char_hhh_age ? +_.hh_char_hhh_age : undefined,
	hh_yes_mobile: _.hh_yes_mobile ? +_.hh_yes_mobile : undefined,
	hh_phone: _.hh_phone ? +_.hh_phone : undefined,
	apartment_number: _.apartment_number ? +_.apartment_number : undefined,
	owner_number: _.owner_number ? +_.owner_number : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
	window_number: _.window_number ? +_.window_number : undefined,
	interior_door_damage: _.interior_door_damage ? +_.interior_door_damage : undefined,
	apartment_window: _.apartment_window ? +_.apartment_window : undefined,
	apartment_balcony: _.apartment_balcony ? +_.apartment_balcony : undefined,
	interior_apt_door_damage: _.interior_apt_door_damage ? +_.interior_apt_door_damage : undefined,
	hh_char_dis_select: _.hh_char_dis_select?.split(' '),
	see_number: _.see_number ? +_.see_number : undefined,
	hear_number: _.hear_number ? +_.hear_number : undefined,
	walk_number: _.walk_number ? +_.walk_number : undefined,
	medical_number: _.medical_number ? +_.medical_number : undefined,
	mental_number: _.mental_number ? +_.mental_number : undefined,
	how_u18_notrelated: _.how_u18_notrelated ? +_.how_u18_notrelated : undefined,
	pregnant_count: _.pregnant_count ? +_.pregnant_count : undefined,
}) as Shelter