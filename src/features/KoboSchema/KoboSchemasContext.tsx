import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {buildSchemaBundle, KoboSchemaBundle} from '@/features/KoboSchema/useKoboSchema'
import {KoboFormName} from '@/KoboIndex'
import {useI18n} from '@/core/i18n'
import {useSchemaFetchers} from '@/features/KoboSchema/useSchemaFetcher'
import {UseFetchers} from '@/shared/hook/useFetchers'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Enum} from '@alexandreannic/ts-utils'

interface KoboSchemasProviderProps {
  defaultLangIndex?: number
  children: ReactNode
}

interface KoboSchemasContext {
  schema: Partial<Record<KoboFormName, KoboSchemaBundle>>
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
  fetchers: UseFetchers<(_: KoboFormName) => Promise<KoboApiForm>, KoboFormName>
}

const Context = React.createContext({} as KoboSchemasContext)

export const useKoboSchemasContext = ({autoFetch}: {autoFetch?: KoboFormName[]} = {}) => {
  const ctx = useContext<KoboSchemasContext>(Context)
  if (!ctx) throw Error('Cannot used useKoboSchemasContext outside of KoboSchemasProvider.')
  useEffect(() => {
    if (autoFetch) autoFetch.forEach(name => {
      ctx.fetchers.fetch({}, name)
    })
  }, [])
  return ctx
}

export const KoboSchemasProvider = ({
  defaultLangIndex = 0,
  children,
}: KoboSchemasProviderProps) => {
  const {m} = useI18n()
  const [langIndex, setLangIndex] = useState<number>(defaultLangIndex)
  const fetchers = useSchemaFetchers()
  const schemaBundle = useMemo(() => {
    const res: Partial<Record<KoboFormName, KoboSchemaBundle>> = {}
    Enum.entries(fetchers.getAsObj).forEach(([name, schema]) => {
      res[name] = buildSchemaBundle({schema, langIndex, m})
    })
    return res
  }, [fetchers.getAsObj, langIndex])

  return (
    <Context.Provider value={{
      langIndex,
      setLangIndex,
      fetchers,
      schema: schemaBundle,
    }}>
      {children}
    </Context.Provider>
  )
}
