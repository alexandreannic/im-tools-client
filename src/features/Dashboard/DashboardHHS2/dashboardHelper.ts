import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ProtHHS_2_1} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {Donor} from '@/features/Dashboard/DashboardHHS2/DashboardProtHHS2'
import {makeKoboBarChartComponent} from '@/features/Dashboard/shared/KoboBarChart'
import {ProtHHS_2_1Options} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {ProtHhsTags} from '@/core/sdk/server/kobo/KoboProtHhs'

export interface ProtHHS2Person {
  age: ProtHHS_2_1['hh_age_1']
  gender: ProtHHS_2_1['hh_sex_1']
  lackDoc: ProtHHS_2_1['does_1_lack_doc']
  isIdpRegistered: ProtHHS_2_1['is_member_1_registered']
}

export const enrichProtHHS_2_1 = (a: KoboAnswer<ProtHHS_2_1, ProtHhsTags>) => {
  const maxHHNumber = 12
  const mapPerson = (a: ProtHHS_2_1) => {
    const fields = [
      ...mapFor(maxHHNumber, i => [
        `hh_age_${i}`,
        `hh_sex_${i}`,
        `does_${i}_lack_doc`,
        `is_member_${i}_registered`,
      ]),
    ] as [keyof ProtHHS_2_1, keyof ProtHHS_2_1, keyof ProtHHS_2_1, keyof ProtHHS_2_1][]
    return Arr(fields)
      .map(([ageCol, sexCol, lackDocCol, isIdpRegisteredCol]) => {
        return ({
          age: isNaN(a[ageCol] as any) ? undefined : +a[ageCol]!,
          gender: a[sexCol] as NonNullable<ProtHHS_2_1['hh_sex_1']>,
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

export const ProtHHS2BarChart = makeKoboBarChartComponent<ProtHHS_2_1, typeof ProtHHS_2_1Options>({
  options: ProtHHS_2_1Options
})

export type ProtHHS2Enrich = ReturnType<typeof enrichProtHHS_2_1>