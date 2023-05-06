import {aiSettlementId, aiSettlementNames} from './aiSettlement'
import {aiHromadas} from './aiHromadas'
import {Enum} from '@alexandreannic/ts-utils'
import {aiRaions} from './aiRaions'
import {aiOblasts} from './aiOblasts'
import {hromadaRefs} from './hromadaRef'
import {raionRefs} from './raionRef'

export class AILocationHelper {

  private static readonly findLocation = <K extends string>(loc: Record<K, string>, name: string, type: string): K | undefined => {
    const res = Enum.keys(loc).find(_ => _.includes(name))
    if (!res) {
      console.error(`Cannot find ${type} ${name}`)
    }
    return res
  }

  static readonly findOblast = (name: string) => AILocationHelper.findLocation(aiOblasts, name, 'Oblast')

  static readonly findRaion = (name: string) => AILocationHelper.findLocation(aiRaions, name, 'Raion')

  static readonly findHromada = (name: string) => AILocationHelper.findLocation(aiHromadas, name, 'Hromada')

  static readonly searchRaionByHromada = (name: string): string | undefined => {
    const parent = Enum.values(hromadaRefs).find(_ => _.en === name)?.parent as keyof typeof raionRefs | undefined
    if (parent) {
      const enLabel = raionRefs[parent]?.en
      return Enum.keys(aiRaions).find(_ => _.includes(enLabel))
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
