import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {MicrosoftGraphClient} from '../../core/sdk/microsoftGraph/microsoftGraphClient'
import {MPCADeduplicationDb} from './MPCADeduplicationDb'
import Loki from 'lokijs'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {koboFormId, koboServerId} from '../../koboFormId'
import {mapBNRE} from '../../core/koboModel/BNRE/BNREMapping'
import {useConfig} from '../../core/context/ConfigContext'
import {ApiClient} from '../../core/sdk/server/ApiClient'
import {ApiSdk} from '../../core/sdk/server/ApiSdk'
import {KoboApiClient} from '../../core/sdk/server/kobo/KoboApiClient'
import {BNRE} from '../../core/koboModel/BNRE/BNRE'
import {KoboAnswer2} from '../../core/sdk/server/kobo/Kobo'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {KoboApiForm} from '../../core/sdk/server/kobo/KoboApi'

export interface MPCADeduplicationContext {
  deduplicationDb: MPCADeduplicationDb | undefined
  _koboAnswers: UseFetcher<() => Promise<_Arr<KoboAnswer2<BNRE>>>>
  _form: UseFetcher<() => Promise<KoboApiForm>>
}

const Context = React.createContext({} as MPCADeduplicationContext)

export const useMPCADeduplicationContext = () => useContext(Context)

export const MPCADeduplicationProvider = ({
  children,
  sdk = new MicrosoftGraphClient(),
  db,
}: {
  db: MPCADeduplicationDb
  sdk?: MicrosoftGraphClient
  children: ReactNode
}) => {
  const [deduplicationDb, setDeduplicationDb] = useState<MPCADeduplicationDb | undefined>()
  const {api} = useConfig()

  const _form = useFetcher(() => api.koboApi.getForm(koboServerId.prod, koboFormId.prod.BNRE))

  const _koboAnswers = useFetcher(() => api.koboForm.getAnswers<BNRE>({
    formId: koboFormId.prod.BNRE,
    fnMap: mapBNRE,
  }).then(_ => Arr(_.data)))

  useEffect(() => {
    MPCADeduplicationDb.build({db, sdk}).then(() => {
      setDeduplicationDb(() => db)
    })
  }, [])


  return (
    <Context.Provider value={{
      _koboAnswers,
      _form,
      deduplicationDb
    }}>
      {children}
    </Context.Provider>
  )
}