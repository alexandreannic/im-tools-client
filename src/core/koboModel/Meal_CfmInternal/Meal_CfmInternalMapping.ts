import {Meal_CfmInternal} from './Meal_CfmInternal'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMeal_CfmInternal = (_: Record<keyof Meal_CfmInternal, any>): Meal_CfmInternal => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
}) as Meal_CfmInternal