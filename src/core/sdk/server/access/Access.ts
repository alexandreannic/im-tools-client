import {AppFeatureId} from '@/features/appFeatureId'
import {DrcJob, DrcOffice} from '@/core/drcUa'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {CfmDataProgram} from '@/core/sdk/server/kobo/custom/KoboMealCfm'

export enum AccessLevel {
  Read = 'Read',
  Write = 'Write',
  Admin = 'Admin',
}

export interface Access<T = any> {
  id: string
  featureId?: AppFeatureId
  params?: T
  level: AccessLevel
  email?: string
  drcJob?: DrcJob
  drcOffice?: DrcOffice
  createdAt: Date
  updatedAt?: Date
}

export interface WfpDeduplicationAccessParams {
  filters?: Record<string, string[]>
}

export interface KoboDatabaseAccessParams {
  koboFormId: KoboId,
  filters?: Record<string, string[]>
}

export interface CfmAccessParams {
  office?: DrcOffice[]
  program?: CfmDataProgram[]
  // seeHisOwn?: boolean
}

export interface ShelterAccessParams {
  office?: DrcOffice[]
}

export class WfpDeduplicationAccessParams {
  static readonly create = (_: WfpDeduplicationAccessParams): any => _
}

export class KoboDatabaseAccessParams {
  static readonly create = (_: KoboDatabaseAccessParams): any => _
}

export interface AccessSearch {
  featureId?: AppFeatureId
}

interface FilterByFeature {
  (f: AppFeatureId.kobo_database): (_: Access<any>) => _ is Access<KoboDatabaseAccessParams>
  (f: AppFeatureId.wfp_deduplication): (_: Access<any>) => _ is Access<WfpDeduplicationAccessParams>
  (f: AppFeatureId.cfm): (_: Access<any>) => _ is Access<CfmAccessParams>
  (f: AppFeatureId.shelter): (_: Access<any>) => _ is Access<ShelterAccessParams>
  (f: AppFeatureId): (_: Access<any>) => _ is Access<any>
}

export interface AccessSum {
  read: boolean
  write: boolean
  admin: boolean
}

export class Access {

  static readonly toSum = (accesses: Access<any>[], admin?: boolean) => {
    return {
      admin: admin || !!accesses.find(_ => _.level === AccessLevel.Admin),
      write: admin || !!accesses.find(_ => _.level === AccessLevel.Write || _.level === AccessLevel.Admin),
      read: admin || !!accesses.find(_ => _.level === AccessLevel.Write || _.level === AccessLevel.Admin || _.level === AccessLevel.Read),
    }
  }

  // @ts-ignore
  static readonly filterByFeature: FilterByFeature = (f) => (_) => {
    return _.featureId === f
  }

  static readonly map = (_: Record<keyof Access, any>): Access => {
    _.createdAt = new Date(_.createdAt)
    _.updatedAt = new Date(_.updatedAt)
    return _
  }
}