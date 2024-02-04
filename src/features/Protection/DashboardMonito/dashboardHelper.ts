import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {fnSwitch, mapFor, Seq, seq} from '@alexandreannic/ts-utils'
import {ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {Person} from '@/core/type/person'
import {Protection_Hhs2} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2'

export interface ProtHHS2Person extends Person.Person {
  lackDoc: Protection_Hhs2.T['does_1_lack_doc']
  isIdpRegistered: Protection_Hhs2.T['is_member_1_registered']
}

export type ProtHHS2Enrich = KoboAnswer<Protection_Hhs2.T & {
  persons: Seq<ProtHHS2Person>
}, ProtectionHhsTags>

export const enrichProtHHS_2_1 = (a: KoboAnswer<Protection_Hhs2.T, ProtectionHhsTags>): ProtHHS2Enrich => {
  const maxHHNumber = 12
  const mapPerson = (a: Protection_Hhs2.T) => {
    const fields = [
      ...mapFor(maxHHNumber, i => [
        `hh_age_${i}`,
        `hh_sex_${i}`,
        `does_${i}_lack_doc`,
        `is_member_${i}_registered`,
      ]),
    ] as [keyof Protection_Hhs2.T, keyof Protection_Hhs2.T, keyof Protection_Hhs2.T, keyof Protection_Hhs2.T][]
    return seq(fields)
      .map(([ageCol, sexCol, lackDocCol, isIdpRegisteredCol]) => {
        return ({
          age: isNaN(a[ageCol] as any) ? undefined : +a[ageCol]!,
          gender: fnSwitch(a[sexCol] as NonNullable<Protection_Hhs2.T['hh_sex_1']>, {
            female: Person.Gender.Female,
            male: Person.Gender.Male,
            other: Person.Gender.Other,
          }, () => undefined),
          lackDoc: a[lackDocCol],
          isIdpRegistered: a[isIdpRegisteredCol],
        }) as ProtHHS2Person
      }).filter(_ => _.age !== undefined || _.gender !== undefined)
  }

  return {
    ...a,
    persons: mapPerson(a),
  }
}
// export type ProtHHS2Enrich = ReturnType<typeof enrichProtHHS_2_1>