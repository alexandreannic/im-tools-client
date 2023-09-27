import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {_Arr, Arr, fnSwitch} from '@alexandreannic/ts-utils'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {DrcDonor, DrcProject} from '@/core/drcUa'

export enum MpcaRowSource {
  RRM = 'RRM',
  CFR = 'CFR',
  BNRE = 'BNRE',
  Old_form = 'Old_form',
}

export enum MpcaProgram {
  CashForRent = 'CashForRent',
  CashForEducation = 'CashForEducation',
  MPCA = 'MPCA',
}

export interface MpcaRow {
  id: number
  source: MpcaRowSource
  date: Date
  prog?: MpcaProgram[]
  donor?: DrcDonor
  project?: DrcProject
  amountUahSupposed?: number
  amountUahAfterDedup?: number
  benefStatus?: BNRE['ben_det_res_stat']
  lastName?: string
  firstName?: string
  patronyme?: string
  hhSize?: number
  passportSerie?: string
  passportNum?: string
  taxId?: string
  taxIdFileName?: string
  taxIdFileURL?: KoboAttachment
  idFileName?: string
  idFileURL?: KoboAttachment
  phone?: string
  deduplication?: WfpDeduplication
}

export interface MpcaContext {
  data?: _Arr<MpcaRow>
  fetcherDeduplication: UseFetcher<() => Promise<Record<string, WfpDeduplication[]>>>
  fetcherData: UseFetcher<(filters?: KoboAnswerFilter) => Promise<_Arr<MpcaRow>>>
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

