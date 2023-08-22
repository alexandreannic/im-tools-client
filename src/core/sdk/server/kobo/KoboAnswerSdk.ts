import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, Period, UUID} from '@/core/type'
import {Kobo, KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {kobo} from '@/koboDrcUaFormId'
import {mapProtHHS_2_1} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {mapBNRE} from '@/core/koboModel/BNRE/BNREMapping'
import {mapMealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringMapping'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@alexandreannic/ts-utils'
import {mapShelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TAMapping'
import {mapShelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTAMapping'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ProtHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtHhs'
import {mapMealCfmExternal} from '@/core/koboModel/MealCfmExternal/MealCfmExternalMapping'
import {mapMealCfmInternal} from '@/core/koboModel/MealCfmInternal/MealCfmInternalMapping'
import {KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'

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


  readonly updateTag = ({formId, answerId, tags}: {formId: KoboId, answerId: KoboAnswerId, tags: Record<string, any>}) => {
    return this.client.post(`/kobo/answer/${formId}/${answerId}/tag`, {body: {tags}})
  }

  readonly getAllFromLocalForm = (filters: AnswersFilters = {}) => {
    return this.client.get<KoboAnswer[]>(`/kobo/local-form`, {qs: filters})
      .then(_ => _.map(x => Kobo.mapAnswerMetaData(x)))
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

  readonly searchByAccess = <
    TQuestion extends Record<string, any> = Record<string, string | undefined>,
    TTags extends Record<string, any> | undefined = undefined
  >({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
    fnMapTags = (_?: any) => _,
  }: KoboAnswerSearch<TQuestion, TTags>): Promise<ApiPaginate<KoboAnswer<TQuestion, TTags>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo/answer/${formId}/by-access`, {qs: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(Kobo.mapPaginateAnswerMetaData(fnMap, fnMapTags))
  }

  readonly search = <
    TQuestion extends Record<string, any> = Record<string, string | undefined>,
    TTags extends Record<string, any> | undefined = undefined
  >({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
    fnMapTags = (_?: any) => _,
  }: KoboAnswerSearch<TQuestion, TTags>): Promise<ApiPaginate<KoboAnswer<TQuestion, TTags>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo/answer/${formId}`, {qs: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(Kobo.mapPaginateAnswerMetaData(fnMap, fnMapTags))
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

  readonly searchShelterTa = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.shelterTA,
      fnMap: mapShelter_TA,
      fnMapTags: _ => ({..._, workDoneAt: _?.workDoneAt ? new Date(_.workDoneAt) : undefined}) as ShelterTaTags,
      ...filters,
    })
  }

  readonly searchShelterNta = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.shelterNTA,
      fnMap: mapShelter_NTA,
      fnMapTags: _ => _ as ShelterNtaTags,
      ...filters,
    })
  }

  readonly searchMealCfmInternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.cfmInternal,
      fnMap: mapMealCfmInternal,
      fnMapTags: KoboMealCfmTag.map,
      ...filters,
    })
  }

  readonly searchMealCfmExternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.cfmExternal,
      fnMap: mapMealCfmExternal,
      fnMapTags: KoboMealCfmTag.map,
      ...filters,
    })
  }

  readonly searchProtHhs = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protectionHh2,
      fnMap: mapProtHHS_2_1,
      fnMapTags: _ => _ as ProtHhsTags,
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
