import {ApiClient} from '../ApiClient'
import {KoboForm, KoboId} from './Kobo'
import {UUID} from '@/core/type'

export interface KoboFormCreate {
  name: string
  serverId: UUID
  uid: KoboId
}

interface KoboParsedFormName {
  name: string
  project?: string
  donors?: string[]
}

export class KoboFormSdk {

  constructor(private client: ApiClient) {
  }

  static readonly parseFormName = (name: string): KoboParsedFormName => {
    const match = name.match(/^\[(.*?)]\s*(?:\{(.*?)})?\s*(.*)$/)
    if (match) {
      const [, sector, donors, formName] = match
      return {
        project: sector,
        name: formName,
        donors: donors?.split(','),
      }
    }
    return {
      name,
    }
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
