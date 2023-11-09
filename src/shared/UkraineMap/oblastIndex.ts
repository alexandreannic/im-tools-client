import {Enum} from '@alexandreannic/ts-utils'
import {Utils} from '@/utils/utils'
import {ReverseMap} from '@/utils/utilsType'

export interface Oblast {
  name: string
  iso: OblastISO
}

export type OblastISO = keyof typeof OblastIndex['oblastByISO']
export type OblastName = typeof OblastIndex['oblastByISO'][keyof typeof OblastIndex['oblastByISO']]

export class OblastIndex {

  /** @deprecated used by old hhs form */
  static readonly findISOByKoboKey = (koboKey: string): OblastISO | undefined => {
    // @ts-ignore
    return protHH0oblastKey[koboKey]
  }

  static readonly findByIso = (iso: OblastISO): OblastName | undefined => {
    return OblastIndex.oblastByISO[iso]
  }

  static readonly findISOByName = (name: OblastName): OblastISO => {
    return Enum.entries(OblastIndex.oblastByISO)
      .find(([k, v]) => v === name)?.[0]!
  }

  static readonly searchISOByName = (name: string): undefined | OblastISO => {
    return Enum.entries(OblastIndex.oblastByISO)
      .find(([k, v]) => v === name)?.[0]!
  }

  static readonly oblastByISO = Object.freeze({
    'UA01': `Autonomous Republic of Crimea`,
    'UA71': `Cherkaska`,
    'UA74': `Chernihivska`,
    'UA73': `Chernivetska`,
    'UA12': `Dnipropetrovska`,
    'UA14': `Donetska`,
    'UA26': `Ivano-Frankivska`,
    'UA63': `Kharkivska`,
    'UA65': `Khersonska`,
    'UA68': `Khmelnytska`,
    'UA35': `Kirovohradska`,
    'UA80': `Kyiv`,
    'UA32': `Kyivska`,
    'UA44': `Luhanska`, // UA-09 in Real but UA-44 in Activity Info
    'UA46': `Lvivska`,
    'UA48': `Mykolaivska`,
    'UA51': `Odeska`,
    'UA53': `Poltavska`,
    'UA56': `Rivnenska`,
    'UA85': `Sevastopol`,
    'UA59': `Sumska`,
    'UA61': `Ternopilska`,
    'UA05': `Vinnytska`,
    'UA07': `Volynska`,
    'UA21': `Zakarpatska`,
    'UA23': `Zaporizka`,
    'UA18': `Zhytomyrska`
  })

  static readonly oblastIsoByName = Enum.transform(OblastIndex.oblastByISO, (k, v) => [v, k])

  static readonly koboOblastIndex: Record<string, OblastName> = {
    aroc: 'Autonomous Republic of Crimea',//'UA43',
    cherkaska: 'Cherkaska',
    chernihivska: 'Chernihivska',
    chernivetska: 'Chernivetska',// 'UA77',
    dnipropetrovska: 'Dnipropetrovska',
    donetska: 'Donetska',
    'ivano-frankivska': 'Ivano-Frankivska',
    kharkivska: 'Kharkivska',
    khersonska: 'Khersonska',
    khmelnytska: 'Khmelnytska',
    kirovohradska: 'Kirovohradska',
    citykyiv: 'Kyiv',//'UA80',
    kyivska: 'Kyivska',
    luhanska: 'Luhanska',//'UA09',
    lvivska: 'Lvivska',
    mykolaivska: 'Mykolaivska',
    odeska: 'Odeska',
    poltavska: 'Poltavska',
    rivnenska: 'Rivnenska',
    sevastopilska: 'Sevastopol',//'UA85',
    sumska: 'Sumska',
    ternopilska: 'Ternopilska',
    vinnytska: 'Vinnytska',
    volynska: 'Volynska',
    zakarpatska: 'Zakarpatska',
    zaporizka: 'Zaporizka',
    zhytomyrska: 'Zhytomyrska',
  }

  static readonly koboOblastIndexIso: Record<string, OblastISO> = {
    aroc: 'UA01',//'UA43',
    cherkaska: 'UA71',
    chernihivska: 'UA74',
    chernivetska: 'UA73',// 'UA77',
    dnipropetrovska: 'UA12',
    donetska: 'UA14',
    'ivano-frankivska': 'UA26',
    kharkivska: 'UA63',
    khersonska: 'UA65',
    khmelnytska: 'UA68',
    kirovohradska: 'UA35',
    citykyiv: 'UA80',//'UA80',
    kyivska: 'UA32',
    luhanska: 'UA44',//'UA09',
    lvivska: 'UA46',
    mykolaivska: 'UA48',
    odeska: 'UA51',
    poltavska: 'UA53',
    rivnenska: 'UA56',
    sevastopilska: 'UA85',//'UA85',
    sumska: 'UA59',
    ternopilska: 'UA61',
    vinnytska: 'UA05',
    volynska: 'UA07',
    zakarpatska: 'UA21',
    zaporizka: 'UA23',
    zhytomyrska: 'UA18',
  }

  static readonly isoToKoboOblastValue: ReverseMap<typeof OblastIndex.koboOblastIndexIso> = Object.fromEntries(
    Object.entries(OblastIndex.koboOblastIndexIso).map(([key, value]) => [
      value,
      key,
    ]),
  ) as any
}

const protHH0oblastKey: Record<string, OblastISO> = {
  vin: 'UA05',
  vol: 'UA07',
  dnip: 'UA12',
  don: 'UA14',
  zhy: 'UA18',
  zak: 'UA21',
  zap: 'UA23',
  ivan: 'UA26',
  kyi: 'UA32',
  avt: 'UA01',
  kir: 'UA35',
  luh: 'UA44',
  lvi: 'UA46',
  myk: 'UA48',
  ode: 'UA51',
  pol: 'UA53',
  riv: 'UA56',
  sum: 'UA59',
  ter: 'UA61',
  kha: 'UA63',
  khe: 'UA65',
  khm: 'UA68',
  che: 'UA71',
  chern: 'UA73',
  cherni: 'UA74',
  sev: 'UA85',
}