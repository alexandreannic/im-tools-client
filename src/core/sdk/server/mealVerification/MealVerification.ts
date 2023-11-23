import {KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {UUID} from '@/core/type'

export class MealVerificationHelper {

  static readonly mapEntity = (_: MealVerification): MealVerification => {
    _.createdAt = new Date(_.createdAt)
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
  id: UUID
  activity: KoboId
  name: string
  desc?: string
  createdAt: Date
  createdBy: string
  filters: any
}