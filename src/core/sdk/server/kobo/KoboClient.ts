import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, UUID} from '@/core/type'
import {Kobo, KoboAnswer, KoboAnswer2} from './Kobo'
import {mapProtHHS_2_1} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {koboFormId} from '@/koboFormId'

export interface AnswersFilters<T extends string = string> {
  start?: Date
  end?: Date
  filterBy?: {
    column: string
    value: string
  }[]
}

export interface FiltersProps {
  paginate?: ApiPagination;
  filters?: AnswersFilters
}

export interface FnMap<T> {
  fnMap?: (_: Record<string, string | undefined>) => T
}

export class KoboFormSdk {

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
          return ({
            ..._,
            data: _.data.map(({answers, ..._}) => ({
              ...Kobo.mapAnswerMetaData(_),
              ...fnMap(answers) as any
            }))
          })
        }
      )
  }

  readonly getProtHHS2 = <T extends Record<string, any> = Record<string, string | undefined>>({
    filters = {},
    paginate = {offset: 0, limit: 100000},
  }: {
    paginate?: ApiPagination;
    filters?: AnswersFilters
  } = {}) => {
    return this.getAnswers({
      formId: koboFormId.prod.protectionHh2,
      paginate,
      filters,
      fnMap: mapProtHHS_2_1
    })
  }
}
