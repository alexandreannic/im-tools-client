import {ApiClient} from '../ApiClient'
import {ApiPaginate, UUID} from '../../type'
import {KoboAnswer, KoboQuestion} from './KoboType'

export interface AnswersFilters {
  start?: Date
  end?: Date
}

export class KoboClient {

  constructor(private client: ApiClient) {
  }

  readonly getAnswers = (formId: UUID, filters: AnswersFilters = {}) => {
    return this.client.get<ApiPaginate<KoboAnswer>>(`/kobo/${formId}/answers`, {qs: filters})
  }

  readonly getForms = () => {
    return this.client.get(`/kobo`)
  }

  readonly getForm = (formId: UUID) => {
    return this.client.get<KoboQuestion[]>(`/kobo/${formId}`)
  }
}
