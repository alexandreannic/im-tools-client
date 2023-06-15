import React, {ReactNode, useContext} from 'react'

type Theme = 'dashboard' | 'pdf'

export interface DashboardContext {
}

const Context = React.createContext({} as DashboardContext)

export const useDashboardContext = () => useContext<DashboardContext>(Context)

export const DashboardProvider = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <Context.Provider value={{}}>
      {children}
    </Context.Provider>
  )
}