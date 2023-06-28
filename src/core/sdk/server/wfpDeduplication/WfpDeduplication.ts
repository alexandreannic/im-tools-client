export interface WfpDeduplication {
  id: string
  amount: number
  wfpId: number
  createdAt: Date
  validFrom: Date
  expiry: Date
  beneficiaryId: string
  taxId?: string
  message?: string
  status: string
  existingOrga?: string
  existingStart?: Date
  existingEnd?: Date
  existingAmount?: number
}

export class WfpDeduplication {
  static readonly map = (_: Record<keyof WfpDeduplication, any> & {beneficiary: {taxId: string}}): WfpDeduplication => ({
    ..._,
    createdAt: new Date(_.createdAt),
    validFrom: new Date(_.validFrom),
    expiry: new Date(_.expiry),
    existingStart: _.existingStart ? new Date(_.existingStart) : undefined,
    existingEnd: _.existingEnd ? new Date(_.existingEnd) : undefined,
    // taxId: _.beneficiary.taxId,
  })
}