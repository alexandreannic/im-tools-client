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

export const ageGroup = Object.freeze({
  drc: {
    '0 - 4': [0, 4],
    '5 - 11': [5, 11],
    '12 - 17': [12, 17],
    '18 - 24': [18, 24],
    '25 - 49': [25, 49],
    '50 - 59': [50, 59],
    '60+': [elderlyLimitIncluded, Infinity],
  },
  echo: {
    '0 - 4': [0, 4],
    '5 - 17': [5, 17],
    '18 - 49': [18, 49],
    '50+': [50, Infinity],
  },
  bha: {
    '0 - 4': [0, 4],
    '5 - 9': [5, 9],
    '10 - 14': [10, 14],
    '15 - 18': [15, 18],
    '19 - 29': [19, 29],
    '30 - 59': [30, 59],
    '60+': [elderlyLimitIncluded, Infinity],
  }
})

export const groupByAgeGroup = <AG extends Record<string, number[]>>(
  ag: AG = ageGroup.bha as unknown as AG,
) => <T>(
  p: T, getAge: (_: T) => number
): keyof AG | undefined => {
  for (const [k, [min, max]] of Enum.entries(ag)) {
    if (getAge(p) !== undefined && getAge(p) >= min && getAge(p) <= max) return k
  }
}