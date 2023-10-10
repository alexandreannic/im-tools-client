import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, Period, UUID} from '@/core/type'
import {Kobo, KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {kobo} from '@/koboDrcUaFormId'
import {mapProtection_Hhs2_1} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Mapping'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {Bn_Re} from '@/core/koboModel/Bn_Re/Bn_Re'
import {mapBn_Re} from '@/core/koboModel/Bn_Re/Bn_ReMapping'
import {mapMealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringMapping'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@alexandreannic/ts-utils'
import {mapShelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TAMapping'
import {mapShelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTAMapping'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ProtectionCommunityMonitoring, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {mapMeal_CfmExternal} from '@/core/koboModel/Meal_CfmExternal/Meal_CfmExternalMapping'
import {mapMealCfmInternal} from '@/core/koboModel/MealCfmInternal/MealCfmInternalMapping'
import {KoboMealCfmHelper} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {RapidResponseMechanism} from '@/core/koboModel/RapidResponseMechanism/RapidResponseMechanism'
import {mapRapidResponseMechanism} from '@/core/koboModel/RapidResponseMechanism/RapidResponseMechanismMapping'
import {mapShelter_CashForRepair} from '@/core/koboModel/Shelter_CashForRepair/Shelter_CashForRepairMapping'
import {Shelter_CashForRepair} from '@/core/koboModel/Shelter_CashForRepair/Shelter_CashForRepair'
import {Bn_OldMpcaNfi} from '@/core/koboModel/Bn_OldMpcaNfi/Bn_OldMpcaNfi'
import {mapBn_OldMpcaNfi} from '@/core/koboModel/Bn_OldMpcaNfi/Bn_OldMpcaNfiMapping'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {mapBn_cashForRentApplication} from '@/core/koboModel/Bn_cashForRentApplication/Bn_cashForRentApplicationMapping'
import {Bn_cashForRentApplication} from '@/core/koboModel/Bn_cashForRentApplication/Bn_cashForRentApplication'
import {mapProtection_communityMonitoring} from '@/core/koboModel/Protection_communityMonitoring/Protection_communityMonitoringMapping'
import {mapProtection_pss} from '@/core/koboModel/Protection_pss/Protection_pssMapping'
import {mapProtection_groupSession} from '@/core/koboModel/Protection_groupSession/Protection_groupSessionMapping'

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
      case kobo.drcUa.form.protection_hhs2_1:
        return Promise.resolve({start: new Date(2023, 3, 1), end: startOfDay(new Date())})
      case kobo.drcUa.form.meal_visitMonitoring:
        return Promise.resolve({start: new Date(2023, 5, 15), end: startOfDay(new Date())})
      case kobo.drcUa.form.safety_incident:
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

  readonly searchBn_Re = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_Re>({
      formId: kobo.drcUa.form.bn_re,
      fnMap: mapBn_Re,
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
    return this.search<Bn_OldMpcaNfi>({
      formId: kobo.drcUa.form.bn_oldMpcaNfi,
      fnMap: mapBn_OldMpcaNfi,
      ...filters,
    })
  }
  readonly searchBn_RapidResponseMechanism = (filters: KoboAnswerFilter = {}) => {
    return this.search<RapidResponseMechanism>({
      formId: kobo.drcUa.form.bn_rapidResponseMechanism,
      fnMap: mapRapidResponseMechanism,
      ...filters,
    })
  }

  readonly searchMeal_VisitMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.meal_visitMonitoring,
      fnMap: mapMealVisitMonitoring,
      ...filters,
    })
  }

  readonly searchShelterTa = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.shelter_ta,
      fnMap: mapShelter_TA,
      fnMapTags: _ => ({..._, workDoneAt: _?.workDoneAt ? new Date(_.workDoneAt) : undefined}) as ShelterTaTags,
      ...filters,
    })
  }

  readonly searchShelterNta = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.shelter_nta,
      fnMap: mapShelter_NTA,
      fnMapTags: _ => _ as ShelterNtaTags,
      ...filters,
    })
  }

  readonly searchMealCfmInternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.meal_cfmInternal,
      fnMap: mapMealCfmInternal,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchMealCfmExternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.meal_cfmExternal,
      fnMap: mapMeal_CfmExternal,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchProtection_Hhs2 = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protection_hhs2_1,
      fnMap: mapProtection_Hhs2_1,
      fnMapTags: _ => _ as ProtectionHhsTags,
      ...filters,
    })
  }

  readonly searchProtection_communityMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protection_communityMonitoring,
      fnMap: mapProtection_communityMonitoring,
      fnMapTags: _ => _ as ProtectionCommunityMonitoring,
      ...filters,
    })
  }

  readonly searchProtection_pss = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protection_pss,
      fnMap: mapProtection_pss,
      ...filters,
    })
  }

  readonly searchProtection_groupSession = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.protection_groupSession,
      fnMap: mapProtection_groupSession,
      ...filters,
    })
  }

  readonly searchSafetyIncident = (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<KoboSafetyIncidentHelper.Type>> => {
    return this.search({
      formId: kobo.drcUa.form.safety_incident,
      fnMap: KoboSafetyIncidentHelper.mapData,
      ...filters,
    })
  }
}
