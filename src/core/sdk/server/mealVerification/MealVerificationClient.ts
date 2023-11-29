import {ApiClient} from '@/core/sdk/server/ApiClient'
import {MealVerification, MealVerificationAnsers, MealVerificationAnswersStatus, MealVerificationHelper} from '@/core/sdk/server/mealVerification/MealVerification'
import {UUID} from '@/core/type'

export class MealVerificationClient {
  constructor(private client: ApiClient) {
  }

  readonly create = (body: Omit<MealVerification, 'id' | 'createdAt' | 'createdBy'> & {
    answers: MealVerificationAnsers[]
  }) => {
    return this.client.put<MealVerification>(`/meal-verification`, {body})
      .then(MealVerificationHelper.mapEntity)
  }

  readonly getAll = () => {
    return this.client.get<MealVerification[]>(`/meal-verification`)
      .then(_ => _.map(MealVerificationHelper.mapEntity))
  }

  readonly getAnswers = (mealVerificationId: UUID) => {
    return this.client.get<MealVerificationAnsers[]>(`/meal-verification/${mealVerificationId}/answers`)
  }

  readonly remove = (mealVerificationId: UUID) => {
    return this.client.delete<MealVerificationAnsers[]>(`/meal-verification/${mealVerificationId}`)
  }

  readonly updateAnswers = (answerId: UUID, status?: MealVerificationAnswersStatus) => {
    return this.client.post<MealVerificationAnsers[]>(`/meal-verification/answer/${answerId}`, {body: {status}})
  }
}