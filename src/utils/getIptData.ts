import {Arr, Enum} from '@alexandreannic/ts-utils'
import {ageGroupBHA, groupByAgeGroup} from '../core/type'
import {ChartTools} from '../core/chartTools'
import {UseProtHHS2Data} from '../features/Dashboard/DashboardHHS2/useProtHHS2Data'

export const get = (computed: UseProtHHS2Data) => {
  const csv: {base: string, gender: string, ageGroup: string, total: number}[] = []
  const z = computed?.flatData.groupBy(_ => _.staff_to_insert_their_DRC_office)
  if (z && computed) {
    Enum.entries(z).forEach(([base, v]) => {
      csv.push({
        base,
        gender: 'total',
        ageGroup: 'total',
        total: v.length,
      })
      Enum.entries(Arr(v).groupBy(_ => _.gender)).forEach(([gender, genderV]) => {
        csv.push({
          base,
          gender,
          ageGroup: 'total',
          total: genderV.length,
        })
        const byAge = Arr(genderV).groupBy(_ => groupByAgeGroup(_, p => p.age!))
        const byAgeSorted = ChartTools.sortBy.custom(Object.keys(ageGroupBHA))(byAge)
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
      total: computed.flatData.length,
    })
  }
}
const toCsv = (data: {base: string, gender: string, ageGroup: string, total: number}[]) => {
  return data.map(row => Object.values(row).map(_ => `"${_}"`).join(',')).join('\n')
}