import {Arr, Enum, mapFor} from '@alexandreannic/ts-utils'

export const generateId = () => ('' + Math.random()).split('.')[1]

export type ValueOf<T> = T[keyof T];

export const capitalize = (_: string) => {
  return _.charAt(0).toUpperCase() + _.slice(1)
}

export const toPercent = <T extends number | undefined>(value: T, fractionDigits = 1): T extends undefined ? string | undefined : string => {
  return value !== undefined ? (value * 100).toFixed(fractionDigits) + '%' : undefined as any
}

export const objectToQueryString = (obj: {[key: string]: any} = {}): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item.toString())
        }
      } else {
        params.set(key, value.toString())
      }
    }
  }
  return params.toString()
}

export const objToArray = <T extends object, K extends string = 'name', V extends string = 'value'>(
  obj: T,
  keyName: K = 'name' as K,
  valueName: V = 'value' as V
): ({ [KK in K]: keyof T } & { [VV in V]: T[keyof T] })[] => {
  return Object.entries(obj).map(([k, v]) => ({[keyName]: k, [valueName]: v})) as any
}

export const sortObject = <T extends Record<any, any>>(
  obj: T,
  predicate: (a: [keyof T, T[keyof T]], b: [keyof T, T[keyof T]]) => number
): T => {
  return Enum.entries(obj).sort(predicate).reduce<T>((acc, [k, v]) => {
    // @ts-ignore
    acc[k] = v
    return acc
  }, {} as T)
}

type PipeFunction = <T, R>(fn1: (arg: T) => R, ...fns: (((arg: R) => R) | undefined)[]) => (arg: T) => R;

export const pipe: PipeFunction = (fn1, ...fns) => {
  return (arg) => fns.reduce((prev, fn) => fn ? fn(prev) : prev, fn1(arg))
}

class Chain<T> {
  constructor(private value?: T) {
  }

  readonly map = <B>(f: (t: T) => B): Chain<B> => {
    return new Chain<B>(this.value ? f(this.value) : undefined)
  }

  readonly get: T = this.value as T

  get val() {
    return this.value
  }

  readonly getOrElse = (orElse: () => T): T => {
    if (this.value) return this.value
    return orElse()
  }
}

export const chain = <T>(value?: T) => new Chain(value)

export const getAvgAgeAndSex = (data: any[]) => {
  const avgMember = Arr(data.flatMap(_ => mapFor(6, i => _[`_8_${i + 2}_1_For_household_${i + 2}_what_is_their_age`]))).filter(_ => !!_)
  const sexMember = Arr(data.flatMap(_ => mapFor(6, i => _[`_8_${i + 2}_2_For_household_${i + 2}_what_is_their_sex`]))).filter(_ => !!_)
  const avgHoHH = Arr(data.flatMap(_ => _[`_8_1_1_For_household_member_1_`])).filter(_ => !!_)
  const sexHoHH = Arr(data.flatMap(_ => _[`_8_1_2_For_household_member_1_`])).filter(_ => !!_)
  console.info('avgMember', avgMember.sum(_ => +_) / avgMember.length)
  console.info('avgHoHH', avgHoHH.sum(_ => +_) / avgHoHH.length)
  console.info('sexMember', sexMember.filter(_ => _ === 'female').length / sexMember.length)
  console.info('sexHoHH', sexHoHH.filter(_ => _ === 'female').length / sexHoHH.length)
}
