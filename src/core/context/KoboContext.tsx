import React, {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from './ConfigContext'
import {koboFormId} from '../../koboFormId'
import {AnswersFilters} from 'core/sdk/kobo/KoboClient'
import {ApiPaginate} from '../type'
import {KoboAnswer} from '../sdk/kobo/KoboType'

export interface KoboContext {
  hh: UseFetcher<(_: AnswersFilters) => Promise<ApiPaginate<KoboAnswer>>>
}

const _KoboContext = React.createContext({} as KoboContext)

export const useKoboContext = () => useContext<KoboContext>(_KoboContext)

export const KoboProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useConfig()
  const hh = useFetcher((_: AnswersFilters = {}) => api.kobo.getAnswers(koboFormId.prod.protectionHh, _))

  return (
    <_KoboContext.Provider value={{
      hh,
    }}>
      {children}
    </_KoboContext.Provider>
  )
}
