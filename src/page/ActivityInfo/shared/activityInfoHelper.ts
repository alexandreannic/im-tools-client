export class ActivityInfoHelper {

  static readonly generateRequest = ({
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
}