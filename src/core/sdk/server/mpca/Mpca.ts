import {OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcDonor, DrcOffice, DrcProject} from '@/core/drcUa'
import {Bn_Re} from '@/core/koboModel/Bn_Re/Bn_Re'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {MpcaProgram, MpcaRowSource} from '@/features/Mpca/MpcaContext'

export interface Mpca {
  id: number
  source: MpcaRowSource
  oblast?: OblastName
  office?: DrcOffice
  oblastIso?: OblastISO
  raion?: string
  hromada?: string
  date: Date
  prog?: MpcaProgram[]
  donor?: DrcDonor
  project?: DrcProject
  amountUahSupposed?: number
  amountUahDedup?: number
  amountUahFinal?: number
  benefStatus?: Bn_Re['ben_det_res_stat']
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
  elderlyMen?: number
  elderlyWomen?: number
}

export class MpcaHelper {

  static readonly map = (_: Record<keyof Mpca, any>): Mpca => {
    _.date = new Date(_.date)
    return _
  }
}