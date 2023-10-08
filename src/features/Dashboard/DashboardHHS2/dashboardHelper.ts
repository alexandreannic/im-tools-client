import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Protection_Hhs2_1} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1'
import {fnSwitch, mapFor, seq} from '@alexandreannic/ts-utils'
import {makeKoboBarChartComponent} from '@/features/Dashboard/shared/KoboBarChart'
import {Protection_Hhs2_1Options} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {Person} from '@/core/type'

export interface ProtHHS2Person extends Person.Person {
  // age: Protection_Hhs2_1['hh_age_1']
  // gender: Protection_Hhs2_1['hh_sex_1']
  lackDoc: Protection_Hhs2_1['does_1_lack_doc']
  isIdpRegistered: Protection_Hhs2_1['is_member_1_registered']
}

export const enrichProtHHS_2_1 = (a: KoboAnswer<Protection_Hhs2_1, ProtectionHhsTags>) => {
  const maxHHNumber = 12
  const mapPerson = (a: Protection_Hhs2_1) => {
    const fields = [
      ...mapFor(maxHHNumber, i => [
        `hh_age_${i}`,
        `hh_sex_${i}`,
        `does_${i}_lack_doc`,
        `is_member_${i}_registered`,
      ]),
    ] as [keyof Protection_Hhs2_1, keyof Protection_Hhs2_1, keyof Protection_Hhs2_1, keyof Protection_Hhs2_1][]
    return seq(fields)
      .map(([ageCol, sexCol, lackDocCol, isIdpRegisteredCol]) => {
        return ({
          age: isNaN(a[ageCol] as any) ? undefined : +a[ageCol]!,
          gender: fnSwitch(a[sexCol] as NonNullable<Protection_Hhs2_1['hh_sex_1']>, {
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

export const ProtHHS2BarChart = makeKoboBarChartComponent<Protection_Hhs2_1, typeof Protection_Hhs2_1Options>({
  options: Protection_Hhs2_1Options
})

export type ProtHHS2Enrich = ReturnType<typeof enrichProtHHS_2_1>