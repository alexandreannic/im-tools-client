import {ApiClient} from './ApiClient'
import {Id} from '@alexandreannic/react-hooks-lib/lib/useCrudList/UseCrud'

interface AnswersFilters {
  start?: Date
  end?: Date
}

export class KoboClient {

  constructor(private client: ApiClient) {
  }

  readonly getAnswers = (formId: Id, filters: AnswersFilters = {}) => {
    return this.client.get<any>(`/kobo/${formId}/answers`, {qs: filters})
  }

}
