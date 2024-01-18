import {ApiClient} from '../ApiClient'
import {ApiPaginate} from '@/core/type'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboIndex} from '@/KoboIndex'
import {mapProtection_Hhs2_1} from '@/core/generatedKoboInterface/Protection_Hhs2_1/Protection_Hhs2_1Mapping'
import {Bn_Re} from '@/core/generatedKoboInterface/Bn_Re/Bn_Re'
import {mapBn_Re} from '@/core/generatedKoboInterface/Bn_Re/Bn_ReMapping'
import {mapShelter_TA} from '@/core/generatedKoboInterface/Shelter_TA/Shelter_TAMapping'
import {mapShelter_NTA} from '@/core/generatedKoboInterface/Shelter_NTA/Shelter_NTAMapping'
import {ShelterNtaTags, ShelterTaTagsHelper} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ProtectionCommunityMonitoringTags, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {mapMeal_CfmExternal} from '@/core/generatedKoboInterface/Meal_CfmExternal/Meal_CfmExternalMapping'
import {KoboMealCfmHelper} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {RapidResponseMechanism} from '@/core/generatedKoboInterface/RapidResponseMechanism/RapidResponseMechanism'
import {mapRapidResponseMechanism} from '@/core/generatedKoboInterface/RapidResponseMechanism/RapidResponseMechanismMapping'
import {mapShelter_CashForRepair} from '@/core/generatedKoboInterface/Shelter_CashForRepair/Shelter_CashForRepairMapping'
import {Shelter_CashForRepair} from '@/core/generatedKoboInterface/Shelter_CashForRepair/Shelter_CashForRepair'
import {Bn_OldMpcaNfi} from '@/core/generatedKoboInterface/Bn_OldMpcaNfi/Bn_OldMpcaNfi'
import {mapBn_OldMpcaNfi} from '@/core/generatedKoboInterface/Bn_OldMpcaNfi/Bn_OldMpcaNfiMapping'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {mapBn_cashForRentApplication} from '@/core/generatedKoboInterface/Bn_cashForRentApplication/Bn_cashForRentApplicationMapping'
import {Bn_cashForRentApplication} from '@/core/generatedKoboInterface/Bn_cashForRentApplication/Bn_cashForRentApplication'
import {mapProtection_communityMonitoring} from '@/core/generatedKoboInterface/Protection_communityMonitoring/Protection_communityMonitoringMapping'
import {mapProtection_pss} from '@/core/generatedKoboInterface/Protection_pss/Protection_pssMapping'
import {mapProtection_groupSession} from '@/core/generatedKoboInterface/Protection_groupSession/Protection_groupSessionMapping'
import {mapMeal_CfmInternal} from '@/core/generatedKoboInterface/Meal_CfmInternal/Meal_CfmInternalMapping'
import {mapEcrec_CashRegistration} from '@/core/generatedKoboInterface/Ecrec_CashRegistration/Ecrec_CashRegistrationMapping'
import {mapMeal_VisitMonitoring} from '@/core/generatedKoboInterface/Meal_VisitMonitoring/Meal_VisitMonitoringMapping'
import {KoboAnswerFilter, KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {mapMeal_VerificationWinterization} from '@/core/generatedKoboInterface/Meal_VerificationWinterization/Meal_VerificationWinterizationMapping'
import {mapMeal_VerificationEcrec} from '@/core/generatedKoboInterface/Meal_VerificationEcrec/Meal_VerificationEcrecMapping'
import {mapPartnership_partnersDatabase} from '@/core/generatedKoboInterface/Partnership_partnersDatabase/Partnership_partnersDatabaseMapping'
import {EcrecCashRegistrationTags} from '@/core/sdk/server/kobo/custom/KoboEcrecCashRegistration'
import {mapProtection_gbv} from '@/core/generatedKoboInterface/Protection_gbv/Protection_gbvMapping'

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
      fnMap: mapProtection_communityMonitoring,
      fnMapTags: _ => _ as ProtectionCommunityMonitoringTags,
      ...filters,
    })
  }

  readonly searchProtection_pss = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_pss').id,
      fnMap: mapProtection_pss,
      ...filters,
    })
  }

  readonly searchProtection_groupSession = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_groupSession').id,
      fnMap: mapProtection_groupSession,
      ...filters,
    })
  }

  readonly searchProtection_gbv = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_gbv').id,
      fnMap: mapProtection_gbv,
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
