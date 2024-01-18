import {Shelter_TA} from './Shelter_TA'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapShelter_TA = (_: Record<keyof Shelter_TA, any>): Shelter_TA => ({
	..._,

}) as Shelter_TA