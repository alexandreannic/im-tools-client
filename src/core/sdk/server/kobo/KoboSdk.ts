import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, Period, UUID} from '@/core/type'
import {Kobo, KoboAnswer, KoboAnswer2, KoboId} from './Kobo'
import {mapProtHHS_2_1} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {koboFormId} from '@/koboFormId'
import json from '@/features/Dashboard/DashboardHHS2/TODELETERAWDATA.json'

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

  readonly getFormPeriod = (formId: KoboId): Promise<Period> => {
    if (formId === koboFormId.prod.protectionHh2) {
      return Promise.resolve({start: new Date(2023, 3, 1), end: new Date()})
    }
    throw new Error('To implement')
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
    return Promise.reject('DEV')
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
      // TODO DELETE !!!!
      .catch(() => {
        const _ = json as ApiPaginate<any>
        return ({
          ..._,
          data: _.data.map(({answers, ..._}) => ({
            ...Kobo.mapAnswerMetaData(_),
            ...mapProtHHS_2_1(answers) as any
          }))
        })
      })
  }
}
