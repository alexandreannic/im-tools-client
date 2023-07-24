import {ApiClient} from '../ApiClient'
import {Access, AccessSearch, KoboDatabaseFeatureParams} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {UUID} from '@/core/type'

interface SearchByFeature {
  ({featureId, email}: {featureId: AppFeatureId.kobo_database, email?: string}): Promise<Access<KoboDatabaseFeatureParams>[]>
  ({featureId, email}: {featureId?: AppFeatureId, email?: string}): Promise<Access<any>[]>
}

export class AccessSdk {

  constructor(private client: ApiClient) {
  }

  readonly add = (body: Omit<Access, 'id' | 'createdAt' | 'updatedAt'>) => {
    return this.client.put<Access>(`/access`, {body})
  }

  readonly remove = (id: UUID) => {
    return this.client.delete<Access>(`/access/${id}`)
  }

  readonly search: SearchByFeature = <T = any>(params: AccessSearch): Promise<Access<T>[]> => {
    return this.client.get<Record<keyof Access, any>[]>(`/access`, {qs: params}).then(_ => _.map(Access.map))
  }

  readonly searchForConnectedUser: SearchByFeature = <T = any>(params: AccessSearch): Promise<Access<T>[]> => {
    return this.client.get<Record<keyof Access, any>[]>(`/access`, {qs: params}).then(_ => _.map(Access.map))
  }

  // readonly searchByFeature: SearchByFeature = (featureId) => {
  //   switch (featureId) {
  //     case AppFeatureId.kobo_database:
  //       return this.search<KoboDatabaseFeatureParams>({featureId})
  //     default:
  //       throw new Error('To implement')
  //   }
  // }
}
