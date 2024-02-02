import {ApiClient} from '../ApiClient'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboIndex} from '@/core/KoboIndex'
import {mapProtection_Hhs2_1} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2_1/Protection_Hhs2_1Mapping'
import {Bn_Re} from '@/core/sdk/server/kobo/generatedInterface/Bn_Re/Bn_Re'
import {mapBn_Re} from '@/core/sdk/server/kobo/generatedInterface/Bn_Re/Bn_ReMapping'
import {mapShelter_TA} from '@/core/sdk/server/kobo/generatedInterface/Shelter_TA/Shelter_TAMapping'
import {mapShelter_NTA} from '@/core/sdk/server/kobo/generatedInterface/Shelter_NTA/Shelter_NTAMapping'
import {ShelterNtaTags, ShelterTaTagsHelper} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ProtectionCommunityMonitoringTags, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {mapMeal_CfmExternal} from '@/core/sdk/server/kobo/generatedInterface/Meal_CfmExternal/Meal_CfmExternalMapping'
import {KoboMealCfmHelper} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {RapidResponseMechanism} from '@/core/sdk/server/kobo/generatedInterface/RapidResponseMechanism/RapidResponseMechanism'
import {mapRapidResponseMechanism} from '@/core/sdk/server/kobo/generatedInterface/RapidResponseMechanism/RapidResponseMechanismMapping'
import {mapShelter_CashForRepair} from '@/core/sdk/server/kobo/generatedInterface/Shelter_CashForRepair/Shelter_CashForRepairMapping'
import {Shelter_CashForRepair} from '@/core/sdk/server/kobo/generatedInterface/Shelter_CashForRepair/Shelter_CashForRepair'
import {Bn_OldMpcaNfi} from '@/core/sdk/server/kobo/generatedInterface/Bn_OldMpcaNfi/Bn_OldMpcaNfi'
import {mapBn_OldMpcaNfi} from '@/core/sdk/server/kobo/generatedInterface/Bn_OldMpcaNfi/Bn_OldMpcaNfiMapping'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {mapBn_cashForRentApplication} from '@/core/sdk/server/kobo/generatedInterface/Bn_cashForRentApplication/Bn_cashForRentApplicationMapping'
import {Bn_cashForRentApplication} from '@/core/sdk/server/kobo/generatedInterface/Bn_cashForRentApplication/Bn_cashForRentApplication'
import {mapMeal_CfmInternal} from '@/core/sdk/server/kobo/generatedInterface/Meal_CfmInternal/Meal_CfmInternalMapping'
import {mapEcrec_CashRegistration} from '@/core/sdk/server/kobo/generatedInterface/Ecrec_CashRegistration/Ecrec_CashRegistrationMapping'
import {mapMeal_VisitMonitoring} from '@/core/sdk/server/kobo/generatedInterface/Meal_VisitMonitoring/Meal_VisitMonitoringMapping'
import {KoboAnswerFilter, KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {mapMeal_VerificationWinterization} from '@/core/sdk/server/kobo/generatedInterface/Meal_VerificationWinterization/Meal_VerificationWinterizationMapping'
import {mapMeal_VerificationEcrec} from '@/core/sdk/server/kobo/generatedInterface/Meal_VerificationEcrec/Meal_VerificationEcrecMapping'
import {mapPartnership_partnersDatabase} from '@/core/sdk/server/kobo/generatedInterface/Partnership_partnersDatabase/Partnership_partnersDatabaseMapping'
import {EcrecCashRegistrationTags} from '@/core/sdk/server/kobo/custom/KoboEcrecCashRegistration'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Protection_communityMonitoring} from '@/core/sdk/server/kobo/generatedInterface/Protection_communityMonitoring'
import {Protection_pss} from '@/core/sdk/server/kobo/generatedInterface/Protection_pss'
import {Protection_groupSession} from '@/core/sdk/server/kobo/generatedInterface/Protection_groupSession'
import {Protection_gbv} from '@/core/sdk/server/kobo/generatedInterface/Protection_gbv'


export type KoboUnwrapAnserType<T extends keyof KoboTypedAnswerSdk> = Promise<Awaited<ReturnType<KoboTypedAnswerSdk[T]>>['data']>


export class KoboTypedAnswerSdk {

  constructor(private client: ApiClient, private sdk = new KoboAnswerSdk(client)) {
  }


  private readonly search = this.sdk.search

  readonly searchBn_Re = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_Re>({
      formId: KoboIndex.byName('bn_re').id,
      fnMap: mapBn_Re,
      ...filters,
    })
  }

  readonly searcheBn_cashForRepair = (filters: KoboAnswerFilter = {}) => {
    return this.search<Shelter_CashForRepair>({
      formId: KoboIndex.byName('shelter_cashForRepair').id,
      fnMap: mapShelter_CashForRepair,
      ...filters,
    })
  }

  readonly searchBn_cashForRentApplication = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_cashForRentApplication>({
      formId: KoboIndex.byName('bn_cashForRentApplication').id,
      fnMap: mapBn_cashForRentApplication,
      ...filters,
    })
  }

  readonly searchBn_MpcaNfiOld = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_OldMpcaNfi>({
      formId: KoboIndex.byName('bn_1_mpcaNfi').id,
      fnMap: mapBn_OldMpcaNfi,
      ...filters,
    })
  }
  readonly searchBn_RapidResponseMechanism = (filters: KoboAnswerFilter = {}) => {
    return this.search<RapidResponseMechanism>({
      formId: KoboIndex.byName('bn_rapidResponse').id,
      fnMap: mapRapidResponseMechanism,
      ...filters,
    })
  }

  readonly searchMeal_VisitMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_visitMonitoring').id,
      fnMap: mapMeal_VisitMonitoring,
      ...filters,
    })
  }

  readonly searchPartnersDatabase = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('partnership_partnersDatabase').id,
      fnMap: mapPartnership_partnersDatabase,
      ...filters,
    })
  }

  readonly searchShelterTa = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('shelter_ta').id,
      fnMap: mapShelter_TA,
      fnMapTags: ShelterTaTagsHelper.mapTags,
      ...filters,
    })
  }

  readonly searchShelterNta = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('shelter_nta').id,
      fnMap: mapShelter_NTA,
      fnMapTags: _ => _ as ShelterNtaTags,
      ...filters,
    })
  }

  readonly searchMealCfmInternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_cfmInternal').id,
      fnMap: mapMeal_CfmInternal,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchMealCfmExternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_cfmExternal').id,
      fnMap: mapMeal_CfmExternal,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchProtection_Hhs2 = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_hhs2_1').id,
      fnMap: mapProtection_Hhs2_1,
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
      fnMap: mapMeal_VerificationEcrec,
      ...filters,
    })
  }

  readonly searchMeal_verificationWinterization = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_verificationWinterization').id,
      fnMap: mapMeal_VerificationWinterization,
      ...filters,
    })
  }

  readonly searchEcrec_cashRegistration = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('ecrec_cashRegistration').id,
      fnMap: mapEcrec_CashRegistration,
      fnMapTags: _ => _ as EcrecCashRegistrationTags,
      ...filters,
    })
  }
}
