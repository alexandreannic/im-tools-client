import {ApiClient} from './ApiClient'
import {NfiMPcaClient} from './NfiMPcaClient'
import {KoboClient} from './kobo/KoboClient'

export class ApiSdk {
  constructor(private client: ApiClient) {

  }

  readonly nfi = new NfiMPcaClient(this.client)
  readonly kobo = new KoboClient(this.client)
}
