import {Protection_pss} from '@/core/generatedKoboInterface/Protection_pss'
import {DrcOffice, DrcProjectHelper} from '@/core/type/drc'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {Bn_Re} from '@/core/generatedKoboInterface/Bn_Re/Bn_Re'
import {Person} from '@/core/type/person'
import {Bn_ReOptions} from '@/core/generatedKoboInterface/Bn_Re/Bn_ReOptions'

export interface PersonWithStatus extends Person.Person {
  status?: Protection_pss.Option<'hh_char_hh_det_status'>
}

export namespace KoboGeneralMapping {

  export const mapOffice = (o?: Protection_pss.Option<'staff_to_insert_their_DRC_office'>): undefined | DrcOffice => fnSwitch(o!, {
    chernihiv: DrcOffice.Chernihiv,
    dnipro: DrcOffice.Dnipro,
    lviv: DrcOffice.Lviv,
    sumy: DrcOffice.Sumy,
    kharkiv: DrcOffice.Kharkiv,
    mykolaiv: DrcOffice.Mykolaiv,
  }, () => undefined)

  export const mapProject = (_?: string) => {
    if (!_) return
    const extractCode = _.match(/UKR-000\d{3}/)?.[0]
    if (extractCode) return DrcProjectHelper.searchByCode(extractCode)
    throw new Error(`Cannot find project from ${_}.`)
  }

  export const mapOblast = OblastIndex.byKoboName

  export const mapRaion = (_?: Bn_Re['ben_det_raion']) => _

  export const mapHromada = (_?: Bn_Re['ben_det_hromada']) => _

  export const getRaionLabel = (_?: Bn_Re['ben_det_raion']) => (Bn_ReOptions.ben_det_raion as any)[_!]

  export const getHromadaLabel = (_?: Bn_Re['ben_det_hromada']) => (Bn_ReOptions.ben_det_hromada as any)[_!]

  export const mapPersonWithStatus = (_: NonNullable<Protection_pss.T['hh_char_hh_det']>[0]): PersonWithStatus => {
    const res: PersonWithStatus = KoboGeneralMapping.mapPerson(_ as any)
    res.status = _.hh_char_hh_det_status
    return res
  }

  export const mapPerson = (_: {
    hh_char_hh_det_gender?: 'male' | 'female' | string
    hh_char_hh_det_age?: number
  }): Person.Person => {
    return {
      age: _.hh_char_hh_det_age,
      gender: fnSwitch(_.hh_char_hh_det_gender!, {
        'male': Person.Gender.Male,
        'female': Person.Gender.Female,
      }, () => Person.Gender.Other)
    }
  }
}