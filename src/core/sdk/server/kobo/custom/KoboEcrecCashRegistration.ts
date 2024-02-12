import {KoboBaseTags} from '@/core/sdk/server/kobo/Kobo'
import {CashStatus} from '@/shared/customInput/SelectCashStatus'

export enum EcrecCashRegistrationProgram {
  CashforAnimalFeed = 'CashforAnimalFeed',
  CashforAnimalShelter = 'CashforAnimalShelter',
}

export interface EcrecCashRegistrationTags extends KoboBaseTags {
  status?: CashStatus
  paidUah?: number
  program?: EcrecCashRegistrationProgram
}