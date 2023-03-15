import React, {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from './ConfigContext'
import {ApiSdk} from '../sdk/ApiSdk'

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
  const {api} = useConfig()
  const index = useFetcher(api.nfi.index)

  return (
    <_NfiContext.Provider value={{
      index,
    }}>
      {children}
    </_NfiContext.Provider>
  )
}
