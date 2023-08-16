import {MealCfmExternal} from './MealCfmExternal'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMealCfmExternal = (_: Record<keyof MealCfmExternal, any>): MealCfmExternal => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
	phone: _.phone ? +_.phone : undefined,
}) as MealCfmExternal