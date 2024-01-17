import React, {ReactNode, useContext, useState} from 'react'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {KoboIndex} from '@/KoboIndex'
import {UseShelterData} from '@/features/Shelter/useShelterData'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {UseShelterActions, useShelterActions} from '@/features/Shelter/useShelterActions'
import {AccessSum} from '@/core/sdk/server/access/Access'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'

export interface ShelterContext {
  access: AccessSum
  data: UseShelterData
  nta: UseShelterActions<ShelterNtaTags>
  ta: UseShelterActions<ShelterTaTags>
  langIndex: number
  allowedOffices: Shelter_NTA['back_office'][]
}

const Context = React.createContext({} as ShelterContext)

export const useShelterContext = () => useContext<ShelterContext>(Context)

export const ShelterProvider = ({
  schemaTa,
  schemaNta,
  children,
  allowedOffices,
  access,
  data,
}: {
  access: AccessSum
  data: UseShelterData
  schemaTa: KoboApiForm
  schemaNta: KoboApiForm
  children: ReactNode
  allowedOffices: ShelterContext['allowedOffices']
}) => {
  const [langIndex, setLangIndex] = useState<number>(0)

  const updateTag = (form: 'ta' | 'nta') => ({answerIds, key, value}: {
    answerIds: KoboAnswerId[]
    key: any
    value: any
  }) => data.fetcher.setEntity(prev => {
    if (!data.index || !prev) return prev
    const set = new Set(answerIds)
    return prev.map(_ => {
      // if (set.has(_[form]?.id ?? '-1')) console.log(_[form]?.tags)
      if (set.has(_[form]?.id ?? '!') && _[form]) {
        _[form]!.tags = {
          ...(_[form]?.tags ?? {}),
          [key]: value,
        }
      }
      return _
    })
  })

  const ntaActions = useShelterActions<ShelterNtaTags>({
    form: 'nta',
    formId: KoboIndex.byName('shelter_nta').id,
    setEntity: data.fetcher.setEntity,
    schema: schemaNta,
    langIndex,
  })
  const taActions = useShelterActions<ShelterTaTags>({
    form: 'ta',
    formId: KoboIndex.byName('shelter_ta').id,
    setEntity: data.fetcher.setEntity,
    schema: schemaTa,
    langIndex,
  })

  return (
    <Context.Provider value={{
      access,
      data,
      nta: ntaActions,
      ta: taActions,
      langIndex,
      allowedOffices,
    }}>
      {children}
    </Context.Provider>
  )
}
