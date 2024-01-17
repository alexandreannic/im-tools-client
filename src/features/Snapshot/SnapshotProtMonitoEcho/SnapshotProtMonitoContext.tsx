import React, {ReactNode, useContext, useEffect} from 'react'
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
  period: Partial<Period>
}

const Context = React.createContext({} as SnapshotProtMonitoContext)

export const useSnapshotProtMonitoringContext = () => useContext<SnapshotProtMonitoContext>(Context)

export const SnapshotProtMonitoringProvider = ({
  filters = {},
  period,
  children,
}: {
  filters?: {
    currentOblast?: Protection_Hhs2_1['where_are_you_current_living_oblast'][],
    drcOffice?: Protection_Hhs2_1['staff_to_insert_their_DRC_office'][],
  }
  period: Partial<Period>,
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()

  const request = (filter: Partial<Period>) => api.kobo.typedAnswers.searchProtection_Hhs2({
    filters: {
      start: filter.start ?? undefined,
      end: filter.end ?? undefined,
    }
  })
    .then(_ => _.data.filter(_ => !filters.currentOblast || filters.currentOblast.includes(_.where_are_you_current_living_oblast)))
    .then(_ => seq(_.map(enrichProtHHS_2_1))
      // .filter(_ =>
      //   _.where_are_you_current_living_oblast !== OblastIndex.findISOByName('Dnipropetrovska') &&
      //   _.where_are_you_current_living_oblast !== OblastIndex.findISOByName('Volynska') &&
      //   _.where_are_you_current_living_oblast !== OblastIndex.findISOByName('Ivano-Frankivska')
      // )
    )

  const _answers = useFetcher(request)

  useEffect(() => {
    // if (periodFilter.start || periodFilter.end)
    _answers.fetch({force: true, clean: false}, period)
  }, [period])

  const computed = useProtHhs2Data({data: _answers.entity})

  return (
    <Context.Provider value={{
      period,
      data: _answers.entity!,
      computed: computed!,
    }}>
      {_answers.entity ? children : '...'}
    </Context.Provider>
  )
}
