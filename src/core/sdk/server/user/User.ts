import {DrcOffice} from '@/core/drcJobTitle'
import {map} from '@alexandreannic/ts-utils'

export interface User {
  email: string
  name: string
  accessToken: string
  admin?: boolean
  drcJob?: string
  createdAt?: Date
  lastConnectedAt?: Date
  drcOffice?: DrcOffice
}

export class User {

  static readonly map = (u: Record<keyof User, any>): User => {
    return {
      ...u,
      lastConnectedAt: map(u.lastConnectedAt, _ => new Date(_)),
      createdAt: map(u.createdAt, _ => new Date(_)),
    }
  }
}