import {KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'

export class MealVerificationHelper {

  static readonly mapEntity = (_: MealVerification): MealVerification => {
    _.createdAt = new Date(_.createdBy)
    return _
  }
}

export enum MealVerificationAnswersStatus {
  Selected = 'Selected'
}

export interface MealVerificationAnsers {
  koboAnswerId: KoboAnswerId
  status?: MealVerificationAnswersStatus
}

export interface MealVerification {
  formId: KoboId
  name: string
  desc?: string
  createdAt: Date
  createdBy: string
  filters: any
}