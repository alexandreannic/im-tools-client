import {ApiClient, RequestOption} from './ApiClient'
import {NfiMPcaSdk} from './nfi/NfiMPcaSdk'
import {KoboFormSdk} from './kobo/KoboSdk'
import {KoboSdk} from './kobo/KoboFormSdk'
import {ActivityInfoSdk} from './activity-info/ActiviftyInfoSdk'
import {KoboApiSdk} from './kobo/KoboApiSdk'
import {Method} from 'axios'
import {MpcaPaymentSdk} from './mpcaPaymentTool/MpcaPaymentSdk'
import {SessionSdk} from '@/core/sdk/server/session/SessionSdk'

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
  readonly koboForm = new KoboFormSdk(this.client)
  readonly kobo = new KoboSdk(this.client)
  readonly koboApi = new KoboApiSdk(this.client)
  readonly activityInfo = new ActivityInfoSdk(this.client)
  readonly mpcaPayment = new MpcaPaymentSdk(this.client)
}
