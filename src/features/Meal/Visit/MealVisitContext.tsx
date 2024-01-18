import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {KoboIndex} from '@/KoboIndex'
import {map, seq, Seq} from '@alexandreannic/ts-utils'
import {Period} from '@/core/type'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Meal_VisitMonitoring} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoring'
import {useFetcher, UseFetcher} from '@/shared/hook/useFetcher'

export interface MealVisitContext {
  fetcherAnswers: UseFetcher<(filter: Partial<Period>) => Promise<Seq<KoboAnswer<Meal_VisitMonitoring, any>>>>
  fetcherPeriod: UseFetcher<() => Promise<Period>>
  periodFilter: Partial<Period>
  setPeriodFilter: Dispatch<SetStateAction<Partial<Period>>>
  answersIndex?: Record<KoboAnswerId, KoboAnswer<Meal_VisitMonitoring, any>>
}

const Context = React.createContext({} as MealVisitContext)

export const useMealVisitContext = () => useContext<MealVisitContext>(Context)

export const MealVisitProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const request = (filter: Partial<Period>) => api.kobo.typedAnswers.searchMeal_VisitMonitoring({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => _.data)

  const fetcherPeriod = useFetcher(() => api.kobo.answer.getPeriod(KoboIndex.byName('meal_visitMonitoring').id))
  const fetcherAnswers = useFetcher(request)
  const answersIndex = useMemo(() => {
    return seq(fetcherAnswers.get).groupByFirst(_ => _.id)
  }, [fetcherAnswers.get])

  useEffect(() => {
    fetcherPeriod.fetch()
  }, [])

  useEffect(() => {
    map(fetcherPeriod.get, setPeriodFilter)
  }, [fetcherPeriod.get])

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
