import {Meal_VisitMonitoring} from './Meal_VisitMonitoring'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapMeal_VisitMonitoring = (_: Record<keyof Meal_VisitMonitoring, any>): Meal_VisitMonitoring => ({
	..._,
	mdd: _.mdd ? new Date(_.mdd) : undefined,
	mdd_001: _.mdd_001?.split(' '),
	mdt: _.mdt?.split(' '),
	pan: _.pan?.split(' '),
	sem: _.sem ? +_.sem : undefined,
	sew: _.sew ? +_.sew : undefined,
	sei: _.sei?.split(' '),
	sst: _.sst?.split(' '),
	visp: _.visp?.split(' '),
}) as Meal_VisitMonitoring