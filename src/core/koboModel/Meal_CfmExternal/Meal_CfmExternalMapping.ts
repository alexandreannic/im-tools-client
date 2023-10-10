import {Meal_CfmExternal} from './Meal_CfmExternal'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMeal_CfmExternal = (_: Record<keyof Meal_CfmExternal, any>): Meal_CfmExternal => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
}) as Meal_CfmExternal