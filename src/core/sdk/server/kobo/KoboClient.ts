import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, UUID} from '../../../type'
import {KoboAnswer, KoboQuestion, Kobo, IKoboForm, KoboAnswer2} from './Kobo'

export interface AnswersFilters {
  start?: Date
  end?: Date
}

export class KoboFormClient {

  constructor(private client: ApiClient) {
  }

  readonly getLocalFormAnswers = (filters: AnswersFilters = {}) => {
    return this.client.get<KoboAnswer[]>(`/kobo/local-form`, {qs: filters})
      .then(_ => _.map(Kobo.mapAnswerMetaData))
  }

  readonly getAnswers = <T extends Record<string, any> = Record<string, string | undefined>>({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: {
    formId: UUID,
    paginate?: ApiPagination;
    filters?: AnswersFilters
    fnMap?: (_: Record<string, string | undefined>) => T
  }): Promise<ApiPaginate<KoboAnswer2<T>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo/${formId}/answers`, {qs: {...filters, ...paginate}})
      .then(_ => {
          console.log(_)
          return ({
            ..._,
            data: _.data.map(_ => ({
              ..._,
              ...Kobo.mapAnswerMetaData(_),
              ...fnMap(_.answers) as any
            }))
          })
        }
      )
  }

  /** @deprecated */
  readonly getAnswersFromLocalForm = <T extends Record<string, any> = Record<string, string | undefined>>({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: {
    formId: UUID,
    paginate?: ApiPagination;
    filters?: AnswersFilters
    fnMap?: (_: Record<string, string | undefined>) => T
  }): Promise<ApiPaginate<KoboAnswer2<T>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo-api/local-form`, {qs: {...filters, ...paginate}})
      .then(_ => {
          console.log(_)
          return ({
            ..._,
            data: _.data.map(_ => ({
              ..._,
              ...Kobo.mapAnswerMetaData(_),
              ...fnMap(_.answers) as any
            }))
          })
        }
      )
  }

  readonly getAnswersFromKobo = (serverId: UUID, formId: UUID, filters: AnswersFilters = {}) => {
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
