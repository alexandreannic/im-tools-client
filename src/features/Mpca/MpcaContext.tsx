import React, {ReactNode, useContext} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'

export interface MpcaContext {
}

export const Context = React.createContext({} as MpcaContext)

export const useMpcaContext = () => useContext(Context)

export const MpcaContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  return (
    <Context.Provider value={{}}>
      {children}
    </Context.Provider>
  )
}
