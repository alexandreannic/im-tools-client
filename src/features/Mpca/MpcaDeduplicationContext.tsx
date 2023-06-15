import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {MicrosoftGraphClient} from '../../core/sdk/microsoftGraph/microsoftGraphClient'
import {MpcaDeduplicationDb} from './MpcaDeduplicationDb'
import Loki from 'lokijs'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {koboFormId, koboServerId} from '../../koboFormId'
import {mapBNRE} from '../../core/koboModel/BNRE/BNREMapping'
import {useConfig} from '../../core/context/ConfigContext'
import {ApiClient} from '../../core/sdk/server/ApiClient'
import {ApiSdk} from '../../core/sdk/server/ApiSdk'
import {KoboApiSdk} from '../../core/sdk/server/kobo/KoboApiSdk'
import {BNRE} from '../../core/koboModel/BNRE/BNRE'
import {KoboAnswer2} from '../../core/sdk/server/kobo/Kobo'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {KoboApiForm} from '../../core/sdk/server/kobo/KoboApi'
import {MpcaPayment} from '../../core/sdk/server/mpcaPaymentTool/MpcaPaymentSdk'

export interface MpcaDeduplicationContext {
  deduplicationDb: MpcaDeduplicationDb | undefined
  _koboAnswers: UseFetcher<() => Promise<_Arr<KoboAnswer2<BNRE>>>>
  _form: UseFetcher<() => Promise<KoboApiForm>>
  _getPayments: UseFetcher<() => Promise<MpcaPayment[]>>
  _create: UseAsync<(_: string[]) => Promise<MpcaPayment>>
}

const Context = React.createContext({} as MpcaDeduplicationContext)

export const useMPCADeduplicationContext = () => useContext(Context)

export const MPCADeduplicationProvider = ({
  children,
  sdk = new MicrosoftGraphClient(),
  db,
}: {
  db: MpcaDeduplicationDb
  sdk?: MicrosoftGraphClient
  children: ReactNode
}) => {
  const [deduplicationDb, setDeduplicationDb] = useState<MpcaDeduplicationDb | undefined>()
  const {api} = useConfig()

  const _form = useFetcher(() => api.koboApi.getForm(koboServerId.prod, koboFormId.prod.BNRE))
  const _getPayments = useFetcher(api.mpcaPayment.getAll)
  const _create = useAsync(api.mpcaPayment.create)

  const _koboAnswers = useFetcher(() => api.koboForm.getAnswers<BNRE>({
    formId: koboFormId.prod.BNRE,
    fnMap: mapBNRE,
  }).then(_ => Arr(_.data)))

  useEffect(() => {
    MpcaDeduplicationDb.build({db, sdk}).then(() => {
      setDeduplicationDb(() => db)
    })
  }, [])


  return (
    <Context.Provider value={{
      _koboAnswers,
      _form,
      _getPayments,
      _create,
      deduplicationDb
    }}>
      {children}
    </Context.Provider>
  )
}