import {Enum} from '@alexandreannic/ts-utils'

export const generateId = () => ('' + Math.random()).split('.')[1]

export type ValueOf<T> = T[keyof T];

export const capitalize = (_: string) => {
  return _.charAt(0).toUpperCase() + _.slice(1)
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
    acc[k] = v
    return acc
  }, {} as T)
}

export const includedIn = <T extends string>(t: T, checks: T[]) => {
  
}
