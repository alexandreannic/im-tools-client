import {SafetyIncidentTracker} from './SafetyIncidentTracker'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapSafetyIncidentTracker = (_: Record<keyof SafetyIncidentTracker, any>): SafetyIncidentTracker => ({
	..._,
	date_time: _.date_time ? new Date(_.date_time) : undefined,
	attack_type: _.attack_type?.split(' '),
	what_destroyed: _.what_destroyed?.split(' '),
	type_casualties: _.type_casualties?.split(' '),
	dead: _.dead ? +_.dead : undefined,
	injured: _.injured ? +_.injured : undefined,
}) as SafetyIncidentTracker