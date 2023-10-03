import {mapSafetyIncidentTracker} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTrackerMapping'
import {OblastIndex, OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'

export namespace KoboSafetyIncidentHelper {

  export const mapData = (_: any) => {
    const d = mapSafetyIncidentTracker(_)
    return {...d, oblastISO: OblastIndex.koboOblastIndexIso[d.oblast!]}
  }

  export type Type = ReturnType<typeof mapData>
}