import {ApiClient} from '@/core/sdk/server/ApiClient'
import {MealVerification, MealVerificationAnsers, MealVerificationHelper} from '@/core/sdk/server/mealVerification/MealVerification'

export class MealVerificationClient {
  constructor(private client: ApiClient) {
  }

  readonly create = (body: Omit<MealVerification, 'createdAt' | 'createdBy'> & {
    answers: MealVerificationAnsers[]
  }) => {
    return this.client.put<MealVerification>(`/meal-verification`, {body})
      .then(MealVerificationHelper.mapEntity)
  }

  readonly getAll = (body: Omit<MealVerification, 'createdAt' | 'createdBy'> & {
    answers: MealVerificationAnsers[]
  }) => {
    return this.client.get<MealVerification[]>(`/meal-verification`, {body})
      .then(_ => _.map(MealVerificationHelper.mapEntity))
  }
}