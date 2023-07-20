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
  accessLevel: AccessLevel
  email?: string
  drcJob?: DrcJob
  drcOffice?: DrcOffice
  createdAt: Date
  updatedAt?: Date
}

export interface KoboDatabaseFeatureParams {
  koboFormId: KoboId,
  filters?: Record<string, string[]>
}

export class KoboDatabaseFeatureParams {
  static readonly create = (_: KoboDatabaseFeatureParams): any => _
}

export interface AccessSearch {
  email?: string
  featureId?: AppFeatureId
}

export class Access {

  static readonly map = (_: Record<keyof Access, any>): Access => {
    _.createdAt = new Date(_.createdAt)
    _.updatedAt = new Date(_.updatedAt)
    return _
  }
}