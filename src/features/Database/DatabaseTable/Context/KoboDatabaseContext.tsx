import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {useKoboDatabasePopover} from '@/features/Database/DatabaseTable/Popover/useKoboDatabasePopover'
import {useKoboData} from '@/features/Database/DatabaseTable/Context/useKoboData'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {useKoboSchema} from '@/features/Database/DatabaseTable/Context/useKoboSchema'

export interface KoboDatabaseContext {
  data: ReturnType<typeof useKoboData>
  popover: ReturnType<typeof useKoboDatabasePopover>
  schema: ReturnType<typeof useKoboSchema>
  // sanitizedForm: KoboApiForm
  // formGroups: Record<string, KoboQuestionSchema[]>
  // choicesIndex: Record<string, KoboQuestionChoice[]>
  // questionIndex: Record<string, KoboQuestionSchema>
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
}

const _KoboDatabaseContext = React.createContext({} as KoboDatabaseContext)

export const useKoboDatabaseContext = () => useContext<KoboDatabaseContext>(_KoboDatabaseContext)

export const KoboDatabaseProvider = ({
  children,
  form,
  data: _data,
}: {
  data: KoboAnswer<any>[]
  form: KoboApiForm
  children: ReactNode
}) => {
  const [langIndex, setLangIndex] = useState<number>(0)//, `lang-index-${Utils.slugify(form.name)}`)

  const schema = useKoboSchema({form})

  const data = useKoboData({
    data: _data,
    questionIndex: schema.questionIndex,
  })

  const popoverHelper = useKoboDatabasePopover({
    form: schema.sanitizedSchema,
    choicesIndex: schema.choicesIndex,
    langIndex,
    schema: schema,
    data: data,
  })

  return (
    <_KoboDatabaseContext.Provider value={{
      schema,
      popover: popoverHelper,
      langIndex,
      setLangIndex,
      data,
    }}>
      {children}
    </_KoboDatabaseContext.Provider>
  )
}
