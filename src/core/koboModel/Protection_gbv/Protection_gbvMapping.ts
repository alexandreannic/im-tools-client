import {Protection_gbv} from './Protection_gbv'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapProtection_gbv = (_: Record<keyof Protection_gbv, any>): Protection_gbv => ({
  ..._,
  date: _.date ? new Date(_.date) : undefined,
  activity: _.activity?.split(' '),
  new_ben_yes: _.new_ben_yes ? +_.new_ben_yes : undefined,
  numb_part: _.numb_part ? +_.numb_part : undefined,
  hh_char_hh_det: _.hh_char_hh_det?.map(extractQuestionName),
}) as Protection_gbv