import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, UUID} from '../../../type'
import {Kobo, KoboAnswer, KoboAnswer2} from './Kobo'

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
}
