import {Enum} from '@alexandreannic/ts-utils'

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
    'UA43': `Autonomous Republic of Crimea`,
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
    'UA09': `Luhanska`, // UA-09 in Real but UA-44 in Activity Info
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

}

const protHH0oblastKey = {
  vin: 'UA05',
  vol: 'UA07',
  dnip: 'UA12',
  don: 'UA14',
  zhy: 'UA18',
  zak: 'UA21',
  zap: 'UA23',
  ivan: 'UA26',
  kyi: 'UA32',
  avt: 'UA43',
  kir: 'UA35',
  luh: 'UA09',
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
  chern: 'UA77',
  cherni: 'UA74',
  sev: 'UA40',
}