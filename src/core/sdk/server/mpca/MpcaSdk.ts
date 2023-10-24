import {ApiClient} from '../ApiClient'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {ApiSdkUtils} from '@/core/sdk/server/_core/ApiSdkUtils'
import {MpcaType, MpcaHelper} from '@/core/sdk/server/mpca/MpcaType'
import {ApiPaginate} from '@/core/type'

export class MpcaSdk {
  constructor(private client: ApiClient) {
  }

  readonly search = (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<MpcaType>> => {
    return this.client.post(`/mpca/search`, {body: {filters}}).then(ApiSdkUtils.mapPaginate(MpcaHelper.map))
  }

  readonly refresh = (): Promise<void> => {
    return this.client.post(`/mpca/refresh`)
  }

}
