import {aiSettlementId, aiSettlementNames} from './aiSettlement'
import {aiHromadas} from './aiHromadas'
import {Enum} from '@alexandreannic/ts-utils'
import {aiRaions} from './aiRaions'
import {aiOblasts} from './aiOblasts'
import {hromadaRefs} from './hromadaRef'
import {raionRefs} from './raionRef'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'

export class AILocationHelper {

  private static readonly findLocation = <K extends string>(loc: Record<K, string>, name: string, type: string): K | undefined => {
    const res = Enum.keys(loc).find(_ => _.includes(name))
    if (!res) {
      console.error(`Cannot find ${type} ${name}`)
    }
    return res
  }

  static readonly findOblast = (name: string) => AILocationHelper.findLocation(aiOblasts, name, 'Oblast')

  /** @deprecated */
  static readonly searchRaionByHromada = (name: string): string | undefined => {
    const parent = Enum.values(hromadaRefs).find(_ => _.en === name)?.parent as keyof typeof raionRefs | undefined
    if (parent) {
      const enLabel = raionRefs[parent]?.en
      return Enum.keys(aiRaions).find(_ => _.includes(enLabel))
    }
  }

  static readonly findRaion = (oblastName: string, raionName: string): undefined | {label: string, iso: string} => {
    const oblastIso = OblastIndex.findISOByName(oblastName)
    const list = Enum.entries(raionRefs).filter(([, v]) => v.parent === oblastIso)
    const res = list.find(([, v]) => v.en === raionName)
    if (res) {
      return {
        iso: res[0],
        label: res[1].en
      }
    }
  }

  static readonly findHromada = (oblastName: string, raionName: string, hromadaName: string) => {
    const raionIso = AILocationHelper.findRaion(oblastName, raionName)?.iso
    const list = Enum.entries(hromadaRefs).filter(([, v]) => v.parent === raionIso)
    const res = list.find(([, v]) => v.en === hromadaName)
    if (res) {
      return {
        iso: res[0],
        label: res[1].en
      }
    }
  }

  static readonly findSettlementIdByName = (name: string): string | undefined => {
    const index = aiSettlementNames.findIndex(_ => _.includes(name))
    if (index) {
      return aiSettlementId[index]
    } else {
      console.error('Cannot find settlement ' + name)
    }
  }

  static readonly findSettlement = (name: string): string | undefined => {
    if (name === 'Synelnykovo') {
      name = 'Synelnykove'
    }
    const s = aiSettlementNames.find(_ => _.toLocaleLowerCase().includes(name.toLowerCase()))
    if (!s) {
      console.error('Cannot find settlement "' + name + '"')
    }
    return s
  }
}
