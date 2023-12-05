import {Partnership_assessment} from './Partnership_assessment'


const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const mapPartnership_assessment = (_: Record<keyof Partnership_assessment, any>): Partnership_assessment => ({
	..._,
	idd: _.idd ? new Date(_.idd) : undefined,
	rdcc: _.rdcc ? +_.rdcc : undefined,
	idd_001: _.idd_001 ? new Date(_.idd_001) : undefined,
	ccerho: _.ccerho?.split(' '),
	hmo: _.hmo ? +_.hmo : undefined,
	oflo: _.oflo?.map(extractQuestionName),
	aop: _.aop ? +_.aop : undefined,
	loop: _.loop?.map(extractQuestionName),
	scs: _.scs ? +_.scs : undefined,
	scf: _.scf ? +_.scf : undefined,
	scp: _.scp ? +_.scp : undefined,
	scv: _.scv ? +_.scv : undefined,
	wa_001: _.wa_001 ? +_.wa_001 : undefined,
	was: _.was?.split(' '),
	sery: _.sery?.split(' '),
	set: _.set?.split(' '),
	oc: _.oc?.split(' '),
	nftw: _.nftw?.split(' '),
	nfcf: _.nfcf?.split(' '),
	ccy: _.ccy?.split(' '),
	hcy: _.hcy?.split(' '),
}) as Partnership_assessment