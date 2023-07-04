import React, {ReactNode, useContext} from 'react'
import {useFetchers, UseFetchersMultiple} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useAppSettings} from '@/core/context/ConfigContext'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

export interface DatabaseContext {
  formSchemas: UseFetchersMultiple<ApiSdk['koboApi']['getForm']>
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
  return (
    <_DatabaseContext.Provider value={{
      formSchemas
    }}>
      {children}
    </_DatabaseContext.Provider>
  )
}
