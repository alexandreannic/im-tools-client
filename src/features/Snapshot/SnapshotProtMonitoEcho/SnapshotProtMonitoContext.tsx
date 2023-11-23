import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {UseProtHHS2Data, useProtHhs2Data} from '@/features/Dashboard/DashboardHHS2/useProtHhs2Data'
import {Period} from '@/core/type'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {seq, Seq} from '@alexandreannic/ts-utils'
import {Protection_Hhs2_1} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1'

export interface SnapshotProtMonitoContext {
  computed: NonNullable<UseProtHHS2Data>
  data: Seq<ProtHHS2Enrich>
  periodFilter: Period
}

const Context = React.createContext({} as SnapshotProtMonitoContext)

export const useSnapshotProtMonitoringContext = () => useContext<SnapshotProtMonitoContext>(Context)

export const SnapshotProtMonitoringProvider = ({
  filters = {},
  initialPeriodFilter,
  children,
}: {
  filters?: {
    currentOblast?: Protection_Hhs2_1['where_are_you_current_living_oblast'][],
    drcOffice?: Protection_Hhs2_1['staff_to_insert_their_DRC_office'][],
  }
  initialPeriodFilter: Period,
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const [periodFilter, setPeriodFilter] = useState<Period>(initialPeriodFilter)

  const request = (filter: Partial<Period>) => api.kobo.typedAnswers.searchProtection_Hhs2({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  })
    .then(_ => _.data.filter(_ => !filters.currentOblast || filters.currentOblast.includes(_.where_are_you_current_living_oblast)))
    .then(_ => seq(_.map(enrichProtHHS_2_1)))

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
