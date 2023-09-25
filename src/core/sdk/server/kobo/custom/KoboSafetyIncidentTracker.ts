import {mapSafetyIncidentTracker} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTrackerMapping'
import {OblastISO} from '@/shared/UkraineMap/oblastIndex'

export namespace KoboSafetyIncidentHelper {
  export const mapOblast: Record<string, OblastISO> = {
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

  export const mapData = (_: any) => {
    const d = mapSafetyIncidentTracker(_)
    return {...d, oblastISO: mapOblast[d.oblast!]}
  }

  export type Type = ReturnType<typeof mapData>
}