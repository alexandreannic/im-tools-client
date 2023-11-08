import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {ShelterNtaTags, ShelterTaPriceLevel, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcOffice} from '@/core/drcUa'

export interface ShelterEntity {
  ta?: KoboAnswer<Shelter_TA, ShelterTaTags> & {
    _price?: number | null
    _priceLevel?: ShelterTaPriceLevel
  }
  nta?: KoboAnswer<Shelter_NTA, ShelterNtaTags>
  oblastIso?: OblastISO | ''
  oblast?: OblastName | ''
  office?: DrcOffice | ''
  id: KoboAnswerId
}

export class ShelterEntityHelper {


}