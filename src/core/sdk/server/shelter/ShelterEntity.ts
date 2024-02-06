import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {ShelterNtaTags, ShelterTaPriceLevel, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcOffice} from '@/core/type/drc'
import {Shelter_TA} from '@/core/sdk/server/kobo/generatedInterface/Shelter_TA'
import {Shelter_NTA} from '@/core/sdk/server/kobo/generatedInterface/Shelter_NTA'

export interface ShelterEntity {
  ta?: KoboAnswer<Shelter_TA.T, ShelterTaTags> & {
    _price?: number | null
    _priceLevel?: ShelterTaPriceLevel
  }
  nta?: KoboAnswer<Shelter_NTA.T, ShelterNtaTags>
  oblastIso?: OblastISO | ''
  oblast?: OblastName | ''
  office?: DrcOffice | ''
  id: KoboAnswerId
}

export class ShelterEntityHelper {


}
