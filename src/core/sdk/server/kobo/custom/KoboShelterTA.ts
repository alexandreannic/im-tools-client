import {ShelterContractor} from '@/core/sdk/server/kobo/custom/ShelterContractor'

export enum ShelterProgress {
  ContractorVisitDone = 'ContractorVisitDone',
  WorkEstimatesReceived = 'WorkEstimatesReceived',
  PurchaseRequestDone = 'PurchaseRequestDone',
  WorkOrderDone = 'WorkOrderDone',
  RepairWorksStarted = 'RepairWorksStarted',
  RepairWorksCompleted = 'RepairWorksCompleted',
  ContractorInvoiceReceived = 'ContractorInvoiceReceived',
  HandoverCertificateOfCompletionSigned = 'HandoverCertificateOfCompletionSigned',
  InvoicePaymentProcessed = 'InvoicePaymentProcessed',
}

export enum ShelterTagValidation {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Pending = 'Pending',
}

export interface ShelterNtaTags {
  validation?: ShelterTagValidation
}

export enum ShelterTaPriceLevel {
  Light = 'Light',
  Medium = 'Medium',
  Heavy = 'Heavy',
}

export interface ShelterTaTags {
  progress?: ShelterProgress
  contractor1?: ShelterContractor
  contractor2?: ShelterContractor
  agreement?: string
  workOrder?: string
  donor?: string
  workDoneAt?: Date
}

