import React, {ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {kobo} from '@/koboDrcUaFormId'
import {UseShelterData, useShelterData} from '@/features/Shelter/useShelterData'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {UseShelterActions, useShelterActions} from '@/features/Shelter/useShelterActions'
import {UseAsync, useAsync} from '@/alexlib-labo/useAsync'
import {Arr} from '@alexandreannic/ts-utils'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'

export interface ShelterContext {
  access: AccessSum
  refresh: UseAsync<() => Promise<void>>
  data: UseShelterData
  nta: UseShelterActions<ShelterNtaTags>
  ta: UseShelterActions<ShelterTaTags>
  langIndex: number
  fetching?: boolean
  fetchAll: () => Promise<void>
}

const Context = React.createContext({} as ShelterContext)

export const useShelterContext = () => useContext<ShelterContext>(Context)

export const ShelterProvider = ({
  schemaTa,
  schemaNta,
  children,
}: {
  schemaTa: KoboApiForm,
  schemaNta: KoboApiForm,
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const [langIndex, setLangIndex] = useState<number>(0)
  const {session, accesses} = useSession()

  const {access, allowedOffices} = useMemo(() => {
    const cfmAccesses = Arr(accesses).filter(Access.filterByFeature(AppFeatureId.kobo_database))
    const allowedOffices = cfmAccesses.flatMap(_ => {
      return _.params?.filters?.back_office as Shelter_NTA['back_office'][] | undefined
    }).compact()
    return {
      access: Access.toSum(cfmAccesses, session.admin),
      allowedOffices,
    }
  }, [session, accesses])

  const _data = useShelterData(allowedOffices)

  const _ntaActions = useShelterActions<ShelterNtaTags>({
    formId: kobo.drcUa.form.shelter_nta,
    setEntity: _data._fetchNta.setEntity,
    schema: schemaNta,
    langIndex,
  })
  const _taActions = useShelterActions<ShelterTaTags>({
    formId: kobo.drcUa.form.shelter_ta,
    setEntity: _data._fetchTa.setEntity,
    schema: schemaTa,
    langIndex,
  })

  const fetchAll = useCallback(async () => {
    await Promise.all([
      _data._fetchNta.fetch({force: true, clean: false}),
      _data._fetchTa.fetch({force: true, clean: false}),
    ])
  }, [])

  const fetching = _data._fetchTa.loading || _data._fetchNta.loading

  const _refresh = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_ta),
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_nta),
    ])
    await fetchAll()
  })

  return (
    <Context.Provider value={{
      access,
      data: _data,
      fetching,
      refresh: _refresh,
      nta: _ntaActions,
      ta: _taActions,
      fetchAll,
      langIndex,
    }}>
      {children}
    </Context.Provider>
  )
}
