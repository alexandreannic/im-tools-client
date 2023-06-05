import {ApiClient, RequestOption} from './ApiClient'
import {NfiMPcaClient} from './nfi/NfiMPcaClient'
import {KoboFormClient} from './kobo/KoboClient'
import {KoboClient} from './kobo/KoboFormClient'
import {ActivityInfoSdk} from './activity-info/ActiviftyInfoSdk'
import {KoboApiClient} from './kobo/KoboApiClient'
import {Method} from 'axios'

export class ApiSdk {
  constructor(private client: ApiClient) {

  }

  readonly proxy = <T = any>(method: Method, url: string, options?: RequestOption) => {
    console.log(options)
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

  readonly nfi = new NfiMPcaClient(this.client)
  readonly koboForm = new KoboFormClient(this.client)
  readonly kobo = new KoboClient(this.client)
  readonly koboApi = new KoboApiClient(this.client)
  readonly activityInfo = new ActivityInfoSdk(this.client)
}
