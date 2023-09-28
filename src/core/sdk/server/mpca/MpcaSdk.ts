import {ApiClient} from '../ApiClient'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {ApiSdkUtils} from '@/core/sdk/server/_core/ApiSdkUtils'
import {MpcaHelper} from '@/core/sdk/server/mpca/Mpca'

export class MpcaSdk {
  constructor(private client: ApiClient) {
  }

  readonly search = (filters: KoboAnswerFilter = {}) => {
    return this.client.post(`/mpca/search`, {body: {filters}}).then(ApiSdkUtils.mapPaginate(MpcaHelper.map))
  }
}
