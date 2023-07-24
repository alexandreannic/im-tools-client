import {ApiClient} from '@/core/sdk/server/ApiClient'
import {User} from '@/core/sdk/server/user/User'

export class UserSdk {
  constructor(private client: ApiClient) {
  }

  readonly update = (user: Partial<User>) => {
    return this.client.post<User>(`/user/me`, {body: user})
  }

  readonly search = () => {
    return this.client.get<User[]>(`/user`)
  }
}
