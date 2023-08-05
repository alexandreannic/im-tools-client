import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, Period, UUID} from '@/core/type'
import {Kobo, KoboAnswer, KoboId, KoboMappedAnswerType} from '@/core/sdk/server/kobo/Kobo'
import {kobo, koboDrcUaFormId} from '@/koboDrcUaFormId'
import {mapProtHHS_2_1} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {mapBNRE} from '@/core/koboModel/BNRE/BNREMapping'
import {mapMealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringMapping'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@alexandreannic/ts-utils'

interface KoboAnswerFilter {
  paginate?: ApiPagination
  filters?: AnswersFilters
}

interface KoboAnswerSearch<T> extends KoboAnswerFilter {
  formId: UUID,
  fnMap?: (_: Record<string, string | undefined>) => T
}

export class KoboAnswerSdk {

  constructor(private client: ApiClient) {
  }

  readonly getAllFromLocalForm = (filters: AnswersFilters = {}) => {
    return this.client.get<KoboAnswer[]>(`/kobo/local-form`, {qs: filters})
      .then(_ => _.map(Kobo.mapAnswerMetaData))
  }

  readonly getPeriod = (formId: KoboId): Promise<Period> => {
    if (formId === kobo.drcUa.form.protectionHh2) {
      return Promise.resolve({start: new Date(2023, 3, 1), end: startOfDay(new Date())})
    }
    if (formId === kobo.drcUa.form.mealVisitMonitoring) {
      return Promise.resolve({start: new Date(2023, 5, 15), end: startOfDay(new Date())})
    }
    throw new Error('To implement')
  }

  private static mapFilters = (_: AnswersFilters): AnswersFilters => {
    return {
      ..._,
      start: map(_.start, startOfDay),
      end: map(_.end, endOfDay),
    }
  }
  readonly searchByAccess = <T extends Record<string, any> = Record<string, string | undefined>>({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: KoboAnswerSearch<T>): Promise<ApiPaginate<KoboAnswer<T>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo/answer/${formId}/by-access`, {qs: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(Kobo.mapPaginateAnswerMetaData(fnMap))
  }

  readonly search = <T extends Record<string, any> = Record<string, KoboMappedAnswerType>>({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: KoboAnswerSearch<T>): Promise<ApiPaginate<KoboAnswer<T>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo/answer/${formId}`, {qs: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(Kobo.mapPaginateAnswerMetaData(fnMap))
  }

  readonly searchBnre = (filters: KoboAnswerFilter = {}) => {
    return this.search<BNRE>({
      formId: kobo.drcUa.form.BNRE,
      fnMap: mapBNRE,
      ...filters,
    })
  }

  readonly searchMealVisitMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.mealVisitMonitoring,
      fnMap: mapMealVisitMonitoring,
      ...filters,
    })
  }

  readonly searchProtHhs = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protectionHh2,
      fnMap: mapProtHHS_2_1,
      ...filters,
    })
    // TODO DELETE !!!!
    // .catch(() => {
    //   const _ = json as ApiPaginate<any>
    //   return ({
    //     ..._,
    //     data: _.data.map(({answers, ..._}) => ({
    //       ...Kobo.mapAnswerMetaData(_),
    //       ...mapProtHHS_2_1(answers) as any
    //     }))
    //   })
    // })
  }
}
