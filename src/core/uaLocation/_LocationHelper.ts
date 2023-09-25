import {Enum} from '@alexandreannic/ts-utils'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {aiOblasts} from './aiOblasts'
import {hromadas} from './hromadas'
import {AILocation, raions} from './raions'
// @ts-ignore
import settlements from './settlements.json'


// const settlements = _settlements as any
// const settlements = JSON.parse(_settlements)

export class AILocationHelper {

  private static readonly findLocation = <K extends string>(loc: Record<K, string>, name: string, type: string): K | undefined => {
    const res = Enum.keys(loc).find(_ => _.includes(name))
    if (!res) {
      console.error(`Cannot find ${type} ${name}`)
    }
    return res
  }
  
  private static readonly settlementsIndex = (() => {
    const index: Record<string, number[]> = {}
    for (var k in settlements) {
      const obj = settlements[k]
      if (!index[obj.parent]) index[obj.parent] = []
      index[obj.parent].push(obj.iso)
    }
    return index
  })()

  static print5w = (label5w: string) => label5w.split('_')[0] ?? label5w

  private static getSettlementsByHromadaIso = (hromadaIso: string) => {
    const isos = AILocationHelper.settlementsIndex[hromadaIso]
    return isos.map(_ => settlements[_])
  }

  static readonly findOblast = (name: string) => AILocationHelper.findLocation(aiOblasts, name, 'Oblast')

  static readonly findRaion = (oblastName: string, raionName: string): undefined | AILocation => {
    if (raionName === 'Cnernivetskyi') {
      raionName = 'Chernivetskyi'
    }
    const oblastIso = OblastIndex.searchISOByName(oblastName)
    const list = Enum.values(raions).filter(_ => _.parent === oblastIso)
    return list.find(_ => _.en === raionName)
  }

  static readonly findHromada = (oblastName: string, raionName: string, hromadaName: string) => {
    if (hromadaName === 'Cnernivetskyi') {
      hromadaName = 'Chernivetskyi'
    }
    const raionIso = AILocationHelper.findRaion(oblastName, raionName)?.iso
    const list = Enum.values(hromadas).filter(_ => _.parent === raionIso)
    return list.find(_ => _.en === hromadaName)
  }

  static readonly findSettlement = (oblastName: string, raionName: string, hromadaName: string, settlementName: string) => {
    const settlementFixes: Record<string, string> = {
      'Kamianets-Podilsk': 'Kamianets-Podilskyi',
      'Synelnykovo': 'Synelnykove',
      'Liski': 'Lisky',
      'Budy village': 'Budy'
    }
    settlementName = settlementFixes[settlementName] ?? settlementName
    const hromada = AILocationHelper.findHromada(oblastName, raionName, hromadaName)
    if (!hromada) return
    const settlements = AILocationHelper.getSettlementsByHromadaIso(hromada.iso)
    const match = settlements.find(_ => _.en.toLowerCase() === settlementName.toLowerCase())
    if (match) return match
    // return {
    //   'Chernihivska': settlements.find(_ => _.en === 'Chernihiv')
    // }[hromadaName]
  }
}
