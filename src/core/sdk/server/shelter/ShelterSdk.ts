import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiPaginate, Period} from '@/core/type'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'

export class ShelterSdk {
  constructor(private client: ApiClient) {
  }

  readonly search = (period: Partial<Period> = {}) => {
    return this.client.post<ApiPaginate<ShelterEntity>>(`/shelter/search`, {body: period}).then(_ => ({
      ..._, data: _.data.map(_ => {
        if (_.nta) _.nta.submissionTime = new Date(_.nta.submissionTime)
        if (_.ta) _.ta.submissionTime = new Date(_.ta.submissionTime)
        return _
      })
    }))
    // .then(res => res.map(User.map))
  }
}
