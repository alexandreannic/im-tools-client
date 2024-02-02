import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'
import {Period} from '@/core/type/period'
import {ProtectionActivity, ProtectionActivityFlat} from '@/features/Protection/Context/protectionType'
import {Obj, Seq, seq} from '@alexandreannic/ts-utils'
import {ProtectionDataHelper} from '@/features/Protection/Context/protectionDataHelper'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {PersonWithStatus} from '@/core/sdk/server/kobo/custom/KoboGeneralMapping'
import {UseProtectionFilter, useProtectionFilters} from '@/features/Protection/Context/useProtectionFilter'
import {enrichProtHHS_2_1} from '@/features/Protection/DashboardMonito/dashboardHelper'
import {Protection_hhs} from '@/core/sdk/server/kobo/generatedInterface/Protection_hhs'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {KoboUnwrapAnserType} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {Person} from '@/core/type/person'

export interface ProtectionContext {
  filters: Omit<UseProtectionFilter, 'data'>
  fetching: boolean
  fetcherGbv: UseFetcher<() => KoboUnwrapAnserType<'searchProtection_gbv'>>
  fetcherPss: UseFetcher<() => KoboUnwrapAnserType<'searchProtection_pss'>>
  fetcherHhs: UseFetcher<() => KoboUnwrapAnserType<'searchProtection_Hhs2'>>
  fetcherGroupSession: UseFetcher<() => KoboUnwrapAnserType<'searchProtection_groupSession'>>
  data?: {
    filtered: Seq<ProtectionActivity>
    all: Seq<ProtectionActivity>
    flat: Seq<ProtectionActivityFlat>
    flatFiltered: Seq<ProtectionActivityFlat>
  }
}

const Context = React.createContext({} as ProtectionContext)

export const useProtectionContext = () => useContext<ProtectionContext>(Context)

export const ProtectionProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const reqGbv = () => api.kobo.typedAnswers.searchProtection_gbv().then(_ => _.data)
  const reqPss = () => api.kobo.typedAnswers.searchProtection_pss().then(_ => _.data)
  const reqHhs = () => api.kobo.typedAnswers.searchProtection_Hhs2().then(_ => _.data)
  const reqGroupSession = () => api.kobo.typedAnswers.searchProtection_groupSession().then(_ => _.data)
  const fetcherGbv = useFetcher(reqGbv)
  const fetcherPss = useFetcher(reqPss)
  const fetcherHhs = useFetcher(reqHhs)
  const fetcherGroupSession = useFetcher(reqGroupSession)

  const allFetchers = [fetcherGbv, fetcherPss, fetcherHhs, fetcherGroupSession]
  const fetched = allFetchers.reduce((acc, _) => acc + _.callIndex, 0)
  const fetching = !!allFetchers.find(_ => _.loading)

  const mappedData = useMemo(() => {
    if (allFetchers.find(_ => _.get === undefined)) return
    const res: Seq<ProtectionActivity> = seq()
    res.push(...fetcherGbv.get?.filter(_ => _.new_ben !== 'no').map(ProtectionDataHelper.mapGbv) ?? [])
    res.push(...fetcherPss.get?.filter(_ => _.new_ben !== 'no').map(ProtectionDataHelper.mapPss) ?? [])
    res.push(...fetcherGroupSession.get?.map(ProtectionDataHelper.mapGroupSession) ?? [])
    res.push(...fetcherHhs.get
      ?.filter(_ => _.have_you_filled_out_this_form_before === 'no' && _.present_yourself === 'yes')
      .map(enrichProtHHS_2_1)
      .map(ProtectionDataHelper.mapHhs) ?? [])
    return res
  }, [fetched])

  const flatData = useMemo(() => {
    return mappedData?.flatMap(r => (r.persons ?? []).map(p => ({...p, ...r}))).compact()
  }, [mappedData])

  const filters = useProtectionFilters(mappedData, flatData)

  const flatFilteredData = useMemo(() => {
    return filters.data?.flatMap(r => (r.persons ?? []).map(p => ({...p, ...r}))).compact()
  }, [filters.data])

  useEffect(() => {
    allFetchers.forEach(_ => _.fetch({}))
  }, [])

  return (
    <Context.Provider value={{
      fetcherGbv,
      fetcherPss,
      fetcherHhs,
      data: mappedData && filters.data && flatData && flatFilteredData ? {
        all: mappedData,
        filtered: filters.data,
        flat: flatData,
        flatFiltered: flatFilteredData,
      } : undefined,
      fetcherGroupSession,
      fetching,
      filters,
    }}>
      {children}
    </Context.Provider>
  )
}
