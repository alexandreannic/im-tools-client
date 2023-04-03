import {ApiClient} from '../ApiClient'

export class NfiMPcaClient {
  constructor(private api: ApiClient) {
    
  }

  readonly index = () => {
    return this.api.get(`/nfi`)
  }
}
