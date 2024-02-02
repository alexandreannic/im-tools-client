import {KoboBaseTags} from '@/core/sdk/server/kobo/Kobo'

export enum EcrecCashRegistrationPaymentStatus {
  Paid = 'Paid',
  Rejected = 'Rejected',
  InternallyReferred = 'InternallyReferred',
  Received = 'Received',
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