import {DrcOffice} from '@/core/drcJobTitle'

export interface User {
  email: string
  name: string
  accessToken: string
  admin?: boolean
  drcJob?: string
  drcOffice?: DrcOffice
}