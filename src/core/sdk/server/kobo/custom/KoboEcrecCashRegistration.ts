import {KoboBaseTags} from '@/core/sdk/server/kobo/Kobo'

export enum EcrecCashRegistrationPaymentStatus {
  Paid = 'Paid'
}

export enum EcrecCashRegistrationProgram {
  CashforAnimalFeed = 'CashforAnimalFeed',
  CashforAnimalShelter = 'CashforAnimalShelter',
}

export interface EcrecCashRegistrationTags extends KoboBaseTags {
  status?: EcrecCashRegistrationPaymentStatus
  paidUah?: number
  program?: EcrecCashRegistrationProgram
}