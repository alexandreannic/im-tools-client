import {ApiClient} from '../ApiClient'
import {UUID} from '@/core/type/generic'
import {Kobo, KoboAnswer, KoboAnswerId, KoboBaseTags, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {KoboIndex} from '@/core/KoboIndex'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@alexandreannic/ts-utils'
import {Period} from '@/core/type/period'
import {ApiPaginate, ApiPagination} from '@/core/sdk/server/_core/ApiSdkUtils'

export interface KoboAnswerFilter {
  paginate?: ApiPagination
  filters?: AnswersFilters
}

interface KoboAnswerSearch<
  TAnswer extends Record<string, any> = Record<string, string | undefined>,
  TTags extends Record<string, any> | undefined = undefined
> extends KoboAnswerFilter {
  formId: UUID,
  fnMap?: (_: Record<string, string | undefined>) => TAnswer
  fnMapTags?: (_?: any) => TTags,
}

export class KoboAnswerSdk {

  constructor(private client: ApiClient) {
  }

  readonly updateTag = ({formId, answerIds, tags}: {formId: KoboId, answerIds: KoboAnswerId[], tags: Record<string, any>}) => {
    for (let k in tags) if (tags[k] === undefined) tags[k] = null
    return this.client.post(`/kobo/answer/${formId}/tag`, {body: {tags, answerIds: answerIds}})
  }

  readonly getAllFromLocalForm = (filters: AnswersFilters = {}) => {
    return this.client.get<KoboAnswer[]>(`/kobo/local-form`, {qs: filters})
      .then(_ => _.map(x => Kobo.mapAnswerMetaData(x)))
  }

  readonly getPeriod = (formId: KoboId): Promise<Period> => {
    switch (formId) {
      case KoboIndex.byName('protection_hhs2_1').id:
        return Promise.resolve({start: new Date(2023, 3, 1), end: startOfDay(new Date())})
      case KoboIndex.byName('meal_visitMonitoring').id:
        return Promise.resolve({start: new Date(2023, 5, 15), end: startOfDay(new Date())})
      case KoboIndex.byName('safety_incident').id:
        return Promise.resolve({start: new Date(2023, 8, 19), end: startOfDay(new Date())})
      default:
        throw new Error('To implement')
    }
  }

  private static mapFilters = (_: AnswersFilters): AnswersFilters => {
    return {
      ..._,
      start: map(_.start, startOfDay),
      end: map(_.end, endOfDay),
    }
  }

  readonly searchByAccess = <
    TQuestion extends Record<string, any> = Record<string, string | undefined>,
    TTags extends KoboBaseTags = KoboBaseTags
  >({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
    fnMapTags = (_?: any) => _,
  }: KoboAnswerSearch<TQuestion, TTags>): Promise<ApiPaginate<KoboAnswer<TQuestion, TTags>>> => {
    return this.client.post<ApiPaginate<Record<string, any>>>(`/kobo/answer/${formId}/by-access`, {body: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(Kobo.mapPaginateAnswerMetaData(fnMap, fnMapTags))
  }

  readonly search = <
    TQuestion extends Record<string, any> = Record<string, string | undefined>,
    TTags extends KoboBaseTags = KoboBaseTags
  >({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
    fnMapTags = (_?: any) => _,
  }: KoboAnswerSearch<TQuestion, TTags>): Promise<ApiPaginate<KoboAnswer<TQuestion, TTags>>> => {
    return this.client.post<ApiPaginate<Record<string, any>>>(`/kobo/answer/${formId}`, {body: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(Kobo.mapPaginateAnswerMetaData(fnMap, fnMapTags))
  }
}
