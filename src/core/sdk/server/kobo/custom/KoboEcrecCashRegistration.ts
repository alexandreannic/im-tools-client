import {KoboAnswer, KoboBaseTags} from '@/core/sdk/server/kobo/Kobo'
import {CashStatus} from '@/shared/customInput/SelectCashStatus'
import {Ecrec_cashRegistration} from '@/core/sdk/server/kobo/generatedInterface/Ecrec_cashRegistration'
import {KoboGeneralMapping} from '@/core/sdk/server/kobo/custom/KoboGeneralMapping'

export namespace KoboEcrec_cashRegistration {

  export enum Program {
    CashforAnimalFeed = 'CashforAnimalFeed',
    CashforAnimalShelter = 'CashforAnimalShelter',
  }

  export interface Tags extends KoboBaseTags {
    status?: CashStatus
    paidUah?: number
    program?: Program
  }

  export type T = KoboAnswer<Ecrec_cashRegistration.T, Tags> & {
    custom: KoboGeneralMapping.IndividualBreakdown
  }
}
