import React, {ReactNode, useContext, useEffect} from 'react'
import {MicrosoftGraphClient} from '@/core/sdk/microsoftGraph/microsoftGraphClient'
import {UseAsync, useAsync, UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {Arr, fnSwitch} from '@alexandreannic/ts-utils'
import {MpcaPayment} from '@/core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'

export enum MpcaRowSource {
  RRM = 'RRM',
  CFR = 'CFR',
  BNRE = 'BNRE',
  Old = 'Old',
}

export interface MpcaRow {
  id: number
  source: MpcaRowSource
  date: Date
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

export interface MpcaDeduplicationContext {
  fetcherData: UseFetcher<() => Promise<MpcaRow[]>>
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
  //
  // const fetcherBnre = useFetcher(() => api.kobo.answer.searchBnre()
  //   .then(_ => _.data.filter(d => d.back_prog_type.find(_ => _.includes('cfe') || _.includes('cfr') || _.includes('mpca')))))
  // const fetcherCashForRepair = useFetcher(() => api.kobo.answer.searchShelter_cashForRepair()
  //   .then(_ => _.data))
  // const fetcherRmm = useFetcher(() => api.kobo.answer.searchRapidResponseMechanism()
  //   .then(_ => _.data.filter(d => d.back_prog_type?.includes('mpca'))))
  // const deduplication = useFetcher(() => api.wfpDeduplication.search())

  const fetcherData = useFetcher(async () => {
    const res: MpcaRow[] = []
    const [
      bnre,
      cfr,
      rrm,
      old,
      deduplication,
    ] = await Promise.all([
      api.kobo.answer.searchBnre()
        .then(_ => _.data.filter(d => d.back_prog_type.find(_ => _.includes('cfe') || _.includes('cfr') || _.includes('mpca')))),
      api.kobo.answer.searchShelter_cashForRepair()
        .then(_ => _.data),
      api.kobo.answer.searchRapidResponseMechanism()
        .then(_ => _.data.filter(d => d.back_prog_type?.includes('mpca'))),
      api.kobo.answer.searchMpcaNfiOld()
        .then(_ => _.data.filter(d => d.Programme?.includes('cash_for_rent') || d.Programme?.includes('mpca'))),
      api.wfpDeduplication.search()
        .then(_ => Arr(_.data).groupBy(_ => _.taxId!))
    ])
    bnre.forEach(_ => res.push({
      source: MpcaRowSource.BNRE,
      id: _.id,
      date: _.start,
      benefStatus: _.ben_det_res_stat,
      lastName: _.ben_det_surname,
      firstName: _.ben_det_first_name,
      patronyme: _.ben_det_pat_name,
      hhSize: _.hh_char_hh_det?.length,
      passportSerie: _.pay_det_pass_ser,
      passportNum: _.pay_det_pass_num,
      taxId: _.pay_det_tax_id_num,
      taxIdFileName: _.pay_det_tax_id_ph,
      taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
      idFileName: _.pay_det_id_ph,
      idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
      phone: '' + _.ben_det_ph_number,
    }))
    old.forEach(_ => res.push({
      source: MpcaRowSource.Old,
      id: _.id,
      date: _.start,
      benefStatus: fnSwitch(_.status!, {
        status_idp: 'idp',
        status_conflict: 'long_res',
        status_returnee: 'ret',
        status_refugee: 'ref_asy',
      }),
      lastName: _.patron,
      firstName: _.name_resp,
      patronyme: _.last_resp,
      hhSize: _.group_in3fh72?.length + 1,
      passportSerie: _.passport_serial,
      passportNum: _.passport_number,
      taxId: _.ITN,
      taxIdFileName: _.photo_reg_passport,
      taxIdFileURL: _.attachments.find(x => x.filename.includes(_.Photo_of_IDP_Certificate_001)),
      idFileName: _.photo_reg_passport_001,
      idFileURL: _.attachments.find(x => x.filename.includes(_.photo_reg_passport_001) || x.filename.includes(_.photo_reg_passport)),
      phone: '' + _.phone,
    }))
    cfr.forEach(_ => res.push({
      source: MpcaRowSource.CFR,
      id: _.id,
      date: _.start,
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
      phone: '' + _.bin,
    }))
    rrm.forEach(_ => res.push({
      source: MpcaRowSource.RRM,
      id: _.id,
      date: _.start,
      benefStatus: _.ben_det_res_stat_l,
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
      phone: '' + _.ben_det_ph_number,
    }))
    return res
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(row => {
        if (!row.taxId) return row
        const dedup = deduplication[row.taxId]
        if (!dedup || dedup.length === 0) return row
        dedup
          .filter(_ => _.createdAt.getTime() > row.date.getTime())
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        row.deduplication = dedup.pop()
        deduplication[row.taxId] = dedup
        return row
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  useEffect(() => {
    fetcherData.fetch()
  }, [])


  return (
    <Context.Provider value={{
      fetcherData,
      _getPayments,
      _create,
    }}>
      {children}
    </Context.Provider>
  )
}