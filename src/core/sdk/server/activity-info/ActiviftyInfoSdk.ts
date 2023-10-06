import {ApiClient} from '../ApiClient'
import {AiProtectionHhs} from '../../../../features/ActivityInfo/HHS_2_1/activityInfoInterface'

export class ActivityInfoSdk {
  constructor(private client: ApiClient) {
  }

  static readonly formId = {
    mpca: 'cxeirf9ldwx90rs6'
  }

  static readonly makeRequest = ({
    activityIdPrefix,
    activity,
    activityIndex,
    formId,
  }: {
    activityIdPrefix: string
    activity: any
    activityIndex: number
    formId: string

  }) => {
    return {
      'changes': [{
        'formId': formId,
        'recordId': activityIdPrefix + ('' + activityIndex).padStart(3, '0'),
        'parentRecordId': null,
        'fields': activity
      }]
    }
  }

  readonly submitActivity = (body: AiProtectionHhs.FormParams[]) => {
    return this.client.post(`/activity-info/activity`, {body})
  }

}
