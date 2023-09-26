import React, {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from './ConfigContext'
import {ApiSdk} from '../sdk/server/ApiSdk'

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
      index: dataAndex,
    }}>
      {children}
    </_NfiContext.Provider>
  )
}
