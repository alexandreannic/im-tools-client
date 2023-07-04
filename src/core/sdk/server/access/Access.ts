import {AppFeature, AppFeatureId} from '@/features/appFeatureId'

export enum AccessLevel {
  Read = 'Read',
  Write = 'Write',
  Admin = 'Admin',
}

export interface Access<T = any> {
  id: string
  featureId?: string
  params?: T
  accessLevel: AccessLevel
  email: string
  createdAt: Date
  updatedAt?: Date
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