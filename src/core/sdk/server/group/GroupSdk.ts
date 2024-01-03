import {ApiClient} from '../ApiClient'
import {Access} from '@/core/sdk/server/access/Access'
import {UUID} from '@/core/type'
import {Group} from '@/core/sdk/server/group/GroupItem'
import {DrcJob} from '@/core/drcUa'

type GroupCreate = Pick<Group, 'name' | 'desc'>

type GroupItemCreate = Pick<Access, 'email' | 'level'> & {
  drcJob?: DrcJob[]
}

type GroupItemUpdate = GroupItemCreate

export class GroupSdk {

  constructor(private client: ApiClient) {
  }

  readonly create = (body: GroupCreate) => {
    return this.client.put<Group>(`/group`, {body})
  }

  readonly update = (id: UUID, body: GroupItemUpdate) => {
    return this.client.post<Group>(`/group/${id}`, {body})
  }

  readonly remove = async (id: UUID) => {
    await this.client.delete(`/group/${id}`)
  }

  readonly getAllWithItems = () => {
    return this.client.get<Group[]>(`/group`)
  }

  // readonly getItems = () => {
  //   return this.client.get('/group/item')
  // }

  readonly updateItem = (itemId: UUID) => {
    return this.client.post(`/group/item/${itemId}`)
  }

  readonly deleteItem = (itemId: UUID) => {
    return this.client.delete(`/group/item/${itemId}`)
  }

  readonly createItem = (groupId: UUID, body: GroupItemCreate) => {
    return this.client.put(`/group/${groupId}/item`, {body})
  }
}
