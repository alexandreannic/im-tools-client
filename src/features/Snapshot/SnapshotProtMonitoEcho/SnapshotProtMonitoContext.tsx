import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {UseProtHHS2Data, useProtHhs2Data} from '@/features/Dashboard/DashboardHHS2/useProtHhs2Data'
import {Period} from '@/core/type'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {seq, Seq} from '@alexandreannic/ts-utils'

export interface SnapshotProtMonitoContext {
  computed: NonNullable<UseProtHHS2Data>
  data: Seq<ProtHHS2Enrich>
  periodFilter: Period
}

const Context = React.createContext({} as SnapshotProtMonitoContext)

export const useSnapshotProtMonitoringContext = () => useContext<SnapshotProtMonitoContext>(Context)

export const SnapshotProtMonitoringProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const [periodFilter, setPeriodFilter] = useState<Period>({
    start: new Date(2023, 6, 1),
    end: new Date(2023, 6, 31),
  })

  const request = (filter: Partial<Period>) => api.kobo.answer.searchProtection_Hhs2({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => seq(_.data.map(enrichProtHHS_2_1)))

  const _answers = useFetcher(request)

  useEffect(() => {
    // if (periodFilter.start || periodFilter.end)
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const computed = useProtHhs2Data({data: _answers.entity})

  return (
    <Context.Provider value={{
      periodFilter,
      data: _answers.entity!,
      computed: computed!,
    }}>
      {_answers.entity ? children : '...'}
    </Context.Provider>
  )
}
