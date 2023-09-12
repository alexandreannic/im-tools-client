import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {UseProtHHS2Data, useProtHHS2Data} from '@/features/Dashboard/DashboardHHS2/useProtHHS2Data'
import {Period} from '@/core/type'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {_Arr, Arr} from '@alexandreannic/ts-utils'

export interface SnapshotProtMonitoContext {
  computed: NonNullable<UseProtHHS2Data>
  data: _Arr<ProtHHS2Enrich>
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

  const request = (filter: Partial<Period>) => api.kobo.answer.searchProtHhs({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => Arr(_.data.map(enrichProtHHS_2_1)))

  const _answers = useFetcher(request)

  useEffect(() => {
    // if (periodFilter.start || periodFilter.end)
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const computed = useProtHHS2Data({data: _answers.entity})

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