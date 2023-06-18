import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {ApiSdk} from '../sdk/server/ApiSdk'
import {appConfig, AppConfig} from '../../conf/AppConfig'

export interface ConfigContext {
  api: ApiSdk
  conf: AppConfig
  darkTheme: boolean
  setDarkTheme: Dispatch<SetStateAction<boolean>>
}

export const _ConfigContext = React.createContext({} as ConfigContext)

export const useConfig = () => useContext(_ConfigContext)

export const ConfigContextProvider = ({
  api,
  children,
}: {
  api: ApiSdk,
  children: ReactNode
}) => {
  const [darkTheme, setDarkTheme] = useState(false)
  return (
    <_ConfigContext.Provider value={{
      api,
      conf: appConfig,
      darkTheme,
      setDarkTheme
    }}>
      {children}
    </_ConfigContext.Provider>
  )
}
