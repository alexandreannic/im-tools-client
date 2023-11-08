import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiPaginate} from '@/core/type'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {Utils} from '@/utils/utils'
import logThen = Utils.logThen

export class ShelterSdk {
  constructor(private client: ApiClient) {
  }

  readonly search = () => {
    return this.client.post<ApiPaginate<ShelterEntity>>(`/shelter/search`).then(logThen('SHELTER'))
    // .then(res => res.map(User.map))
  }
}
