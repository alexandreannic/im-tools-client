import {ApiClient} from '../ApiClient'
import {AiProtectionHhs} from '../../../../features/ActivityInfo/HHS_2_1/activityInfoInterface'

export class ActivityInfoSdk {
  constructor(private client: ApiClient) {
  }

  readonly submitActivity = (body: AiProtectionHhs.FormParams[]) => {
    return this.client.post(`/activity-info/activity`, {body})
  }

}
