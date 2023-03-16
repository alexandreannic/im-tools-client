export type UUID = string

export interface ApiPaginate<T> {
  total: number
  data: T[]
}

export interface Period {
  start: Date
  end: Date
}
