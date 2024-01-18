import React, {ReactNode, useContext} from 'react'
import {useAppSettings} from './ConfigContext'
import {ApiSdk} from '../sdk/server/ApiSdk'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'

export interface NfiContext {
  index: UseFetcher<ApiSdk['nfi']['index']>
}

const _NfiContext = React.createContext({} as NfiContext)

export const useNfiContext = () => useContext<NfiContext>(_NfiContext)

export const NfiProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const index = useFetcher(api.nfi.index)

  return (
    <_NfiContext.Provider value={{
      index,
    }}>
      {children}
    </_NfiContext.Provider>
  )
}
