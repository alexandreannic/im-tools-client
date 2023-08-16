import {MealCfmInternal} from './MealCfmInternal'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMealCfmInternal = (_: Record<keyof MealCfmInternal, any>): MealCfmInternal => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
}) as MealCfmInternal