import React, {ReactNode, useContext} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

export interface MealVerificationContext {
  fetcherVerifications: UseFetcher<ApiSdk['mealVerification']['getAll']>
}

const Context = React.createContext({} as MealVerificationContext)

export const useMealVerificationContext = () => useContext<MealVerificationContext>(Context)

export const MealVerificationProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const fetcherGetAll = useFetcher(api.mealVerification.getAll)

  return (
    <Context.Provider value={{
      fetcherVerifications: fetcherGetAll,
    }}>
      {children}
    </Context.Provider>
  )
}
