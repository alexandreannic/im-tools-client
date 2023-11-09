import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiPaginate, Period} from '@/core/type'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {Utils} from '@/utils/utils'
import logThen = Utils.logThen

export class ShelterSdk {
  constructor(private client: ApiClient) {
  }

  readonly search = (period: Period) => {
    return this.client.post<ApiPaginate<ShelterEntity>>(`/shelter/search`, {body: period})
    // .then(res => res.map(User.map))
  }
}
