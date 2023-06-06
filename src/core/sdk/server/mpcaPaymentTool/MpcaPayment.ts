import {KoboId} from '../kobo/Kobo'

export interface MpcaPayment {
  id: string
  name?: string
  index: number
  budgetLineMPCA?: string
  budgetLineCFR?: string
  budgetLineStartUp?: string
  headOfOperation?: string
  cashAndVoucherAssistanceAssistant?: string
  financeAndAdministrationOfficer?: string
  city?: string
  createdAt: Date
  updatedAt: Date
  answers: KoboId[]
}

export interface MpcaPaymentUpdate {
  name?: string
  budgetLineMPCA?: string
  budgetLineCFR?: string
  budgetLineStartUp?: string
  headOfOperation?: string
  cashAndVoucherAssistanceAssistant?: string
  financeAndAdministrationOfficer?: string
  city?: string
}