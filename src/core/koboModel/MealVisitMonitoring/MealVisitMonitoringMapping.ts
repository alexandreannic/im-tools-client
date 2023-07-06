import {MealVisitMonitoring} from './MealVisitMonitoring'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMealVisitMonitoring = (_: Record<keyof MealVisitMonitoring, any>): MealVisitMonitoring => ({
	..._,
	mdd: _.mdd ? new Date(_.mdd) : undefined,
	mdd1: _.mdd1?.split(' '),
	mdt: _.mdt?.split(' '),
	pan: _.pan?.split(' '),
	sem: _.sem ? +_.sem : undefined,
	sew: _.sew ? +_.sew : undefined,
	sei: _.sei?.split(' '),
	sst: _.sst?.split(' '),
	visp: _.visp?.split(' '),
}) as MealVisitMonitoring