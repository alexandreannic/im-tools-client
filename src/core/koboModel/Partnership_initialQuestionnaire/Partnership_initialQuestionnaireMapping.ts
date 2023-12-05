import {Partnership_initialQuestionnaire} from './Partnership_initialQuestionnaire'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapPartnership_initialQuestionnaire = (_: Record<keyof Partnership_initialQuestionnaire, any>): Partnership_initialQuestionnaire => ({
	..._,
	rdcc: _.rdcc ? +_.rdcc : undefined,
	idd: _.idd ? new Date(_.idd) : undefined,
	ccerho: _.ccerho?.split(' '),
	hmo: _.hmo ? +_.hmo : undefined,
	oflo: _.oflo?.map(extractQuestionName),
	aop: _.aop ? +_.aop : undefined,
	loop: _.loop?.map(extractQuestionName),
	scs: _.scs ? +_.scs : undefined,
	scf: _.scf ? +_.scf : undefined,
	scv: _.scv ? +_.scv : undefined,
	was: _.was?.split(' '),
	nftw: _.nftw?.split(' '),
	hcy: _.hcy?.split(' '),
}) as Partnership_initialQuestionnaire