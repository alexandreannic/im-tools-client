import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {MpcaType, MpcaTypeTag} from '@/core/sdk/server/mpca/MpcaType'
import {Seq, seq} from '@alexandreannic/ts-utils'
import {KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'

// [DONORS according to Alix]

// CASH for Repairs
//  si c'est le cash for repair a Mykolaiv c'est Danish MFA - UKR-000301
//  Si c'est celui de Lviv, c'est Pooled Funds: 000270

// Emergency DAM:
//   Danish MFA - UKR-000301 & Pooled Funds: 000270 (Kherson Registration); Novo Nordisk 000298 (Mykolaiv Registration)

interface UpdateTag<K extends keyof MpcaTypeTag> {
  formId: KoboId
  answerIds: KoboAnswerId[],
  key: K,
  value: MpcaTypeTag[K] | null
}

export interface MpcaContext {
  data?: Seq<MpcaType>
  formNameTranslation: Record<string, string>
  asyncUpdates: UseAsync<<K extends keyof MpcaTypeTag>(_: UpdateTag<K>) => Promise<void>>
  fetcherData: UseFetcher<(filters?: KoboAnswerFilter) => Promise<Seq<MpcaType>>>
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

  const fetcherData = useFetcher((_?: KoboAnswerFilter) => api.mpca.search(_).then(_ => seq(_.data)) as Promise<Seq<MpcaType>>)
  const dataIndex = useMemo(() => {
    const index: Record<KoboAnswerId, number> = {}
    fetcherData.entity?.forEach((_, i) => {
      index[_.id] = i
    })
    return index
  }, [fetcherData.entity])

  useEffect(() => {
    fetcherData.fetch()
  }, [])

  const asyncUpdates = useAsync(async <K extends keyof MpcaTypeTag>({
    formId,
    answerIds,
    key,
    value
  }: UpdateTag<K>) => {
    const newTags = {[key]: value}
    await api.kobo.answer.updateTag({
      formId,
      answerIds,
      tags: newTags,
    })
    fetcherData.setEntity(prev => {
      const copy = prev ? seq([...prev]) : seq([])
      answerIds.forEach(id => {
        copy[dataIndex[id]].tags = {
          ...copy[dataIndex[id]].tags,
          ...newTags,
        }
      })
      return copy
    })
  })


  return (
    <Context.Provider value={{
      data: fetcherData.entity,
      fetcherData,
      _getPayments,
      _create,
      asyncUpdates,
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