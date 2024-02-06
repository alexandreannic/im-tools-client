import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {Safety_incidentTracker} from '@/core/sdk/server/kobo/generatedInterface/Safety_incidentTracker'

export namespace KoboSafetyIncidentHelper {

  export const mapData = (_: any) => {
    const d = Safety_incidentTracker.map(_)
    return {...d, oblastISO: OblastIndex.byKoboName(d.oblast!).iso}
  }

  export type Type = ReturnType<typeof mapData>
}