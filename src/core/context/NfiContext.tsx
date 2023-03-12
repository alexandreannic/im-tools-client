import React, {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useApi} from './ApiContext'
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
  const api = useApi()
  const index = useFetcher(api.nfi.index)

  return (
    <_NfiContext.Provider value={{
      index,
    }}>
      {children}
    </_NfiContext.Provider>
  )
}
