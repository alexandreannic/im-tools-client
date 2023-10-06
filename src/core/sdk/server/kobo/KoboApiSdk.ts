import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, UUID} from '@/core/type'
import {ApiKoboForm, Kobo, KoboAnswer, KoboAnswerId, KoboId} from './Kobo'
import {KoboApiForm} from './KoboApi'

export interface FilterBy {
  column: string
  value: (string | null)[]
  type?: 'array',
}

export interface AnswersFilters<T extends FilterBy[] = FilterBy[]> {
  start?: Date
  end?: Date
  ids?: KoboId[]
  filterBy?: T
}

export interface FiltersProps {
  paginate?: ApiPagination;
  filters?: AnswersFilters
}

export interface FnMap<T> {
  fnMap?: (_: Record<string, string | undefined>) => T
}


export class KoboApiSdk {

  constructor(private client: ApiClient) {
  }

  /** @deprecated */
  readonly getAnswersFromLocalForm = <T extends Record<string, any> = Record<string, string | undefined>>({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: {
    formId: UUID,
  } & FiltersProps & FnMap<T>): Promise<ApiPaginate<KoboAnswer<T>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo-api/local-form`, {qs: {...filters, ...paginate}})
      .then(_ => {
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

  readonly editAnswer = (serverId: KoboId, formId: KoboId, answerId: number) => {
    return this.client.post(`/kobo-api/${serverId}/${formId}/${answerId}`)
  }

  readonly synchronizeAnswers = (serverId: KoboId, formId: KoboId) => {
    return this.client.post(`/kobo-api/${serverId}/${formId}/sync`)
  }

  readonly getAnswersFromKoboApi = <T extends Record<string, any> = Record<string, string | undefined>>({
    serverId,
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: {
    serverId: UUID,
    formId: UUID,
  } & FiltersProps & FnMap<T>): Promise<ApiPaginate<KoboAnswer<T>>> => {
    return this.client.get<ApiPaginate<KoboAnswer<T>>>(`/kobo-api/${serverId}/${formId}/answers`, {qs: filters})
      .then(_ => {
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

  readonly getForm = (serverId: UUID, formId: KoboId): Promise<KoboApiForm> => {
    return this.client.get(`/kobo-api/${serverId}/${formId}`)
  }

  readonly getEditUrl = (serverId: UUID, formId: KoboId, answerId: KoboAnswerId): Promise<{url: string, detail?: string}> => {
    return this.client.get(`/kobo-api/${serverId}/${formId}/${answerId}/edit-url`)
  }

  readonly getForms = (serverId: UUID): Promise<ApiKoboForm[]> => {
    return this.client.get(`/kobo-api/${serverId}`).then(_ => _.results.map((_: Record<keyof ApiKoboForm, any>): ApiKoboForm => {
      return {
        ..._,
        date_created: new Date(_.date_created),
        date_modified: new Date(_.date_modified),
      }
    }))
  }

  readonly getAttachement = (serverId: UUID, filepath: string) => {
    return this.client.get<ApiKoboForm[]>(`/kobo-api/${serverId}/attachment/${filepath}`)
  }

}
