import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'
import {Period} from '@/core/type/period'
import {ProtectionActivity, ProtectionActivityFlat} from '@/features/Protection/Context/protectionType'
import {Seq, seq} from '@alexandreannic/ts-utils'
import {ProtectionDataHelper} from '@/features/Protection/Context/protectionDataHelper'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {PersonWithStatus} from '@/core/koboForms/koboGeneralMapping'
import {UseProtectionFilter, useProtectionFilters} from '@/features/Protection/Context/useProtectionFilter'
import {enrichProtHHS_2_1} from '@/features/Protection/DashboardMonito/dashboardHelper'
import {Protection_hhs} from '@/core/generatedKoboInterface/Protection_hhs'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'

export interface ProtectionContext {
  filters: Omit<UseProtectionFilter, 'data'>
  fetching: boolean
  fetcherGbv: UseFetcher<(_: Partial<Period>) => ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_gbv']>>
  fetcherPss: UseFetcher<(_: Partial<Period>) => ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_pss']>>
  fetcherHhs: UseFetcher<(_: Partial<Period>) => ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_Hhs2']>>
  fetcherGroupSession: UseFetcher<(_: Partial<Period>) => ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_groupSession']>>
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
  const fetcherGbv = useFetcher((p: Partial<Period>) => api.kobo.typedAnswers.searchProtection_gbv({filters: p}).then(_ => _.data))
  const fetcherPss = useFetcher((p: Partial<Period>) => api.kobo.typedAnswers.searchProtection_pss({filters: p}).then(_ => _.data))
  const fetcherHhs = useFetcher((p: Partial<Period>) => api.kobo.typedAnswers.searchProtection_Hhs2({filters: p}).then(_ => _.data))
  const fetcherGroupSession = useFetcher((p: Partial<Period>) => api.kobo.typedAnswers.searchProtection_groupSession({filters: p}).then(_ => _.data))

  const allFetchers = [fetcherGbv, fetcherPss, fetcherHhs, fetcherGroupSession]
  const fetched = allFetchers.reduce((acc, _) => acc + _.callIndex, 0)
  const fetching = !!allFetchers.find(_ => _.loading)

  const mappedData = useMemo(() => {
    if (allFetchers.every(_ => _.get === undefined)) return
    const res: Seq<ProtectionActivity> = seq()
    res.push(...fetcherGbv.get?.map(ProtectionDataHelper.mapGbv) ?? [])
    res.push(...fetcherPss.get?.map(ProtectionDataHelper.mapPss) ?? [])
    res.push(...fetcherGroupSession.get?.map(ProtectionDataHelper.mapGroupSession) ?? [])
    res.push(...fetcherHhs.get
      ?.filter((_: KoboAnswer<Protection_hhs.T, ProtectionHhsTags>) => _.have_you_filled_out_this_form_before === 'no' && _.present_yourself === 'yes')
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
    allFetchers.forEach(_ => _.fetch({}, filters.period))
  }, [filters.period])

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
