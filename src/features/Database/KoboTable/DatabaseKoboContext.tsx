import React, {ReactNode, useContext} from 'react'
import {useAsync} from '@/alexlib-labo/useAsync'
import {KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {UUID} from '@/core/type'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher} from '@alexandreannic/react-hooks-lib'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useAaToast} from '@/core/useToast'

export interface DatabaseKoboContext {
}

const Context = React.createContext({} as DatabaseKoboContext)

export const useDatabaseKoboContext = () => useContext<DatabaseKoboContext>(Context)

export const DatabaseKoboProvider = ({
  serverId,
  formId,
  children,
  fetcherAnswers,
}: {
  fetcherAnswers: UseFetcher<() => ReturnType<ApiSdk['kobo']['answer']['searchByAccess']>>
  serverId: UUID
  formId: KoboId
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const {toastHttpError, toastLoading} = useAaToast()

  const asyncRefresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(serverId, formId)
    await fetcherAnswers.fetch({force: true, clean: false})
  })

  const asyncEdit = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(serverId, formId, answerId).then(_ => {
      if (_.url) {
        window.open(_.url, '_blank')
      }
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  return (
    <Context.Provider value={{}}>
      {children}
    </Context.Provider>
  )
}
