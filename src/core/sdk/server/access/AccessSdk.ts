import {ApiClient} from '../ApiClient'
import {Access, AccessSearch, KoboDatabaseAccessParams, WfpDeduplicationAccessParams} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {UUID} from '@/core/type'
import {DrcJob} from '@/core/drcUa'

interface SearchByFeature {
  ({featureId, email}: {featureId: AppFeatureId.kobo_database, email?: string}): Promise<Access<KoboDatabaseAccessParams>[]>
  ({featureId, email}: {featureId: AppFeatureId.wfp_deduplication, email?: string}): Promise<Access<WfpDeduplicationAccessParams>[]>
  ({featureId, email}: {featureId?: AppFeatureId, email?: string}): Promise<Access<any>[]>
}

type FeatureCreateBase = Omit<Access, 'drcJob' | 'id' | 'createdAt' | 'updatedAt' | 'featureId' | 'params'> & {
  drcJob?: DrcJob[]
}

interface AccessUpdate extends Pick<Access, 'drcJob' | 'drcOffice' | 'level'> {

}

interface AccessCreate {
  (_: FeatureCreateBase & {featureId: AppFeatureId.kobo_database, params: KoboDatabaseAccessParams}): Promise<Access<KoboDatabaseAccessParams>>
  (_: FeatureCreateBase & {featureId: AppFeatureId.wfp_deduplication, params: KoboDatabaseAccessParams}): Promise<Access<WfpDeduplicationAccessParams>>
  (_: FeatureCreateBase & {featureId?: AppFeatureId, params?: any}): Promise<Access<any>>
}

export class AccessSdk {

  constructor(private client: ApiClient) {
  }

  readonly add: AccessCreate = (body) => {
    return this.client.put<Access>(`/access`, {body})
  }

  readonly update = (id: UUID, body: AccessUpdate) => {
    return this.client.post<Access>(`/access/${id}`, {body})
  }

  readonly remove = (id: UUID) => {
    return this.client.delete<Access>(`/access/${id}`)
  }

  readonly search: SearchByFeature = <T = any>(params: AccessSearch): Promise<Access<T>[]> => {
    return this.client.get<Record<keyof Access, any>[]>(`/access`, {qs: params}).then(_ => _.map(Access.map))
  }

  readonly searchForConnectedUser: SearchByFeature = <T = any>(params: AccessSearch): Promise<Access<T>[]> => {
    return this.client.get<Record<keyof Access, any>[]>(`/access/me`, {qs: params}).then(_ => _.map(Access.map))
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
