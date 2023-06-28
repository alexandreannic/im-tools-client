import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiPaginate} from '@/core/type'
import {WfpDeduplication} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'

interface WfpDeduplicationSearch {
  limit?: number
  offset?: number
  taxId?: string[]
  createdAtStart?: Date
  createdAtEnd?: Date
}

export class WfpDeduplicationSdk {

  constructor(private client: ApiClient) {
  }

  readonly search = (filters: WfpDeduplicationSearch = {}): Promise<ApiPaginate<WfpDeduplication>> => {
    return this.client.post<ApiPaginate<any>>(`/wfp-deduplication/search`, {body: filters}).then(_ => ({
      ..._,
      data: _.data.map(WfpDeduplication.map),
    }))
  }
}