import {ApiClient} from '../ApiClient'
import {ApiPaginate} from '@/core/type'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {kobo} from '@/koboDrcUaFormId'
import {mapProtection_Hhs2_1} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Mapping'
import {Bn_Re} from '@/core/koboModel/Bn_Re/Bn_Re'
import {mapBn_Re} from '@/core/koboModel/Bn_Re/Bn_ReMapping'
import {mapShelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TAMapping'
import {mapShelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTAMapping'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ProtectionCommunityMonitoringTags, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {mapMeal_CfmExternal} from '@/core/koboModel/Meal_CfmExternal/Meal_CfmExternalMapping'
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
import {mapMeal_CfmInternal} from '@/core/koboModel/Meal_CfmInternal/Meal_CfmInternalMapping'
import {mapEcrec_CashRegistration} from '@/core/koboModel/Ecrec_CashRegistration/Ecrec_CashRegistrationMapping'
import {mapMeal_VisitMonitoring} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoringMapping'
import {KoboAnswerFilter, KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {mapMeal_VerificationWinterization} from '@/core/koboModel/Meal_VerificationWinterization/Meal_VerificationWinterizationMapping'
import {mapMeal_VerificationEcrec} from '@/core/koboModel/Meal_VerificationEcrec/Meal_VerificationEcrecMapping'
import {mapPartnership_partnersDatabase} from '@/core/koboModel/Partnership_partnersDatabase/Partnership_partnersDatabaseMapping'

export class KoboTypedAnswerSdk {

  constructor(private client: ApiClient, private sdk = new KoboAnswerSdk(client)) {
  }


  private readonly search = this.sdk.search

  readonly searchBn_Re = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_Re>({
      formId: kobo.drcUa.form.bn_re,
      fnMap: mapBn_Re,
      ...filters,
    })
  }

  readonly searcheBn_cashForRepair = (filters: KoboAnswerFilter = {}) => {
    return this.search<Shelter_CashForRepair>({
      formId: kobo.drcUa.form.shelter_cashForRepair,
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
      formId: kobo.drcUa.form.bn_1_mpcaNfi,
      fnMap: mapBn_OldMpcaNfi,
      ...filters,
    })
  }
  readonly searchBn_RapidResponseMechanism = (filters: KoboAnswerFilter = {}) => {
    return this.search<RapidResponseMechanism>({
      formId: kobo.drcUa.form.bn_rapidResponse,
      fnMap: mapRapidResponseMechanism,
      ...filters,
    })
  }

  readonly searchMeal_VisitMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.meal_visitMonitoring,
      fnMap: mapMeal_VisitMonitoring,
      ...filters,
    })
  }

  readonly searchPartnersDatabase = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.partnership_partnersDatabase,
      fnMap: mapPartnership_partnersDatabase,
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
      fnMap: mapMeal_CfmInternal,
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
      fnMapTags: _ => _ as ProtectionCommunityMonitoringTags,
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

  readonly searchSafetyIncident = (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<KoboAnswer<KoboSafetyIncidentHelper.Type>>> => {
    return this.search({
      formId: kobo.drcUa.form.safety_incident,
      fnMap: KoboSafetyIncidentHelper.mapData,
      ...filters,
    })
  }

  readonly searchMeal_verificationEcrec = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.meal_verificationEcrec,
      fnMap: mapMeal_VerificationEcrec,
      ...filters,
    })
  }

  readonly searchMeal_verificationWinterization = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.meal_verificationWinterization,
      fnMap: mapMeal_VerificationWinterization,
      ...filters,
    })
  }

  readonly searchEcrec_cashRegistration = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: kobo.drcUa.form.ecrec_cashRegistration,
      fnMap: mapEcrec_CashRegistration,
      ...filters,
    })
  }
}