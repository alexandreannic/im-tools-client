import {ApiClient} from '../ApiClient'
import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import {UUID} from '@/core/type'
import {Group, GroupHelper} from '@/core/sdk/server/group/GroupItem'
import {DrcJob, DrcOffice} from '@/core/drcUa'

type GroupCreate = Pick<Group, 'name' | 'desc'>

type GroupUpdate = GroupCreate

type GroupItemCreate = {
  email?: string | null
  level: AccessLevel
  drcOffice?: DrcOffice | null
  drcJob?: DrcJob[] | null
}

export type GroupItemUpdate = {
  email?: string | null
  level: AccessLevel
  drcOffice?: DrcOffice | null
  drcJob?: DrcJob | null
}

export class GroupSdk {

  constructor(private client: ApiClient) {
  }

  readonly create = (body: GroupCreate) => {
    return this.client.put<Group>(`/group`, {body})
  }

  readonly update = (id: UUID, body: GroupUpdate) => {
    return this.client.post<Group>(`/group/${id}`, {body})
  }

  readonly remove = async (id: UUID) => {
    await this.client.delete(`/group/${id}`)
  }

  readonly getAllWithItems = (): Promise<Group[]> => {
    return this.client.get(`/group`).then(_ => _.map(GroupHelper.map))
  }

  // readonly getItems = () => {
  //   return this.client.get('/group/item')
  // }

  readonly updateItem = (itemId: UUID, body: GroupItemUpdate) => {
    return this.client.post(`/group/item/${itemId}`, {body})
  }

  readonly deleteItem = (itemId: UUID) => {
    return this.client.delete(`/group/item/${itemId}`)
  }

  readonly createItem = (groupId: UUID, body: GroupItemCreate) => {
    return this.client.put(`/group/${groupId}/item`, {body})
  }
}
