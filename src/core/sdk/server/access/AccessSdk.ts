import {ApiClient} from '../ApiClient'
import {Access, AccessSearch} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'

export interface DatabaseFeatureParams {
  database: KoboId,
  filters: Record<string, string[]>
}

interface SearchByFeature {
  (_: AppFeatureId.databases): Promise<Access<DatabaseFeatureParams>[]>
  (_: AppFeatureId.dashboards): Promise<Access[]>
}

export class AccessSdk {

  constructor(private client: ApiClient) {
  }

  readonly search = <T = any>(params: AccessSearch): Promise<Access<T>[]> => {
    return this.client.get<Record<keyof Access, any>[]>(`/access`, {qs: params}).then(_ => _.map(Access.map))
  }

  readonly searchByFeature: SearchByFeature = (featureId) => {
    switch (featureId) {
      case AppFeatureId.databases:
        return this.search<DatabaseFeatureParams>({featureId})
      default:
        throw new Error('To implement')
    }
  }
}
