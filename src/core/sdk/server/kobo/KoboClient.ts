import {ApiClient} from '../ApiClient'
import {ApiPaginate, UUID} from '../../../type'
import {KoboAnswer, KoboQuestion, Kobo, IKoboForm} from './Kobo'

export interface AnswersFilters {
  start?: Date
  end?: Date
}

export class KoboFormClient {

  constructor(private client: ApiClient) {
  }

  readonly getAnswers = (serverId: UUID, formId: UUID, filters: AnswersFilters = {}) => {
    return this.client.get<ApiPaginate<KoboAnswer>>(`/kobo/${serverId}/${formId}/answers`, {qs: filters})
      .then(_ => ({..._, data: _.data.map(Kobo.mapAnswerMetaData)}))
  }

  readonly getForm = (serverId: UUID, formId: UUID) => {
    return this.client.get<KoboQuestion[]>(`/kobo/${serverId}/${formId}`)
  }

  readonly getForms = (serverId: UUID) => {
    return this.client.get<IKoboForm[]>(`/kobo/${serverId}`)
  }
}
