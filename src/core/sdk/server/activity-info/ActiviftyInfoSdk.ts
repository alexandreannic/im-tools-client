import {ApiClient} from '../ApiClient'
import {AiProtectionHhs} from '../../../activityInfo/AiProtectionHhs'

export class ActivityInfoSdk {
  constructor(private client: ApiClient) {
  }

  readonly submitActivity = (body: AiProtectionHhs.FormParams[]) => {
    return this.client.post(`/activity-info/activity`, {body})
  }

}
