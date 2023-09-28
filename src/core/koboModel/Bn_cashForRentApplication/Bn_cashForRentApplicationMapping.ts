import {Bn_cashForRentApplication} from './Bn_cashForRentApplication'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapBn_cashForRentApplication = (_: Record<keyof Bn_cashForRentApplication, any>): Bn_cashForRentApplication => ({
	..._,
	ben_age: _.ben_age ? +_.ben_age : undefined,
	ben_number: _.ben_number ? +_.ben_number : undefined,
	ben_when_moved: _.ben_when_moved ? new Date(_.ben_when_moved) : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
	ben_ren_sup: _.ben_ren_sup?.split(' '),
	ben_familys_income: _.ben_familys_income?.split(' '),
	ben_total_income: _.ben_total_income ? +_.ben_total_income : undefined,
}) as Bn_cashForRentApplication