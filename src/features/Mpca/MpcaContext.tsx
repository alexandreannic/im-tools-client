import React, {ReactNode, useContext, useEffect} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {Mpca} from '@/core/sdk/server/mpca/Mpca'
import {Seq, seq} from '@alexandreannic/ts-utils'

// [DONORS according to Alix]

// CASH for Repairs
//  si c'est le cash for repair a Mykolaiv c'est Danish MFA - UKR-000301
//  Si c'est celui de Lviv, c'est Pooled Funds: 000270

// Emergency DAM:
//   Danish MFA - UKR-000301 & Pooled Funds: 000270 (Kherson Registration); Novo Nordisk 000298 (Mykolaiv Registration)

export enum MpcaRowSource {
  RapidResponseMechansim = 'RapidResponseMechansim',
  CashForRent = 'CashForRent',
  CashForRepairRegistration = 'CashForRepairRegistration',
  BasicNeedRegistration = 'BasicNeedRegistration',
  OldBNRE = 'OldBNRE',
}

export enum MpcaProgram {
  CashForRent = 'CashForRent',
  CashForEducation = 'CashForEducation',
  MPCA = 'MPCA',
}

export interface MpcaContext {
  data?: Seq<Mpca>
  formNameTranslation: Record<string, string>
  fetcherData: UseFetcher<(filters?: KoboAnswerFilter) => Promise<Seq<Mpca>>>
  _getPayments: UseFetcher<() => Promise<MpcaPayment[]>>
  _create: UseAsync<(_: string[]) => Promise<MpcaPayment>>
}

const Context = React.createContext({} as MpcaContext)

export const useMPCAContext = () => useContext(Context)

export const MPCAProvider = ({
  children,
  sdk = new MicrosoftGraphClient(),
}: {
  sdk?: MicrosoftGraphClient
  children: ReactNode
}) => {
  const {api} = useAppSettings()

  const _form = useFetcher(() => api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.bn_re))
  const _getPayments = useFetcher(api.mpcaPayment.getAll)
  const _create = useAsync(api.mpcaPayment.create)//

  const fetcherData = useFetcher((_?: KoboAnswerFilter) => api.mpca.search(_).then(_ => seq(_.data)) as Promise<Seq<Mpca>>)

  useEffect(() => {
    fetcherData.fetch()
  }, [])

  return (
    <Context.Provider value={{
      data: fetcherData.entity,
      fetcherData,
      _getPayments,
      _create,
      formNameTranslation: {
        BNRE: 'Basic Need Registration & Evaluation',
        CashForRent: 'Cash for Rent Application',
        CashForRepairRegistration: 'Cash For Repair Registration',
        RRM: 'Rapid Response Mechanism',
        OldBNRE: 'Basic Need Registration (Old version)',
      }
    }}>
      {children}
    </Context.Provider>
  )
}