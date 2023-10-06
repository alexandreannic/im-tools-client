import {Protection_communityMonitoring} from './Protection_communityMonitoring'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapProtection_communityMonitoring = (_: Record<keyof Protection_communityMonitoring, any>): Protection_communityMonitoring => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
	informant_age: _.informant_age ? +_.informant_age : undefined,
	numb_part: _.numb_part ? +_.numb_part : undefined,
	hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
}) as Protection_communityMonitoring