import {Enum} from '@alexandreannic/ts-utils'

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

export type StringArrayKeys<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T]

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T]


export const elderlyLimitIncluded = 60

export const isElderly = (age: number | string) => +age >= elderlyLimitIncluded

export const ageGroupBHA = Object.freeze({
  '0 - 4': [0, 4],
  '5 - 9': [5, 9],
  '10 - 14': [10, 14],
  '15 - 17': [15, 17],
  '18 - 29': [18, 29],
  '30 - 59': [30, 59],
  '60+': [elderlyLimitIncluded, Infinity],
})
export const ageGroup = Object.freeze({
  '0 - 4': [0, 4],
  '5 - 11': [5, 11],
  '12 - 17': [12, 17],
  '18 - 24': [18, 24],
  '25 - 49': [25, 49],
  '50 - 59': [50, 59],
  '60+': [elderlyLimitIncluded, Infinity],
})

export const groupByAgeGroup = <T>(p: T, getAge: (_: T) => number): keyof typeof ageGroupBHA | undefined => {
  for (const [k, [min, max]] of Enum.entries(ageGroupBHA)) {
    if (getAge(p) && getAge(p) >= min && getAge(p) <= max) return k
  }
}