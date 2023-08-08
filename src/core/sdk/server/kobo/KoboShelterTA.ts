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

export interface ShelterTaTags {
  progress?: ShelterProgress
}