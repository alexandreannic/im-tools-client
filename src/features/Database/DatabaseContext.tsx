import React, {ReactNode, useContext, useEffect} from 'react'
import {useFetchers, UseFetchersMultiple} from '@/alexlib-labo/useFetchersFn'
import {useAppSettings} from '@/core/context/ConfigContext'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useEffectFn, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'

export interface DatabaseContext {
  formSchemas: UseFetchersMultiple<ApiSdk['koboApi']['getForm']>
  // servers: UseFetcher<ApiSdk['kobo']['server']['getAll']>
}

export const _DatabaseContext = React.createContext({} as DatabaseContext)

export const useDatabaseContext = () => useContext(_DatabaseContext)

export const DatabaseProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const formSchemas = useFetchers(api.koboApi.getForm, {requestKey: ([server, form]) => form})
  // const servers = useFetcher(() => api.kobo.server.getAll())

  // useEffect(() => {
  //   servers.fetch()
  // }, [])

  return (
    <_DatabaseContext.Provider value={{
      formSchemas,
      // servers,
    }}>
      {children}
    </_DatabaseContext.Provider>
  )
}
