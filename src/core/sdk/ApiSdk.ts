import {ApiClient} from './ApiClient'
import {NfiMPcaClient} from './NfiMPcaClient'
import {KoboClient} from './KoboClient'

export class ApiSdk {
  constructor(private client: ApiClient) {

  }

  readonly nfi = new NfiMPcaClient(this.client)
  readonly kobo = new KoboClient(this.client)
}
