import {Protection_pss} from './Protection_pss'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapProtection_pss = (_: Record<keyof Protection_pss, any>): Protection_pss => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
	new_ben_no: _.new_ben_no ? +_.new_ben_no : undefined,
	numb_part: _.numb_part ? +_.numb_part : undefined,
	hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
}) as Protection_pss