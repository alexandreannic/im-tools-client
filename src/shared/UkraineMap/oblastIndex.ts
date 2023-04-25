import {Enum} from '@alexandreannic/ts-utils'
import {OblastISO} from './ukraineSvgPath'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'

export interface Oblast {
  koboKey: KoboFormProtHH.GetType<'oblast'>
  name: string
  iso: OblastISO
  shortISO: string
  drcOffice?: string
}

export class OblastIndex {
  static readonly findByKoboKey = (koboKey: string): Oblast | undefined => {
    return OblastIndex.list[koboKey]
  }

  static readonly findByShortISO = (shortISO: string): Oblast | undefined => {
    return Enum.values(OblastIndex.list).find(_ => _.shortISO === shortISO)
  }

  static readonly findByIso = (iso: OblastISO): Oblast | undefined => {
    return Enum.values(OblastIndex.list).find(_ => _.iso === iso)
  }

  static readonly list: Record<string, Oblast> = {
    vin: {
      koboKey: 'vin',
      name: 'Vinnytska',
      iso: 'UA-05',
      shortISO: 'UA05'
    },
    vol: {
      koboKey: 'vol',
      name: 'Volynska',
      iso: 'UA-07',
      shortISO: 'UA07'
    },
    dnip: {
      koboKey: 'dnip',
      name: 'Dnipropetrovska',
      iso: 'UA-12',
      shortISO: 'UA12'
    },
    don: {
      koboKey: 'don',
      name: 'Donetska',
      iso: 'UA-14',
      shortISO: 'UA14'
    },
    zhy: {
      koboKey: 'zhy',
      name: 'Zhytomyrska',
      iso: 'UA-18',
      shortISO: 'UA18'
    },
    zak: {
      koboKey: 'zak',
      name: 'Zakarpatska',
      iso: 'UA-21',
      shortISO: 'UA21'
    },
    zap: {
      koboKey: 'zap',
      name: 'Zaporizka',
      iso: 'UA-23',
      shortISO: 'UA23'
    },
    ivan: {
      koboKey: 'ivan',
      name: 'Ivano-Frankivska',
      iso: 'UA-26',
      shortISO: 'UA26'
    },
    kyi: {
      koboKey: 'kyi',
      name: 'Kyivska',
      iso: 'UA-32',
      shortISO: 'UA32'
    },
    avt: {
      koboKey: 'avt',
      name: 'Avtonomna Respublika Krym',
      iso: 'UA-43',
      shortISO: 'UA43'
    },
    kir: {
      koboKey: 'kir',
      name: 'Kirovonhradska',
      iso: 'UA-35',
      shortISO: 'UA35'
    },
    luh: {
      koboKey: 'luh',
      name: 'Luhanska',
      iso: 'UA-09',
      shortISO: 'UA09'
    },
    lvi: {
      koboKey: 'lvi',
      name: 'Lvivska',
      iso: 'UA-46',
      shortISO: 'UA46'
    },
    myk: {
      koboKey: 'myk',
      name: 'Mykolaivska',
      iso: 'UA-48',
      shortISO: 'UA48'
    },
    ode: {
      koboKey: 'ode',
      name: 'Odeska',
      iso: 'UA-51',
      shortISO: 'UA51'
    },
    pol: {
      koboKey: 'pol',
      name: 'Poltavska',
      iso: 'UA-53',
      shortISO: 'UA53',
      drcOffice: 'poltava'
    },
    riv: {
      koboKey: 'riv',
      name: 'Rivenska',
      iso: 'UA-56',
      shortISO: 'UA56'
    },
    sum: {
      koboKey: 'sum',
      name: 'Sumska',
      iso: 'UA-59',
      shortISO: 'UA59'
    },
    ter: {
      koboKey: 'ter',
      name: 'Ternopilska',
      iso: 'UA-61',
      shortISO: 'UA61'
    },
    kha: {
      koboKey: 'kha',
      name: 'Kharkivska',
      iso: 'UA-63',
      shortISO: 'UA63'
    },
    khe: {
      koboKey: 'khe',
      name: 'Khersonska',
      iso: 'UA-65',
      shortISO: 'UA65'
    },
    khm: {
      koboKey: 'khm',
      name: 'Khmelnytska',
      iso: 'UA-68',
      shortISO: 'UA68'
    },
    che: {
      koboKey: 'che',
      name: 'Cherkaska',
      iso: 'UA-71',
      shortISO: 'UA71'
    },
    chern: {
      koboKey: 'chern',
      name: 'Chernivetska',
      iso: 'UA-77',
      shortISO: 'UA77'
    },
    cherni: {
      koboKey: 'cherni',
      name: 'Chernihivska',
      iso: 'UA-74',
      shortISO: 'UA74',
      // drcOffice: 'chernivsti'
    },
    sev: {
      koboKey: 'sev',
      name: 'Sevastopilska',
      iso: 'UA-40',
      shortISO: 'UA40'
    }
  }
}

// "dnipro"
// "chernihiv"
// "lviv"
// export const oblastByKoboKey = {
// "chernivsti"
// export const oblastIso = Enum.values(oblastsByKoboKey).map(_ => _.iso)
//   'vin': 'Vinnytska',
//   'vol': 'Volynska',
//   'dnip': 'Dnipropetrovska',
//   'don': 'Donetska',
//   'zhy': 'Zhytomyrska',
//   'zak': 'Zakarpatska',
//   'zap': 'Zaporizka',
//   'ivan': 'Ivano-Frankivska',
//   'kyi': 'Kyivska',
//   'avt': 'Avtonomna Respublika Krym',
//   'kir': 'Kirovonhradska',
//   'luh': 'Luhanska',
//   'lvi': 'Lvivska',
//   'myk': 'Mykolaivska',
//   'ode': 'Odeska',
//   'pol': 'Poltavska',
//   'riv': 'Rivenska',
//   'sum': 'Sumska',
//   'ter': 'Ternopilska',
//   'kha': 'Kharkivska',
//   'khe': 'Khersonska',
//   'khm': 'Khmelnytska',
//   'che': 'Cherkaska',
//   'chern': 'Chernivetska',
//   'cherni': 'Chernihivska',
//   'sev': 'Sevastopilska',
// }
//
//
// export type OblastISO = keyof typeof oblastByIso
//
// export const oblastByIso = {
//   'UA-71': 'Cherkaska',
//   'UA-74': 'Chernihivska',
//   'UA-77': 'Chernivetska',
//   'UA-12': 'Dnipropetrovska',
//   'UA-14': 'Donetska',
//   'UA-26': 'Ivano-Frankivska',
//   'UA-63': 'Kharkivska',
//   'UA-65': 'Khersonska',
//   'UA-68': 'Khmelnytska',
//   'UA-35': 'Kirovonhradska',
//   'UA-32': 'Kyivska',
//   'UA-09': 'Luhanska',
//   'UA-46': 'Lvivska',
//   'UA-48': 'Mykolaivska',
//   'UA-51': 'Odeska',
//   'UA-53': 'Poltavska',
//   'UA-56': 'Rivenska',
//   'UA-40': 'Sevastopilska',
//   'UA-59': 'Sumska',
//   'UA-61': 'Ternopilska',
//   'UA-05': 'Vinnytska',
//   'UA-07': 'Volynska',
//   'UA-21': 'Zakarpatska',
//   'UA-23': 'Zaporizka',
//   'UA-18': 'Zhytomyrska',
//   'UA-43': 'Avtonomna Respublika Krym',
// }
