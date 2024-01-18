import React, {Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState} from 'react'
import {getKoboTranslations, UseKoboSchema, useKoboSchema} from '@/features/KoboSchema/useKoboSchema'
import {KoboSchema} from '@/core/sdk/server/kobo/KoboApi'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export interface KoboSchemaProviderProps {
  schema: KoboSchema
  defaultLangIndex?: number
  children: ReactNode
}

export interface SchemaBundle {
  schemaHelper: UseKoboSchema
  schemaUnsanitized: KoboSchema
  translate: {
    question: KoboTranslateQuestion
    choice: KoboTranslateChoice
  }
}

interface KoboSchemaContext extends SchemaBundle {
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
}

const Context = React.createContext({} as KoboSchemaContext)

export const useKoboSchemaContext = () => useContext<KoboSchemaContext>(Context)

/** @deprecated use global KoboSchemasProvider whenever the form is implemented in KoboIndex */
export const KoboSchemaProvider = ({
  schema,
  defaultLangIndex = 0,
  children,
}: KoboSchemaProviderProps) => {
  const [langIndex, setLangIndex] = useState<number>(defaultLangIndex)
  const schemaHelper = useKoboSchema({schema: schema})
  const res = useMemo(() => {
    const {translateQuestion, translateChoice} = getKoboTranslations({
      schema,
      langIndex,
      questionIndex: schemaHelper.questionIndex,
    })
    return {
      schemaUnsanitized: schema,
      langIndex,
      schemaHelper,
      setLangIndex,
      translate: {
        choice: translateChoice,
        question: translateQuestion,
      }
    }
  }, [schema, langIndex])

  return (
    <Context.Provider value={res}>
      {children}
    </Context.Provider>
  )
}