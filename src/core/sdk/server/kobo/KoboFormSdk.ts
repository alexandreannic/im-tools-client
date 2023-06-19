import {ApiClient} from '../ApiClient'
import {IKoboForm, KoboServer} from './Kobo'

export class KoboSdk {

  constructor(private client: ApiClient) {
  }

  readonly fetchServers = () => {
    return this.client.get<KoboServer[]>(`/kobo`)
  }

  readonly fetchForms = (formId: string): Promise<IKoboForm[]> => {
    return this.client.get(`/kobo/${formId}`).then(_ => _.results)
  }
}
