export type UUID = string

export interface ApiPaginate<T> {
  total: number
  data: T[]
}

export interface Period {
  start: Date
  end: Date
}

export interface ApiPagination {
  offset: number
  limit: number
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? DeepReadonly<T[P]>
    : T[P];
}
