import {OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcDonor, DrcOffice, DrcProject} from '@/core/drcUa'
import {Bn_Re} from '@/core/koboModel/Bn_Re/Bn_Re'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {MpcaProgram, MpcaRowSource} from '@/features/Mpca/MpcaContext'
import {Person} from '@/core/type'
import {DeepPartial, Enum} from '@alexandreannic/ts-utils'

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
  persons?: Person.Person[]
  // girls?: number
  // boys?: number
  // men?: number
  // women?: number
  // elderlyMen?: number
  // elderlyWomen?: number
}

export class MpcaHelper {

  static readonly budgets: DeepPartial<Record<DrcProject, Record<DrcOffice, number>>> = {
    [DrcProject['BHA2 (UKR-000345)']]: {
      [DrcOffice.Kharkiv]: 15390000,
      [DrcOffice.Dnipro]: 15390000,
      [DrcOffice.Mykolaiv]: 15390000,
    },
    [DrcProject['Pooled Funds (UKR-000270)']]: {
      [DrcOffice.Kharkiv]: 15431220,
      [DrcOffice.Dnipro]: 10909080,
      [DrcOffice.Chernihiv]: 12021300,
      [DrcOffice.Lviv]: 845820,
    },
    [DrcProject['Pooled Funds Old (MPCA) (UKR-000270)']]: {
      [DrcOffice.Kharkiv]: 4500000,
      [DrcOffice.Dnipro]: 1260000,
      [DrcOffice.Chernihiv]: 1260000,
      [DrcOffice.Lviv]: 777000,
    },
    [DrcProject['Augustinus Fonden (UKR-000340)']]: {
      [DrcOffice.Dnipro]: 3388421,
    },
    [DrcProject['Hoffmans & Husmans (UKR-000341)']]: {
      [DrcOffice.Kharkiv]: 3388421,
    },
    [DrcProject['Pooled Funds (UKR-000342)']]: {
      [DrcOffice.Dnipro]: 3727267,
      [DrcOffice.Kharkiv]: 3727267,
      [DrcOffice.Lviv]: 3717747,
      [DrcOffice.Mykolaiv]: 3717747,
    },
    [DrcProject['Dutch II (UKR-000306)']]: {
      [DrcOffice.Chernihiv]: 7322400,
      [DrcOffice.Dnipro]: 7322400,
      [DrcOffice.Kharkiv]: 7322400,
    },
    [DrcProject['SDC2 (UKR-000330)']]: {
      [DrcOffice.Sumy]: 21600000,
      [DrcOffice.Dnipro]: 29808000,
      [DrcOffice.Kharkiv]: 29808000,
    },
    [DrcProject['DANIDA (UKR-000xxx)']]: {
      [DrcOffice.Sumy]: 3240000,
      [DrcOffice.Dnipro]: 6480000,
      [DrcOffice.Kharkiv]: 6480000,
    },
    [DrcProject['OKF (UKR-000309)']]: {
      [DrcOffice.Lviv]: 17881148,
    },
    [DrcProject['Novo-Nordisk (UKR-000298)']]: {
      [DrcOffice.Mykolaiv]: 28231000,
    },
  }

  static readonly projects = Enum.keys({// [DrcProject['Novo-Nordisk (UKR-000274)']]: true,
    [DrcProject['ECHO2 (UKR-000322)']]: true,
    [DrcProject['Augustinus Fonden (UKR-000340)']]: true,
    [DrcProject['BHA (UKR-000284)']]: true,
    [DrcProject['DANIDA (UKR-000xxx)']]: true,
    [DrcProject['Hoffmans & Husmans (UKR-000341)']]: true,
    [DrcProject['Novo-Nordisk (UKR-000298)']]: true,
    [DrcProject['OKF (UKR-000309)']]: true,
    [DrcProject['Pooled Funds (UKR-000270)']]: true,
    [DrcProject['Pooled Funds (UKR-000342)']]: true,
    [DrcProject['Dutch II (UKR-000306)']]: true,
    [DrcProject['SDC2 (UKR-000330)']]: true,
  })

  static readonly map = (_: Record<keyof Mpca, any>): Mpca => {
    _.date = new Date(_.date)
    return _
  }
}