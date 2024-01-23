import {Seq, seq} from '@alexandreannic/ts-utils'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {ProtectionActivity, ProtectionActivityFlat} from '@/features/Protection/Context/protectionType'
import {drcMaterialIcons} from '@/core/type/drc'
import {useI18n} from '@/core/i18n'
import {useMemo, useState} from 'react'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {Period} from '@/core/type/period'

export type UseProtectionFilter = ReturnType<typeof useProtectionFilters>

export const useProtectionFilters = (data?: Seq<ProtectionActivity>, flatData?: Seq<ProtectionActivityFlat>) => {
  const {m} = useI18n()
  const [period, setPeriod] = useState<Partial<Period>>({})

  const shape = useMemo(() => {
    const d = data ?? seq([])
    return DataFilter.makeShape<ProtectionActivity>({
      project: {
        multiple: true,
        icon: drcMaterialIcons.project,
        label: m.project,
        getValue: _ => _.project,
        getOptions: () => DataFilter.buildOptions(d.flatMap(_ => _.project!).distinct(_ => _).sort())
      },
      form: {
        icon: drcMaterialIcons.koboForm,
        label: m.koboForms,
        getValue: _ => _.koboForm,
        getOptions: () => DataFilter.buildOptions(d.map(_ => _.koboForm!).distinct(_ => _).sort())
      },
    })
  }, [data])

  const [filters, setFilters] = usePersistentState<DataFilter.InferShape<typeof shape>>({}, {storageKey: 'protection-dashboard-filters'})

  const filteredData = useMemo(() => {
    if (!data) return
    const filteredBy_date = data.filter(d => {
      try {
        if (period?.start && period.start.getTime() >= d.date.getTime()) return false
        if (period?.end && period.end.getTime() <= d.date.getTime()) return false
        return true
      } catch (e) {
        console.log(e, d)
      }
    })
    return DataFilter.filterData(filteredBy_date, shape, filters)
  }, [data, filters, period, shape])

  return {
    period,
    setPeriod,
    filters,
    setFilters,
    data: filteredData,
    shape,
  }
}