  const _form = useFetcher(() => api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.BNRE))
  const _getPayments = useFetcher(api.mpcaPayment.getAll)
  const _create = useAsync(api.mpcaPayment.create)//

  const fetcherDeduplication = useFetcher(() => api.wfpDeduplication.search().then(_ => Arr(_.data).groupBy(_ => _.taxId!)) as Promise<Record<string, WfpDeduplication[]>>)

  const fetcherData = useFetcher(async (filters: KoboAnswerFilter = {}) => {
    const res: MpcaRow[] = []
    await Promise.all([
      api.kobo.answer.searchBnre({
        filters: {
          filterBy: [
            {column: 'back_prog_type', value: ['cfe', 'cfr', 'mpca']},
          ]
        }
      }).then(_ => {
        return _.data.forEach(_ => res.push({
          source: MpcaRowSource.BNRE,
          id: _.id,
          date: _.submissionTime,
          prog: Arr(_.back_prog_type)?.map(prog => fnSwitch(prog.split('_')[0], {
            'cfr': MpcaProgram.CashForRent,
            'cfe': MpcaProgram.CashForEducation,
            'mpca': MpcaProgram.MPCA,
          }, () => undefined)).compact(),
          donor: fnSwitch(_.back_donor!, {
            uhf_chj: DrcDonor.UHF,
            uhf_dnk: DrcDonor.UHF,
            uhf_hrk: DrcDonor.UHF,
            uhf_lwo: DrcDonor.UHF,
            uhf_nlv: DrcDonor.UHF,
            bha_lwo: DrcDonor.BHA,
            bha_chj: DrcDonor.BHA,
            bha_dnk: DrcDonor.BHA,
            bha_hrk: DrcDonor.BHA,
            bha_nlv: DrcDonor.BHA,
            echo_chj: DrcDonor.ECHO,
            echo_dnk: DrcDonor.ECHO,
            echo_hrk: DrcDonor.ECHO,
            echo_lwo: DrcDonor.ECHO,
            echo_nlv: DrcDonor.ECHO,
            novo_nlv: DrcDonor.NONO,
            okf_lwo: DrcDonor.OKF,
            pool_chj: DrcDonor.POFU,
            pool_dnk: DrcDonor.POFU,
            pool_hrk: DrcDonor.POFU,
            pool_lwo: DrcDonor.POFU,
            pool_nlv: DrcDonor.POFU,
          }, () => undefined),
          project: fnSwitch(_.back_donor!, {
            uhf_chj: DrcProject['UHF4 (UKR-000314)'],
            uhf_dnk: DrcProject['UHF4 (UKR-000314)'],
            uhf_hrk: DrcProject['UHF4 (UKR-000314)'],
            uhf_lwo: DrcProject['UHF4 (UKR-000314)'],
            uhf_nlv: DrcProject['UHF4 (UKR-000314)'],
            bha_lwo: DrcProject['BHA (UKR-000284)'],
            bha_chj: DrcProject['BHA (UKR-000284)'],
            bha_dnk: DrcProject['BHA (UKR-000284)'],
            bha_hrk: DrcProject['BHA (UKR-000284)'],
            bha_nlv: DrcProject['BHA (UKR-000284)'],
            echo_chj: DrcProject['ECHO2 (UKR-000322)'],
            echo_dnk: DrcProject['ECHO2 (UKR-000322)'],
            echo_hrk: DrcProject['ECHO2 (UKR-000322)'],
            echo_lwo: DrcProject['ECHO2 (UKR-000322)'],
            echo_nlv: DrcProject['ECHO2 (UKR-000322)'],
            novo_nlv: DrcProject['Novo-Nordisk (UKR-000274)'],
            okf_lwo: DrcProject['OKF (UKR-000309)'],
            pool_chj: DrcProject['Pooled Funds (UKR-000270)'],
            pool_dnk: DrcProject['Pooled Funds (UKR-000270)'],
            pool_hrk: DrcProject['Pooled Funds (UKR-000270)'],
            pool_lwo: DrcProject['Pooled Funds (UKR-000270)'],
            pool_nlv: DrcProject['Pooled Funds (UKR-000270)'],
          }, () => undefined),
          benefStatus: _.ben_det_res_stat,
          lastName: _.ben_det_surname,
          firstName: _.ben_det_first_name,
          patronyme: _.ben_det_pat_name,
          hhSize: _.ben_det_hh_size,
          passportSerie: _.pay_det_pass_ser,
          passportNum: _.pay_det_pass_num,
          taxId: _.pay_det_tax_id_num,
          taxIdFileName: _.pay_det_tax_id_ph,
          taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
          idFileName: _.pay_det_id_ph,
          idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
          phone: _.ben_det_ph_number ? '' + _.ben_det_ph_number : undefined,
        }))
      }),

      api.kobo.answer.searchShelter_cashForRepair(filters)
        .then(_ => {
          return _.data.forEach(_ => res.push({
            source: MpcaRowSource.CFR,
            prog: [MpcaProgram.CashForRent],
            id: _.id,
            date: _.submissionTime,
            donor: undefined,
            lastName: _.bis,
            firstName: _.bif,
            patronyme: _.bip,
            hhSize: _.bihm,
            // passportSerie: _.pay_det_pass_ser,
            passportNum: _.pay_det_pass_num,
            taxId: _.pay_det_tax_id_num,
            taxIdFileName: _.pay_det_tax_id_ph,
            taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
            idFileName: _.pay_det_id_ph,
            idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
            phone: _.bin ? '' + _.bin : undefined,
          }))
        }),

      api.kobo.answer.searchRapidResponseMechanism({
        filters: {
          filterBy: [
            {column: 'back_prog_type', value: ['mpca', null]},
            {
              column: 'back_prog_type_l', value: [
                'mpca_lwo',
                'mpca_nlv',
                'mpca_dnk',
                'mpca_hrk',
                'mpca_chj',
                'cfr_lwo',
                'cfr_dnk',
                'cfr_chj',
                'cfe_lwo',
                null
              ]
            },
          ]
        }
      }).then(_ => {
        return _.data.forEach(_ => res.push({
          source: MpcaRowSource.RRM,
          prog: Arr(_.back_prog_type ?? _.back_prog_type_l).map(prog => fnSwitch(prog.split('_')[0], {
            'cfr': MpcaProgram.CashForRent,
            'cfe': MpcaProgram.CashForEducation,
            'mpca': MpcaProgram.MPCA,
          }, () => undefined)).compact(),
          donor: (() => {
            if (_.back_donor)
              return fnSwitch(_.back_donor!, {
                echo: DrcDonor.ECHO,
                uhf_4: DrcDonor.UHF,
                bha: DrcDonor.BHA,
                novo: DrcDonor.NONO,
                pooled: DrcDonor.POFU,
              }, () => undefined)
            else if (_.back_donor_l)
              return fnSwitch(_.back_donor_l, {
                'uhf_chj': DrcDonor.UHF,
                'uhf_dnk': DrcDonor.UHF,
                'uhf_hrk': DrcDonor.UHF,
                'uhf_lwo': DrcDonor.UHF,
                'uhf_nlv': DrcDonor.UHF,
                'bha_lwo': DrcDonor.BHA,
                'bha_chj': DrcDonor.BHA,
                'bha_dnk': DrcDonor.BHA,
                'bha_hrk': DrcDonor.BHA,
                'bha_nlv': DrcDonor.BHA,
                'echo_chj': DrcDonor.ECHO,
                'echo_dnk': DrcDonor.ECHO,
                'echo_hrk': DrcDonor.ECHO,
                'echo_lwo': DrcDonor.ECHO,
                'echo_nlv': DrcDonor.ECHO,
                'novo_nlv': DrcDonor.NONO,
                'okf_lwo': DrcDonor.OKF,
                'pool_chj': DrcDonor.POFU,
                'pool_dnk': DrcDonor.POFU,
                'pool_hrk': DrcDonor.POFU,
                'pool_lwo': DrcDonor.POFU,
                'pool_nlv': DrcDonor.POFU,
              }, () => undefined)
          })(),
          project: (() => {
            if (_.back_donor)
              return fnSwitch(_.back_donor, {
                echo: DrcProject['ECHO2 (UKR-000322)'],
                uhf_4: DrcProject['UHF4 (UKR-000314)'],
                bha: DrcProject['BHA (UKR-000284)'],
                novo: DrcProject['Novo-Nordisk (UKR-000274)'],
                pooled: DrcProject['Pooled Funds (UKR-000270)'],
              }, () => undefined)
            else if (_.back_donor_l)
              return fnSwitch(_.back_donor_l, {
                'uhf_chj': DrcProject[`UHF4 (UKR-000314)`],
                'uhf_dnk': DrcProject[`UHF4 (UKR-000314)`],
                'uhf_hrk': DrcProject[`UHF4 (UKR-000314)`],
                'uhf_lwo': DrcProject[`UHF4 (UKR-000314)`],
                'uhf_nlv': DrcProject[`UHF4 (UKR-000314)`],
                'bha_lwo': DrcProject[`BHA (UKR-000284)`],
                'bha_chj': DrcProject[`BHA (UKR-000284)`],
                'bha_dnk': DrcProject[`BHA (UKR-000284)`],
                'bha_hrk': DrcProject[`BHA (UKR-000284)`],
                'bha_nlv': DrcProject[`BHA (UKR-000284)`],
                'echo_chj': DrcProject[`ECHO2 (UKR-000322)`],
                'echo_dnk': DrcProject[`ECHO2 (UKR-000322)`],
                'echo_hrk': DrcProject[`ECHO2 (UKR-000322)`],
                'echo_lwo': DrcProject[`ECHO2 (UKR-000322)`],
                'echo_nlv': DrcProject[`ECHO2 (UKR-000322)`],
                'novo_nlv': DrcProject[`Novo-Nordisk (UKR-000274)`],
                'okf_lwo': DrcProject[`OKF (UKR-000309)`],
                'pool_chj': DrcProject[`Pooled Funds (UKR-000270)`],
                'pool_dnk': DrcProject[`Pooled Funds (UKR-000270)`],
                'pool_hrk': DrcProject[`Pooled Funds (UKR-000270)`],
                'pool_lwo': DrcProject[`Pooled Funds (UKR-000270)`],
                'pool_nlv': DrcProject[`Pooled Funds (UKR-000270)`],
              }, () => undefined)
          })(),
          // amountUahSupposed: _.ass_inc_mpca_ben_l as any,
          id: _.id,
          date: _.submissionTime,
          benefStatus: _.ben_det_res_stat_l,
          lastName: _.ben_det_surname,
          firstName: _.ben_det_first_name,
          patronyme: _.ben_det_pat_name,
          hhSize: _.ben_det_hh_size ?? _.ben_det_hh_size_l,
          passportSerie: _.pay_det_pass_ser,
          passportNum: _.pay_det_pass_num,
          taxId: _.pay_det_tax_id_num,
          taxIdFileName: _.pay_det_tax_id_ph,
          taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
          idFileName: _.pay_det_id_ph,
          idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
          phone: _.ben_det_ph_number ? '' + _.ben_det_ph_number : undefined,
        }))
      }),

      api.kobo.answer.searchMpcaNfiOld({
        filters: {
          filterBy: [{
            column: 'Programme',
            value: ['cash_for_rent', 'mpca'],
            type: 'array',
          }]
        }
      }).then(_ => {
        return _.data.forEach(_ => res.push({
          source: MpcaRowSource.Old_form,
          id: _.id,
          date: _.submissionTime,
          prog: fnSwitch(_.Programme, {
            'mpca': [MpcaProgram.MPCA],
            'mpca___nfi': [MpcaProgram.MPCA],
            'nfi': undefined,
            'cash_for_rent': [MpcaProgram.CashForRent],
            'mpca___cash_for_rent': [MpcaProgram.MPCA, MpcaProgram.CashForRent],
          }, () => undefined),
          donor: DrcDonor.BHA,
          project: DrcProject['BHA (UKR-000284)'],
          benefStatus: fnSwitch(_.status!, {
            status_idp: 'idp',
            status_conflict: 'long_res',
            status_returnee: 'ret',
            status_refugee: 'ref_asy',
          }),
          lastName: _.patron,
          firstName: _.name_resp,
          patronyme: _.last_resp,
          hhSize: _.group_in3fh72?.length + 1 ?? (_ as any).Total_Family,
          passportSerie: _.passport_serial,
          passportNum: _.passport_number,
          taxId: _.ITN,
          taxIdFileName: _.photo_reg_passport,
          taxIdFileURL: _.attachments.find(x => x.filename.includes(_.Photo_of_IDP_Certificate_001)),
          idFileName: _.photo_reg_passport_001,
          idFileURL: _.attachments.find(x => x.filename.includes(_.photo_reg_passport_001) || x.filename.includes(_.photo_reg_passport)),
          phone: _.phone ? '' + _.phone : undefined,
        }))
      })
    ])
    return Arr(res).sort((a, b) => a.date.getTime() - b.date.getTime())
  })

  useEffect(() => {
    fetcherData.fetch()
    fetcherDeduplication.fetch()
  }, [])

  const data = useMemo(() => {
    if (!fetcherData.entity || !fetcherDeduplication.entity) return
    return fetcherData.entity.map(row => {
      if (!row.taxId) return row
      const dedup = fetcherDeduplication.entity![row.taxId]
      if (!dedup || dedup.length === 0) return row
      dedup
        .filter(_ => _.createdAt.getTime() > row.date.getTime())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      row.deduplication = dedup.pop()
      fetcherDeduplication.entity![row.taxId] = dedup
      return row
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
    }}>
      {children}
    </Context.Provider>
  )
}