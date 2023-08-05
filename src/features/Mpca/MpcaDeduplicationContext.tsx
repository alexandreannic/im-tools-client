import React, {ReactNode, useContext, useEffect} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo, koboDrcUaFormId, koboServerId} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPaymentSdk'

export interface MpcaDeduplicationContext {
  _koboAnswers: UseFetcher<() => Promise<_Arr<KoboAnswer<BNRE>>>>
  _form: UseFetcher<() => Promise<KoboApiForm>>
  _getPayments: UseFetcher<() => Promise<MpcaPayment[]>>
  _create: UseAsync<(_: string[]) => Promise<MpcaPayment>>
}

const Context = React.createContext({} as MpcaDeduplicationContext)

export const useMPCADeduplicationContext = () => useContext(Context)

export const MPCADeduplicationProvider = ({
  children,
  sdk = new MicrosoftGraphClient(),
}: {
  sdk?: MicrosoftGraphClient
  children: ReactNode
}) => {
  const {api} = useAppSettings()

  const _form = useFetcher(() => api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.BNRE))
  const _getPayments = useFetcher(api.mpcaPayment.getAll)
  const _create = useAsync(api.mpcaPayment.create)

  const _koboAnswers = useFetcher(() => api.kobo.answer.searchBnre().then(_ => Arr(_.data)))

  useEffect(() => {
    // MpcaDeduplicationDb.build({db, sdk}).then(() => {
    //   setDeduplicationDb(() => db)
    // })
  }, [])


  return (
    <Context.Provider value={{
      _koboAnswers,
      _form,
      _getPayments,
      _create,
    }}>
      {children}
    </Context.Provider>
  )
}