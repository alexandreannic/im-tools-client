import {AppFeatureId} from '@/features/appFeatureId'
import {DrcJob, DrcOffice} from '@/core/drcJobTitle'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'

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
  (f: AppFeatureId): (_: Access<any>) => _ is Access<any>
}

export class Access {

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