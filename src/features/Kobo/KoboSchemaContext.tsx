import React, {Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState} from 'react'
import {getKoboTranslations, UseKoboSchema, useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {MealVerificationAnsers} from '@/core/sdk/server/mealVerification/MealVerification'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

interface KoboSchemaProviderProps {
  schema: KoboSchemaContext['schemaUnsanitized']
  defaultLangIndex?: number
  children: ReactNode
}

interface KoboSchemaContext {
  schemaHelper: UseKoboSchema
  schemaUnsanitized: KoboApiForm
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
  translate: {
    question: KoboTranslateQuestion
    choice: KoboTranslateChoice
  }
}

const Context = React.createContext({} as KoboSchemaContext)

export const useKoboSchemaContext = () => useContext<KoboSchemaContext>(Context)

export const KoboSchemaProvider = ({
  schema,
  defaultLangIndex = 0,
  children,
}: KoboSchemaProviderProps) => {
  const [langIndex, setLangIndex] = useState<number>(defaultLangIndex)

  const schemaHelper = useKoboSchema({schema: schema})
  const {translateQuestion, translateChoice} = useMemo(() => getKoboTranslations({
    schema,
    langIndex,
    questionIndex: schemaHelper.questionIndex,
  }), [schema, langIndex])

  return (
    <Context.Provider value={{
      schemaUnsanitized: schema,
      langIndex,
      schemaHelper,
      setLangIndex,
      translate: {
        choice: translateChoice,
        question: translateQuestion,
      }
    }}>
      {children}
    </Context.Provider>
  )

}

