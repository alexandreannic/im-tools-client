export enum MealCheckStatus {
  Requested = 'Requested',
  Selected = 'Selected',
}

export interface MealVerificationTags {
  _mealCheck: {
    name: string
    desc?: string
    status: MealCheckStatus
    filters: any
    author: string
    createdAt: Date
  }
}