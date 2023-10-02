import {OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcDonor, DrcOffice, DrcProject} from '@/core/drcUa'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {MpcaProgram, MpcaRowSource} from '@/features/Mpca/MpcaContext'

export interface Mpca {
  id: number
  source: MpcaRowSource
  oblast?: OblastName
  office?: DrcOffice
  oblastIso?: OblastISO
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

export class MpcaHelper {

  static readonly map = (_: Record<keyof Mpca, any>): Mpca => {
    _.date = new Date(_.date)
    return _
  }
}