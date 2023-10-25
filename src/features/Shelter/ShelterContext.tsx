import React, {ReactNode, useContext, useEffect, useMemo, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {kobo} from '@/koboDrcUaFormId'
import {UseShelterData, useShelterData} from '@/features/Shelter/useShelterData'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {UseShelterActions, useShelterActions} from '@/features/Shelter/useShelterActions'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {seq} from '@alexandreannic/ts-utils'

export interface ShelterContext {
  access: AccessSum
  data: UseShelterData
  nta: UseShelterActions<ShelterNtaTags>
  ta: UseShelterActions<ShelterTaTags>
  langIndex: number
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
    const cfmAccesses = seq(accesses).filter(Access.filterByFeature(AppFeatureId.kobo_database))
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

  useEffect(() => {
    _data.fetchAll()
  }, [])

  useEffect(() => console.log(schemaTa), [schemaTa])
  useEffect(() => console.log(schemaNta), [schemaNta])
  return (
    <Context.Provider value={{
      access,
      data: _data,
      nta: _ntaActions,
      ta: _taActions,
      langIndex,
    }}>
      {children}
    </Context.Provider>
  )
}
