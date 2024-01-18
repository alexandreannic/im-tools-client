import {mapSafetyIncidentTracker} from '@/core/generatedKoboInterface/SafetyIncidentTracker/SafetyIncidentTrackerMapping'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'

export namespace KoboSafetyIncidentHelper {

  export const mapData = (_: any) => {
    const d = mapSafetyIncidentTracker(_)
    return {...d, oblastISO: OblastIndex.byKoboName(d.oblast!).iso}
  }

  export type Type = ReturnType<typeof mapData>
}