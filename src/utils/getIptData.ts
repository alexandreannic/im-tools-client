import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {ageGroup, groupByAgeGroup} from '../core/type'
import {ChartTools} from '../core/chartTools'
import {ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/DashboardProtHHS2'

export const getProtHhsIptData = (data?: _Arr<ProtHHS2Enrich>) => {
  const csv: {base: string, gender: string, ageGroup: string, total: number}[] = []
  const flatData = data?.flatMap(_ => _.persons.map(p => ({..._, ...p})))
  const mapOffice = {
    chernihiv: 'Central',
    dnipro: 'East',
    kharkiv: 'East',
    lviv: 'West',
    mykolaiv: 'South',
    sumy: 'East'
  }

  if (flatData) {
    const byOffice = flatData?.groupBy(_ => mapOffice[_.staff_to_insert_their_DRC_office])
    Enum.entries(ChartTools.sortBy.custom(['West', 'Central', 'East', 'South'])(byOffice)).forEach(([base, v]) => {
      csv.push({
        base,
        gender: 'total',
        ageGroup: 'total',
        total: v.length,
      })
      Enum.entries(ChartTools.sortBy.custom(['male', 'female'])(Arr(v).groupBy(_ => _.gender))).forEach(([gender, genderV]) => {
        csv.push({
          base,
          gender,
          ageGroup: 'total',
          total: genderV.length,
        })
        const byAge = Arr(genderV).groupBy(_ => groupByAgeGroup()(_, p => p.age!))
        const byAgeSorted = ChartTools.sortBy.custom(Object.keys(ageGroup.bha))(byAge)
        Enum.entries(byAgeSorted).forEach(([ageGroup, ageV]) => {
          csv.push({
            base,
            gender,
            ageGroup: ageGroup + ' years',
            total: ageV.length
          })
        })
      })
    })
    csv.push({
      base: 'total',
      gender: 'total',
      ageGroup: 'total',
      total: flatData.length,
    })
    return toCsv(csv)
  }
}
const toCsv = (data: {base: string, gender: string, ageGroup: string, total: number}[]) => {
  return data.map(row => Object.values(row).map(_ => `"${_}"`).join(',')).join('\n')
}