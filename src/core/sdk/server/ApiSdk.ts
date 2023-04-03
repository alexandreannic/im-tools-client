import {ApiClient} from './ApiClient'
import {NfiMPcaClient} from './nfi/NfiMPcaClient'
import {KoboFormClient} from './kobo/KoboClient'
import {KoboClient} from './kobo/KoboFormClient'

export class ApiSdk {
  constructor(private client: ApiClient) {

  }

  readonly nfi = new NfiMPcaClient(this.client)
  readonly koboForm = new KoboFormClient(this.client)
  readonly kobo = new KoboClient(this.client)
}
