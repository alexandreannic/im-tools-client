import React, {ReactNode, useContext} from 'react'

export interface Seed__Context {
}

const _Seed__Context = React.createContext({} as Seed__Context)

export const useSeed__Context = () => useContext<Seed__Context>(_Seed__Context)

export const Seed__Provider = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <_Seed__Context.Provider value={{
      
    }}>
      {children}
    </_Seed__Context.Provider>
  )
}
