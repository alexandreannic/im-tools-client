import React, {ReactNode, useContext, useMemo} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, UseFetcher} from '@alexandreannic/react-hooks-lib'
import {useAaToast} from '@/core/useToast'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {buildKoboSchemaHelper, KoboSchemaHelper} from '@/features/Database/KoboTable/useKoboSchema'
import {useI18n} from '@/core/i18n'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {ApiPaginate} from '@/core/type'

export interface DatabaseKoboTableContext {
  fetcherAnswers: UseFetcher<() => Promise<ApiPaginate<KoboAnswer>>>
  schemaHelper: KoboSchemaHelper
  accessSum: AccessSum
}

export const Context = React.createContext({} as DatabaseKoboTableContext)

export const useDatabaseKoboTableContext = () => useContext(Context)

export const DatabaseKoboTableProvider = ({
  children,
  schema,
  fetcherAnswers,
}: {
  schema: KoboApiForm
  children: ReactNode
  fetcherAnswers: DatabaseKoboTableContext['fetcherAnswers']
}) => {
  const {session, accesses} = useSession()
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()
  const {m} = useI18n()
  const schemaHelper = useMemo(() => buildKoboSchemaHelper(schema, m), [schema])

  const accessSum = useMemo(() => {
    return Access.toSum(
      accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).filter(_ => _.params?.koboFormId === formId),
      session.admin
    )
  }, [session, accesses])

  return (
    <Context.Provider value={{
      fetcherAnswers,
      schemaHelper,
      accessSum,
    }}>
      {children}
    </Context.Provider>
  )
}
