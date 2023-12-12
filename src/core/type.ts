import {Enum} from '@alexandreannic/ts-utils'
import {KeyOf, Utils} from '@/utils/utils'
import {subDays} from 'date-fns'

export type UUID = string

export interface ApiPaginate<T> {
  total: number
  data: T[]
}

export interface Period {
  start: Date
  end: Date
}

export class PeriodHelper {
  static readonly fromyyyMM = (yyyyMM: string): Period => {
    const [year, month] = yyyyMM.split('-')
    return {
      start: new Date(parseInt(year), parseInt(month) - 1),
      end: subDays(new Date(parseInt(year), parseInt(month)), 1),
    }
  }
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

export type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number | undefined ? K : never;
}[keyof T]

export namespace Person {

  export type AgeGroup = Record<string, [number, number]>

  export interface Person {
    age?: number
    gender?: Gender
  }

  export const create = (_: Person) => _

  export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
  }

  export const elderlyLimitIncluded = 60

  export const isElderly = (age: number | string) => +age >= elderlyLimitIncluded

  export const ageGroup = Object.freeze({
    Quick: {
      '0 - 17': [0, 17] as [number, number],
      '18 - 49': [18, 49] as [number, number],
      '50+': [50, Infinity] as [number, number],
    },
    DRC: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 11': [5, 11] as [number, number],
      '12 - 17': [12, 17] as [number, number],
      '18 - 24': [18, 24] as [number, number],
      '25 - 49': [25, 49] as [number, number],
      '50 - 59': [50, 59] as [number, number],
      '60+': [elderlyLimitIncluded, Infinity] as [number, number],
    },
    ECHO: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 17': [5, 17] as [number, number],
      '18 - 49': [18, 49] as [number, number],
      '50+': [50, Infinity] as [number, number],
    },
    BHA: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 9': [5, 9] as [number, number],
      '10 - 14': [10, 14] as [number, number],
      '15 - 18': [15, 18] as [number, number],
      '19 - 29': [19, 29] as [number, number],
      '30 - 59': [30, 59] as [number, number],
      '60+': [elderlyLimitIncluded, Infinity] as [number, number],
    }
  })

  export const getAgeGroup = (str: keyof typeof ageGroup): AgeGroup => {
    return ageGroup[str] as unknown as AgeGroup
  }

  export const ageGroups = Enum.keys(ageGroup)

  export const ageToAgeGroup = <AG extends AgeGroup>(age: number | undefined, ag: AG): keyof AG | undefined => {
    for (const [k, [min, max]] of Enum.entries(ag)) {
      if (age !== undefined && age >= min && age <= max) return k as any
    }
    return undefined
  }


  export const groupByAgeGroup = <AG extends AgeGroup>(
    ag: AG = Person.ageGroup.BHA as unknown as AG,
  ) => <T>(
    p: T, getAge: (_: T) => number
  ) => {
    return ageToAgeGroup(getAge(p), ag)
  }

  export const filterByAgegroup = <AG extends AgeGroup>(ag: AG, key: keyof AG) => (p: Person) => {
    const [min, max] = ag[key]
    return p.age && p.age >= min && p.age <= max
  }

  export const groupByGenderAndGroup = <AG extends AgeGroup>(
    ag: AG = Person.ageGroup.BHA as unknown as AG,
  ) => (
    data: Person[]
  ): Record<KeyOf<AG>, Record<Gender, number>> => {
    const male = data.filter(_ => _.gender === Gender.Male)
    const female = data.filter(_ => _.gender === Gender.Female)
    return new Enum(ag).transform(k => {
      return [k as KeyOf<AG>, {
        [Gender.Female]: female.filter(filterByAgegroup(ag, k)).length,
        [Gender.Male]: male.filter(filterByAgegroup(ag, k)).length,
      }]
    }).get() as any
  }
}
