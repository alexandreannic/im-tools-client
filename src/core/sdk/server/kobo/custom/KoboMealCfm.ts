import {DrcOffice} from '@/core/drcUa'
import {MealCfmInternal} from '@/core/koboModel/MealCfmInternal/MealCfmInternal'
import {fnSwitch} from '@alexandreannic/ts-utils'

export enum CfmDataSource {
  Internal = 'Internal',
  External = 'External',
}

export enum CfmDataProgram {
  'Basic Needs (MCPA/ NFI)' = 'Basic Needs (MCPA/ NFI)',
  'Shelter' = 'Shelter',
  'Protection' = 'Protection',
  'Legal Aid' = 'Legal Aid',
  'Partnership/ Capacity Building' = 'Partnership/ Capacity Building',
  'Humanitarian Disarmament and Peacebuilding' = 'Humanitarian Disarmament and Peacebuilding',
  'Other' = 'Other',
}

export enum CfmDataPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum KoboMealCfmStatus {
  Open = 'Open',
  Close = 'Close',
  Processing = 'Processing'
}

export enum KoboMealCfmArea {
  GCA = 'GCA',
  NGCA = 'NGCA',
}

export interface KoboMealCfmTag {
  deletedAt?: Date
  deletedBy?: string
  gca?: KoboMealCfmArea
  office?: DrcOffice
  program?: CfmDataProgram
  notes?: string
  focalPointEmail?: string
  status?: KoboMealCfmStatus
  feedbackTypeOverride?: MealCfmInternal['feedback_type']
}

export class KoboMealCfmTag {

  static readonly feedbackType2priority = (_?: MealCfmInternal['feedback_type']) => {
    return fnSwitch(_!, {
      apprec_com: CfmDataPriority.Low,
      request_info: CfmDataPriority.Medium,
      request_assistance: CfmDataPriority.Medium,
      non_s_feedback: CfmDataPriority.Low,
      sen_feedback: CfmDataPriority.High,
      coc: CfmDataPriority.High,
      violation_other: CfmDataPriority.High,
      sen_safety: CfmDataPriority.High,
    }, () => undefined)
  }

  static readonly map = (_?: any): KoboMealCfmTag => {
    const tag = (_ ?? {}) as KoboMealCfmTag
    if (!tag.status) tag.status = KoboMealCfmStatus.Open
    return tag
  }
}