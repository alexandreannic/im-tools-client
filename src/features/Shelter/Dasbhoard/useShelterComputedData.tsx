import {ShelterRow, UseShelterData} from '@/features/Shelter/useShelterData'
import {useMemo} from 'react'
import {_Arr, fnSwitch} from '@alexandreannic/ts-utils'
import {Person} from '@/core/type'

export type UseShelterComputedData = ReturnType<typeof useShelterComputedData>

export const useShelterComputedData = ({
  data
}: {
  data?: _Arr<ShelterRow>
}) => {
  return useMemo(() => {
    if (!data) return
    const persons: Person.Person[] = data
      .flatMap(row => !row.nta ? [] : [...(row.nta.hh_char_hh_det ?? []), {
        hh_char_hh_det_age: row.nta.hh_char_res_age,
        hh_char_hh_det_gender: row.nta.hh_char_res_gender,
      }])
      .map(row => ({
        age: row.hh_char_hh_det_age,
        gender: fnSwitch(row.hh_char_hh_det_gender!, {
          male: Person.Gender.Male,
          female: Person.Gender.Female,
        }, () => undefined)
      }))
    return {
      persons,
    }
  }, [data])
}