import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {DrcSupportSuggestion, WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {DrcDonor, DrcProject} from '@/core/drcUa'
import {OblastIndex, OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'

// [DONORS according to Alix]

// CASH for Repairs
//  si c'est le cash for repair a Mykolaiv c'est Danish MFA - UKR-000301
//  Si c'est celui de Lviv, c'est Pooled Funds: 000270

// Emergency DAM:
//   Danish MFA - UKR-000301 & Pooled Funds: 000270 (Kherson Registration); Novo Nordisk 000298 (Mykolaiv Registration)

export enum MpcaRowSource {
  RRM = 'RRM',
  CashForRent = 'CashForRent',
  CashForRepair = 'CashForRepair',
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
  oblast?: OblastName | ''
  oblastIso?: OblastISO | ''
  date: Date
  prog?: MpcaProgram[]
  donor?: DrcDonor
  project?: DrcProject
  amountUahSupposed?: number
  amountUahDedup?: number
  amountUahFinal?: number
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
  girls?: number
  boys?: number
  men?: number
  women?: number
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

  const _form = useFetcher(() => api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.bn_re))
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
        return _.data.forEach(_ => {
          const group = [..._.hh_char_hh_det ?? [], {hh_char_hh_det_age: _.hh_char_hhh_age, hh_char_hh_det_gender: _.hh_char_hhh_gender}]
          res.push({
            source: MpcaRowSource.BNRE,
            id: _.id,
            date: _.submissionTime,
            oblast: fnSwitch(_.ben_det_oblast, KoboSafetyIncidentHelper.mapOblast, () => ''),
            oblastIso: fnSwitch(_.ben_det_oblast, KoboSafetyIncidentHelper.mapOblastIso, () => ''),
            prog: Arr(_.back_prog_type)?.map(prog => fnSwitch(prog.split('_')[0], {
              'cfr': MpcaProgram.CashForRent,
              'cfe': MpcaProgram.CashForEducation,
              'mpca': MpcaProgram.MPCA,
            }, () => undefined)).compact(),
            hhSize: _.ben_det_hh_size,
            men: group?.filter(p => p.hh_char_hh_det_age && p.hh_char_hh_det_age >= 18 && p.hh_char_hh_det_gender === 'male').length,
            women: group?.filter(p => p.hh_char_hh_det_age && p.hh_char_hh_det_age >= 18 && p.hh_char_hh_det_gender === 'female').length,
            boys: group?.filter(p => p.hh_char_hh_det_age && p.hh_char_hh_det_age < 18 && p.hh_char_hh_det_gender === 'male').length,
            girls: group?.filter(p => p.hh_char_hh_det_age && p.hh_char_hh_det_age < 18 && p.hh_char_hh_det_gender === 'female').length,
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
            passportSerie: _.pay_det_pass_ser,
            passportNum: _.pay_det_pass_num,
            taxId: _.pay_det_tax_id_num,
            taxIdFileName: _.pay_det_tax_id_ph,
            taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
            idFileName: _.pay_det_id_ph,
            idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
            phone: _.ben_det_ph_number ? '' + _.ben_det_ph_number : undefined,
          })
        })
      }),

      // api.kobo.answer.searchBn_cashForRentApplication(filters).then(_ => {
      //   return _.data.forEach(_ => res.push({
      //     source: MpcaRowSource.CashForRent,
      //     prog: [MpcaProgram.CashForRent],
      //     oblast: fnSwitch(_.ben_det_oblast ?? (_ as any).ben_det_oblastgov!, KoboSafetyIncidentHelper.mapOblast, () => undefined),
      //     oblastIso: fnSwitch(_.ben_det_oblast ?? (_ as any).ben_det_oblastgov!, KoboSafetyIncidentHelper.mapOblastIso, () => undefined),
      //     id: _.id,
      //     date: _.submissionTime,
      //     donor: undefined,
      //     lastName: _.ben_last_name,
      //     firstName: _.ben_first_name,
      //     patronyme: _.ben_first_patr,
      //     hhSize: _.ben_det_hh_size,
      //     // passportSerie: _.pay_det_pass_ser,
      //     passportNum: undefined,
      //     taxId: undefined,
      //     taxIdFileName: _.pay_det_tax_id_ph,
      //     taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
      //     idFileName: _.pay_det_id_ph,
      //     idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
      //     phone: _.bin ? '' + _.bin : undefined,
      //   }))
      // }),

      api.kobo.answer.searcheBn_cashForRepair(filters)
        .then(_ => {
          return _.data.forEach(_ => res.push({
            source: MpcaRowSource.CashForRepair,
            prog: [MpcaProgram.CashForRent],
            oblast: fnSwitch(_.ben_det_oblast ?? (_ as any).ben_det_oblastgov!, KoboSafetyIncidentHelper.mapOblast, () => undefined),
            oblastIso: fnSwitch(_.ben_det_oblast ?? (_ as any).ben_det_oblastgov!, KoboSafetyIncidentHelper.mapOblastIso, () => undefined),
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

      api.kobo.answer.searchBn_RapidResponseMechanism({
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
        return _.data.forEach(_ => {
          const group = [..._.hh_char_hh_det_l ?? [], {hh_char_hh_det_age_l: _.hh_char_hhh_age_l, hh_char_hh_det_gender_l: _.hh_char_hhh_gender_l}]
          res.push({
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
            oblast: fnSwitch(_.ben_det_oblast ?? _.ben_det_oblast_l!, KoboSafetyIncidentHelper.mapOblast, () => _.submissionTime.getMonth() === 5 ? 'Mykolaivska' : undefined),
            oblastIso: fnSwitch(_.ben_det_oblast ?? _.ben_det_oblast_l!, KoboSafetyIncidentHelper.mapOblastIso, () => _.submissionTime.getMonth() === 5 ? 'UA48' : undefined),
            // amountUahSupposed: _.ass_inc_mpca_ben_l as any,
            id: _.id,
            date: _.submissionTime,
            benefStatus: _.ben_det_res_stat_l,
            lastName: _.ben_det_surname ?? _.ben_det_surname,
            firstName: _.ben_det_first_name ?? _.ben_det_first_name,
            patronyme: _.ben_det_pat_name ?? _.ben_det_pat_name,
            hhSize: _.ben_det_hh_size ?? _.ben_det_hh_size_l,
            men: group?.filter(p => p.hh_char_hh_det_age_l && p.hh_char_hh_det_age_l >= 18 && p.hh_char_hh_det_gender_l === 'male').length,
            women: group?.filter(p => p.hh_char_hh_det_age_l && p.hh_char_hh_det_age_l >= 18 && p.hh_char_hh_det_gender_l === 'female').length,
            boys: group?.filter(p => p.hh_char_hh_det_age_l && p.hh_char_hh_det_age_l < 18 && p.hh_char_hh_det_gender_l === 'male').length,
            girls: group?.filter(p => p.hh_char_hh_det_age_l && p.hh_char_hh_det_age_l < 18 && p.hh_char_hh_det_gender_l === 'female').length,
            passportSerie: _.pay_det_pass_ser ?? _.pay_det_pass_ser_l,
            passportNum: _.pay_det_pass_num ?? _.pay_det_pass_num_l,
            taxId: _.pay_det_tax_id_num ?? _.pay_det_tax_id_num_l,
            taxIdFileName: _.pay_det_tax_id_ph ?? _.pay_det_tax_id_ph_l,
            taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
            idFileName: _.pay_det_id_ph ?? _.pay_det_id_ph_l,
            idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
            phone: _.ben_det_ph_number ? '' + _.ben_det_ph_number : undefined,
          })
        })
      }),

      api.kobo.answer.searchBn_MpcaNfiOld({
        filters: {
          filterBy: [{
            column: 'Programme',
            value: ['cash_for_rent', 'mpca'],
            type: 'array',
          }]
        }
      }).then(_ => {
        return _.data.forEach(_ => {
          const group = [..._.group_in3fh72 ?? [], {GenderHH: _.gender_respondent, AgeHH: _.agex}]
          res.push({
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
            oblast: fnSwitch(_.oblast, KoboSafetyIncidentHelper.mapOblast, () => undefined),
            oblastIso: fnSwitch(_.oblast, KoboSafetyIncidentHelper.mapOblastIso, () => undefined),
            donor: DrcDonor.BHA,
            project: DrcProject['BHA (UKR-000284)'],
            benefStatus: fnSwitch(_.status!, {
              status_idp: 'idp',
              status_conflict: 'long_res',
              status_returnee: 'ret',
              status_refugee: 'ref_asy',
            }),
            men: group.filter(p => p.AgeHH && p.AgeHH >= 18 && p.GenderHH === 'male').length,
            women: group.filter(p => p.AgeHH && p.AgeHH >= 18 && p.GenderHH === 'female').length,
            boys: group.filter(p => p.AgeHH && p.AgeHH < 18 && p.GenderHH === 'male').length,
            girls: group.filter(p => p.AgeHH && p.AgeHH < 18 && p.GenderHH === 'female').length,
            lastName: _.patron,
            firstName: _.name_resp,
            patronyme: _.last_resp,
            hhSize: _.Total_Family,
            passportSerie: _.passport_serial,
            passportNum: _.passport_number,
            taxId: _.ITN,
            taxIdFileName: _.photo_reg_passport,
            taxIdFileURL: _.attachments.find(x => x.filename.includes(_.Photo_of_IDP_Certificate_001)),
            idFileName: _.photo_reg_passport_001,
            idFileURL: _.attachments.find(x => x.filename.includes(_.photo_reg_passport_001) || x.filename.includes(_.photo_reg_passport)),
            phone: _.phone ? '' + _.phone : undefined,
          })
        })
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
      row.amountUahSupposed = row.hhSize ? row.hhSize * 3 * 2220 : undefined
      if (!row.taxId) return row
      const dedup = fetcherDeduplication.entity![row.taxId]
      if (!dedup || dedup.length === 0) return row
      dedup
        .filter(_ => _.createdAt.getTime() > row.date.getTime())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      row.deduplication = dedup.pop()
      fetcherDeduplication.entity![row.taxId] = dedup
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
      return {...row}
    }).map(row => {
      row.amountUahFinal = row.amountUahDedup ?? row.amountUahSupposed
      return {...row}
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