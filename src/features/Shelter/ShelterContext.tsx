import React, {ReactNode, useContext, useState} from 'react'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {kobo} from '@/koboDrcUaFormId'
import {UseShelterData} from '@/features/Shelter/useShelterData'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {UseShelterActions, useShelterActions} from '@/features/Shelter/useShelterActions'
import {AccessSum} from '@/core/sdk/server/access/Access'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'

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
  const [langIndex, setLangIndex] = useState<number>(0)

  const updateTag = (form: 'ta' | 'nta') => ({answerIds, key, value}: {
    answerIds: KoboAnswerId[]
    key: any
    value: any
  }) => data.fetcher.setEntity(prev => {
    if (!data.index || !prev) return prev
    const set = new Set(answerIds)
    return prev.map(_ => {
      if (set.has(_[form]?.id ?? '-1')) console.log(_[form]?.tags)
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
    formId: kobo.drcUa.form.shelter_nta,
    setEntity: data.fetcher.setEntity,
    schema: schemaNta,
    langIndex,
  })
  const taActions = useShelterActions<ShelterTaTags>({
    form: 'ta',
    formId: kobo.drcUa.form.shelter_ta,
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
    }}>
      {children}
    </Context.Provider>
  )
}
