import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {useFetchers, UseFetchersMultiple} from '@/alexlib-labo/useFetchersFn'
import {useAppSettings} from '@/core/context/ConfigContext'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useEffectFn, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAaToast} from '@/core/useToast'
import {Access} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {KoboForm, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {Arr} from '@alexandreannic/ts-utils'

export interface DatabasesContext {
  _forms: UseFetcher<ApiSdk['kobo']['form']['getAll']>
  isAdmin?: boolean
  getForm: (_: KoboId) => KoboForm | undefined
  formAccess?: KoboForm[]
  formSchemas: UseFetchersMultiple<ApiSdk['koboApi']['getForm']>
  // servers: UseFetcher<ApiSdk['kobo']['server']['getAll']>
}

export const Context = React.createContext({} as DatabasesContext)

export const useDatabaseContext = () => useContext(Context)

export const DatabaseProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {session, accesses} = useSession()
  const {api} = useAppSettings()
  const formSchemas = useFetchers(api.koboApi.getForm, {requestKey: ([server, form]) => form})
  const _forms = useFetcher(api.kobo.form.getAll)
  const {toastHttpError} = useAaToast()

  const getForm = useMemo(() => {
    const index = Arr(_forms.entity).reduceObject<Record<KoboId, KoboForm>>(_ => [_.id, _])
    return (_: KoboId) => index[_]
  }, [_forms.entity])
  // const servers = useFetcher(() => api.kobo.server.getAll())

  // useEffect(() => {
  //   servers.fetch()
  // }, [])
  useEffect(() => {
    _forms.fetch()
  }, [])

  const koboAccesses = useMemo(() => {
    return accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).map(_ => _.params?.koboFormId)
  }, [accesses])

  const formAccess = useMemo(() => {
    return _forms.entity?.filter(_ => session.admin || koboAccesses.includes(_.id))
  }, [koboAccesses, _forms.entity])

  useEffectFn(_forms.error, toastHttpError)

  return (
    <Context.Provider value={{
      _forms,
      formSchemas,
      isAdmin: session.admin,
      formAccess,
      getForm,
    }}>
      {children}
    </Context.Provider>
  )
}
