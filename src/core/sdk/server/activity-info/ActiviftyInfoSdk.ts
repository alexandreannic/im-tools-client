import {ApiClient} from '../ApiClient'
import {AiTypeProtectionRmm} from '@/features/ActivityInfo/Protection/aiProtectionGeneralInterface'
import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'

export class ActivityInfoSdk {
  constructor(private client: ApiClient) {
  }

  static readonly formId = {
    mpca: 'cxeirf9ldwx90rs6'
  }

  static readonly makeRecordRequest = ({
    activityIdPrefix,
    activity,
    activityIndex,
    formId,
  }: {
    activityIdPrefix: string
    activity: any
    activityIndex: number
    formId: string
  }): ActiviftyInfoRecords => {
    return {
      'changes': [{
        'formId': formId,
        'recordId': activityIdPrefix + ('' + activityIndex).padStart(3, '0'),
        'parentRecordId': null,
        'fields': activity
      }]
    }
  }

  readonly submitActivity = (body: AiTypeProtectionRmm.FormParams[]) => {
    return this.client.post(`/activity-info/activity`, {body})
  }

}
