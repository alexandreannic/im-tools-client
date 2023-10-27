import React, {ReactNode, useContext, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {kobo} from '@/koboDrcUaFormId'
import {UseShelterData} from '@/features/Shelter/useShelterData'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {UseShelterActions, useShelterActions} from '@/features/Shelter/useShelterActions'
import {AccessSum} from '@/core/sdk/server/access/Access'
import {useSession} from '@/core/Session/SessionContext'

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
  access,
  data,
}: {
  access: AccessSum
  data: UseShelterData
  schemaTa: KoboApiForm
  schemaNta: KoboApiForm
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const [langIndex, setLangIndex] = useState<number>(0)
  const {session, accesses} = useSession()

  const _ntaActions = useShelterActions<ShelterNtaTags>({
    formId: kobo.drcUa.form.shelter_nta,
    setEntity: data._fetchNta.setEntity,
    schema: schemaNta,
    langIndex,
  })
  const _taActions = useShelterActions<ShelterTaTags>({
    formId: kobo.drcUa.form.shelter_ta,
    setEntity: data._fetchTa.setEntity,
    schema: schemaTa,
    langIndex,
  })

  return (
    <Context.Provider value={{
      access,
      data,
      nta: _ntaActions,
      ta: _taActions,
      langIndex,
    }}>
      {children}
    </Context.Provider>
  )
}
