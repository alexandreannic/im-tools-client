import React, {ReactNode, useContext} from 'react'
import {ApiSdk} from '../sdk/ApiSdk'

export interface ApiContext {
  api: ApiSdk
}

const _ApiContext = React.createContext({} as ApiContext)

export const useApi = () => useContext(_ApiContext).api

export const ApiContextProvider = ({
  api,
  children,
}: {
  api: ApiSdk,
  children: ReactNode
}) => {
  return (
    <_ApiContext.Provider value={{api}}>
      {children}
    </_ApiContext.Provider>
  )
}
