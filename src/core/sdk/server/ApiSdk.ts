import {ApiClient, RequestOption} from './ApiClient'
import {NfiMPcaSdk} from './nfi/NfiMPcaSdk'
import {ActivityInfoSdk} from './activity-info/ActiviftyInfoSdk'
import {KoboApiSdk} from './kobo/KoboApiSdk'
import {Method} from 'axios'
import {MpcaPaymentSdk} from './mpcaPaymentTool/MpcaPaymentSdk'
import {SessionSdk} from '@/core/sdk/server/session/SessionSdk'
import {KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {KoboServerSdk} from '@/core/sdk/server/kobo/KoboServerSdk'
import {KoboFormSdk} from '@/core/sdk/server/kobo/KoboFormSdk'
import {WfpDeduplicationSdk} from '@/core/sdk/server/wfpDeduplication/WfpDeduplicationSdk'

export class ApiSdk {
  constructor(private client: ApiClient) {

  }

  readonly proxy = <T = any>(method: Method, url: string, options?: RequestOption) => {
    return this.client.post<T>(`/proxy`, {
      responseType: 'blob',
      body: {
        method,
        url,
        body: options?.body,
        headers: options?.headers,
        mapData: (_: any) => _
      }
    })
  }
  readonly session = new SessionSdk(this.client)
  readonly nfi = new NfiMPcaSdk(this.client)
  readonly kobo = {
    answer: new KoboAnswerSdk(this.client),
    server: new KoboServerSdk(this.client),
    form: new KoboFormSdk(this.client),
  }
  readonly koboApi = new KoboApiSdk(this.client)
  readonly activityInfo = new ActivityInfoSdk(this.client)
  readonly mpcaPayment = new MpcaPaymentSdk(this.client)
  readonly wfpDeduplication = new WfpDeduplicationSdk(this.client)
}
