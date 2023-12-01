import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {map, seq, Seq} from '@alexandreannic/ts-utils'
import {Period} from '@/core/type'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Meal_VisitMonitoring} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoring'

export interface DashboardMealVisitContext {
  fetcherAnswers: UseFetcher<(filter: Partial<Period>) => Promise<Seq<KoboAnswer<Meal_VisitMonitoring, any>>>>
  fetcherPeriod: UseFetcher<() => Promise<Period>>
  periodFilter: Partial<Period>
  setPeriodFilter: Dispatch<SetStateAction<Partial<Period>>>
  answersIndex?: Record<KoboAnswerId, KoboAnswer<Meal_VisitMonitoring, any>>
}

const Context = React.createContext({} as DashboardMealVisitContext)

export const useDashboardMealVisitContext = () => useContext<DashboardMealVisitContext>(Context)

export const DashboardMealVisitProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const request = (filter: Partial<Period>) => api.kobo.answer.searchMeal_VisitMonitoring({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => _.data)

  const fetcherPeriod = useFetcher(() => api.kobo.answer.getPeriod(kobo.drcUa.form.meal_visitMonitoring))
  const fetcherAnswers = useFetcher(request)
  const answersIndex = useMemo(() => {
    return seq(fetcherAnswers.entity).groupByFirst(_ => _.id)
  }, [fetcherAnswers.entity])

  useEffect(() => {
    fetcherPeriod.fetch()
  }, [])

  useEffect(() => {
    map(fetcherPeriod.entity, setPeriodFilter)
  }, [fetcherPeriod.entity])

  useEffect(() => {
    fetcherAnswers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  return (
    <Context.Provider value={{
      fetcherAnswers,
      periodFilter,
      setPeriodFilter,
      fetcherPeriod,
      answersIndex,
    }}>
      {children}
    </Context.Provider>
  )
}
