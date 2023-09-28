import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {SheetUtils} from '@/shared/Sheet/Sheet'
import {Mpca} from '@/core/sdk/server/mpca/Mpca'

// [DONORS according to Alix]

// CASH for Repairs
//  si c'est le cash for repair a Mykolaiv c'est Danish MFA - UKR-000301
//  Si c'est celui de Lviv, c'est Pooled Funds: 000270

// Emergency DAM:
//   Danish MFA - UKR-000301 & Pooled Funds: 000270 (Kherson Registration); Novo Nordisk 000298 (Mykolaiv Registration)

export enum MpcaRowSource {
  RRM = 'RRM',
  CashForRent = 'CashForRent',
  CashForRepairRegistration = 'CashForRepairRegistration',
  BNRE = 'BNRE',
  OldBNRE = 'OldBNRE',
}

export enum MpcaProgram {
  CashForRent = 'CashForRent',
  CashForEducation = 'CashForEducation',
  MPCA = 'MPCA',
}

export interface MpcaContext {
  data?: _Arr<Mpca>
  formNameTranslation: Record<string, string>
  fetcherDeduplication: UseFetcher<() => Promise<Record<string, WfpDeduplication[]>>>
  fetcherData: UseFetcher<(filters?: KoboAnswerFilter) => Promise<_Arr<Mpca>>>
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

  const fetcherDeduplication = useFetcher(() => api.wfpDeduplication.search().then(_ => Arr(_.data).groupBy(_ => _.taxId!)) as Promise<Record<string, WfpDeduplication[]>>)

  const fetcherData = useFetcher((_?: KoboAnswerFilter) => api.mpca.search(_).then(_ => Arr(_.data)) as Promise<_Arr<Mpca>>)

  useEffect(() => {
    fetcherData.fetch()
    fetcherDeduplication.fetch()
  }, [])

  const data = useMemo(() => {
    if (!fetcherData.entity || !fetcherDeduplication.entity) return
    const dedupIndex = {...fetcherDeduplication.entity}
    return fetcherData.entity.map(row => {
      row.amountUahSupposed = row.hhSize ? row.hhSize * 3 * 2220 : undefined
      if (!row.taxId) return row
      const dedup = dedupIndex[row.taxId]
      if (!dedup || dedup.length === 0) return row
      dedup
        .filter(_ => _.createdAt.getTime() > row.date.getTime())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      row.deduplication = dedup.pop()
      if (row.deduplication) {
        row.amountUahDedup = row.deduplication.amount
      }
      // if (row.hhSize)
      //   row.amountUahAfterDedup = fnSwitch(row.deduplication?.suggestion!, {
      //     [DrcSupportSuggestion.OneMonth]: row.hhSize * 2220,
      //     [DrcSupportSuggestion.TwoMonths]: row.hhSize * 2220 * 2,
      //     [DrcSupportSuggestion.NoAssistanceDrcDuplication]: 0,
      //     [DrcSupportSuggestion.NoAssistanceFullDuplication]: 0,
      //   }, () => row.hhSize! * 3 * 2220)
      return row
    }).map(row => {
      return {
        ...row,
        prog: row.prog ?? SheetUtils.blankValue as unknown as undefined,
        oblast: row.oblast ?? SheetUtils.blankValue as unknown as undefined,
        oblastIso: row.oblastIso ?? SheetUtils.blankValue as unknown as undefined,
        project: row.project ?? SheetUtils.blankValue as unknown as undefined,
        donor: row.donor ?? SheetUtils.blankValue as unknown as undefined,
        amountUahFinal: row.amountUahDedup ?? row.amountUahSupposed
      }
    })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [
    fetcherData.entity,
    fetcherDeduplication.entity,
  ])

  return (
    <Context.Provider value={{
      data,
      fetcherDeduplication,
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