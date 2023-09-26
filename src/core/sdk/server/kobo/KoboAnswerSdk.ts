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
import {KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {RapidResponseMechanism} from '@/core/koboModel/RapidResponseMechanism/RapidResponseMechanism'
import {mapRapidResponseMechanism} from '@/core/koboModel/RapidResponseMechanism/RapidResponseMechanismMapping'
import {mapShelter_CashForRepair} from '@/core/koboModel/Shelter_CashForRepair/Shelter_CashForRepairMapping'
import {Shelter_CashForRepair} from '@/core/koboModel/Shelter_CashForRepair/Shelter_CashForRepair'
import {MPCA_NFI} from '@/core/koboModel/MPCA_NFI/MPCA_NFI'
import {mapMPCA_NFI} from '@/core/koboModel/MPCA_NFI/MPCA_NFIMapping'
import {KoboFormProtHH} from '@/core/koboModel/koboFormProtHH'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {mapBn_cashForRentApplication} from '@/core/koboModel/Bn_cashForRentApplication/Bn_cashForRentApplicationMapping'
import {Bn_cashForRentApplication} from '@/core/koboModel/Bn_cashForRentApplication/Bn_cashForRentApplication'

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
    return this.client.post(`/kobo/answer/${formId}/tag`, {body: {tags, answerIds: answerIds}})
  }

  readonly getAllFromLocalForm = (filters: AnswersFilters = {}) => {
    return this.client.get<KoboAnswer[]>(`/kobo/local-form`, {qs: filters})
      .then(_ => _.map(x => Kobo.mapAnswerMetaData(x)))
  }

  readonly getPeriod = (formId: KoboId): Promise<Period> => {
    switch (formId) {
      case kobo.drcUa.form.protectionHh2:
        return Promise.resolve({start: new Date(2023, 3, 1), end: startOfDay(new Date())})
      case kobo.drcUa.form.mealVisitMonitoring:
        return Promise.resolve({start: new Date(2023, 5, 15), end: startOfDay(new Date())})
      case kobo.drcUa.form.safetyIncident:
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
    TTags extends Record<string, any> | undefined = undefined
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
    TTags extends Record<string, any> | undefined = undefined
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

  readonly searchBnre = (filters: KoboAnswerFilter = {}) => {
    return this.search<BNRE>({
      formId: kobo.drcUa.form.bn_re,
      fnMap: mapBNRE,
      ...filters,
    })
  }

  readonly searcheBn_cashForRepair = (filters: KoboAnswerFilter = {}) => {
    return this.search<Shelter_CashForRepair>({
      formId: kobo.drcUa.form.bn_cashForRepair,
      fnMap: mapShelter_CashForRepair,
      ...filters,
    })
  }

  readonly searchBn_cashForRentApplication = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_cashForRentApplication>({
      formId: kobo.drcUa.form.bn_cashForRentApplication,
      fnMap: mapBn_cashForRentApplication,
      ...filters,
    })
  }

  readonly searchBn_MpcaNfiOld = (filters: KoboAnswerFilter = {}) => {
    return this.search<MPCA_NFI>({
      formId: kobo.drcUa.form.bn_fcrmMpca,
      fnMap: mapMPCA_NFI,
      ...filters,
    })
  }
  readonly searchBn_RapidResponseMechanism = (filters: KoboAnswerFilter = {}) => {
    return this.search<RapidResponseMechanism>({
      formId: kobo.drcUa.form.rapidResponseMechanism,
      fnMap: mapRapidResponseMechanism,
      ...filters,
    })
  }

  readonly searchMeal_VisitMonitoring = (filters: KoboAnswerFilter = {}) => {
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

  readonly searchProtHhs2 = (filters: KoboAnswerFilter = {}) => {
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

  readonly searchProtHhs1 = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protectionHh,
      fnMap: KoboFormProtHH.mapAnswers,
      ...filters,
    })
  }

  readonly searchSafetyIncident = (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<KoboSafetyIncidentHelper.Type>> => {
    return this.search({
      formId: kobo.drcUa.form.safetyIncident,
      fnMap: KoboSafetyIncidentHelper.mapData,
      ...filters,
    })
  }
}
