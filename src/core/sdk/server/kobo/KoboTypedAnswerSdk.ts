import {ApiClient} from '../ApiClient'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboIndex} from '@/core/KoboIndex'
import {ShelterNtaTags, ShelterTaTagsHelper} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ProtectionCommunityMonitoringTags, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {KoboMealCfmHelper} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {KoboAnswerFilter, KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {EcrecCashRegistrationTags} from '@/core/sdk/server/kobo/custom/KoboEcrecCashRegistration'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Protection_communityMonitoring} from '@/core/sdk/server/kobo/generatedInterface/Protection_communityMonitoring'
import {Protection_pss} from '@/core/sdk/server/kobo/generatedInterface/Protection_pss'
import {Protection_groupSession} from '@/core/sdk/server/kobo/generatedInterface/Protection_groupSession'
import {Protection_gbv} from '@/core/sdk/server/kobo/generatedInterface/Protection_gbv'
import {Shelter_NTA} from './generatedInterface/Shelter_NTA'
import {Meal_CfmInternal} from '@/core/sdk/server/kobo/generatedInterface/Meal_CfmInternal'
import {Meal_CfmExternal} from '@/core/sdk/server/kobo/generatedInterface/Meal_CfmExternal'
import {Protection_Hhs2} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2'
import {Meal_VerificationWinterization} from '@/core/sdk/server/kobo/generatedInterface/Meal_VerificationWinterization'
import {Meal_VerificationEcrec} from '@/core/sdk/server/kobo/generatedInterface/Meal_VerificationEcrec'
import {Bn_OldMpcaNfi} from '@/core/sdk/server/kobo/generatedInterface/Bn_OldMpcaNfi'
import {Bn_RapidResponse} from '@/core/sdk/server/kobo/generatedInterface/Bn_RapidResponse'
import {Meal_VisitMonitoring} from '@/core/sdk/server/kobo/generatedInterface/Meal_VisitMonitoring'
import {Bn_cashForRentApplication} from '@/core/sdk/server/kobo/generatedInterface/Bn_cashForRentApplication'
import {Shelter_cashForRepair} from '@/core/sdk/server/kobo/generatedInterface/Shelter_cashForRepair'
import {Bn_Re} from '@/core/sdk/server/kobo/generatedInterface/Bn_Re'
import {Partnership_partnersDatabase} from '@/core/sdk/server/kobo/generatedInterface/Partnership_partnersDatabase'
import {Shelter_TA} from '@/core/sdk/server/kobo/generatedInterface/Shelter_TA'
import {Ecrec_sectoralCashRegistration} from '@/core/sdk/server/kobo/generatedInterface/Ecrec_sectoralCashRegistration'


export type KoboUnwrapAnserType<T extends keyof KoboTypedAnswerSdk> = Promise<Awaited<ReturnType<KoboTypedAnswerSdk[T]>>['data']>


export class KoboTypedAnswerSdk {

  constructor(private client: ApiClient, private sdk = new KoboAnswerSdk(client)) {
  }


  private readonly search = this.sdk.search

  readonly searchBn_Re = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_Re.T>({
      formId: KoboIndex.byName('bn_re').id,
      fnMap: Bn_Re.map,
      ...filters,
    })
  }

  readonly searcheBn_cashForRepair = (filters: KoboAnswerFilter = {}) => {
    return this.search<Shelter_cashForRepair.T>({
      formId: KoboIndex.byName('shelter_cashForRepair').id,
      fnMap: Shelter_cashForRepair.map,
      ...filters,
    })
  }

  readonly searchBn_cashForRentApplication = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_cashForRentApplication.T>({
      formId: KoboIndex.byName('bn_cashForRentApplication').id,
      fnMap: Bn_cashForRentApplication.map,
      ...filters,
    })
  }

  readonly searchBn_MpcaNfiOld = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_OldMpcaNfi.T>({
      formId: KoboIndex.byName('bn_1_mpcaNfi').id,
      fnMap: Bn_OldMpcaNfi.map,
      ...filters,
    })
  }
  readonly searchBn_RapidResponseMechanism = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_RapidResponse.T>({
      formId: KoboIndex.byName('bn_rapidResponse').id,
      fnMap: Bn_RapidResponse.map,
      ...filters,
    })
  }

  readonly searchMeal_VisitMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_visitMonitoring').id,
      fnMap: Meal_VisitMonitoring.map,
      ...filters,
    })
  }

  readonly searchPartnersDatabase = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('partnership_partnersDatabase').id,
      fnMap: Partnership_partnersDatabase.map,
      ...filters,
    })
  }

  readonly searchShelterTa = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('shelter_ta').id,
      fnMap: Shelter_TA.map,
      fnMapTags: ShelterTaTagsHelper.mapTags,
      ...filters,
    })
  }

  readonly searchShelterNta = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('shelter_nta').id,
      fnMap: Shelter_NTA.map,
      fnMapTags: _ => _ as ShelterNtaTags,
      ...filters,
    })
  }

  readonly searchMealCfmInternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_cfmInternal').id,
      fnMap: Meal_CfmInternal.map,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchMealCfmExternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_cfmExternal').id,
      fnMap: Meal_CfmExternal.map,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchProtection_Hhs2 = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_hhs2_1').id,
      fnMap: Protection_Hhs2.map,
      fnMapTags: _ => _ as ProtectionHhsTags,
      ...filters,
    })
  }

  readonly searchProtection_communityMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_communityMonitoring').id,
      fnMap: Protection_communityMonitoring.map,
      fnMapTags: _ => _ as ProtectionCommunityMonitoringTags,
      ...filters,
    })
  }

  readonly searchProtection_pss = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_pss').id,
      fnMap: Protection_pss.map,
      ...filters,
    })
  }

  readonly searchProtection_groupSession = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_groupSession').id,
      fnMap: Protection_groupSession.map,
      ...filters,
    })
  }

  readonly searchProtection_gbv = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_gbv').id,
      fnMap: Protection_gbv.map,
      ...filters,
    })
  }

  readonly searchSafetyIncident = (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<KoboAnswer<KoboSafetyIncidentHelper.Type>>> => {
    return this.search({
      formId: KoboIndex.byName('safety_incident').id,
      fnMap: KoboSafetyIncidentHelper.mapData,
      ...filters,
    })
  }

  readonly searchMeal_verificationEcrec = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_verificationEcrec').id,
      fnMap: Meal_VerificationEcrec.map,
      ...filters,
    })
  }

  readonly searchMeal_verificationWinterization = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_verificationWinterization').id,
      fnMap: Meal_VerificationWinterization.map,
      ...filters,
    })
  }

  readonly searchEcrec_cashRegistration = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('ecrec_cashRegistration').id,
      fnMap: Ecrec_sectoralCashRegistration.map,
      fnMapTags: _ => _ as EcrecCashRegistrationTags,
      ...filters,
    })
  }
}
