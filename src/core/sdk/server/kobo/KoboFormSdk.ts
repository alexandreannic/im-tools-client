import {ApiClient} from '../ApiClient'
import {ApiKoboForm, KoboForm, KoboId, KoboServer} from './Kobo'
import {UUID} from '@/core/type'

export interface KoboFormCreate {
  name: string
  serverId: UUID
  uid: KoboId
}


export class KoboFormSdk {

  constructor(private client: ApiClient) {
  }

  readonly create = (body: KoboFormCreate): Promise<KoboForm> => {
    return this.client.put(`/kobo/form`, {body})
  }

  readonly get = (formId: string): Promise<KoboForm> => {
    return this.client.get(`/kobo/form/${formId}`)
  }

  readonly getAll = (): Promise<KoboForm[]> => {
    return this.client.get(`/kobo/form`)
  }
}
