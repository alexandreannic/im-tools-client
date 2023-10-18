import {Enum, mapFor, seq} from '@alexandreannic/ts-utils'
import {addMonths, differenceInMonths, isAfter, isBefore, startOfMonth} from 'date-fns'
import {groupBy as _groupBy} from '@/utils/groupBy'

export type KeyOf<T> = Extract<keyof T, string>

export const generateId = () => ('' + Math.random()).split('.')[1]

export type ValueOf<T> = T[keyof T];

export const capitalize = (_: string) => {
  return _.charAt(0).toUpperCase() + _.slice(1)
}

export const toPercent = <T extends number | undefined>(value: T, fractionDigits = 1): T extends undefined ? string | undefined : string => {
  return value !== undefined ? (value * 100).toFixed(fractionDigits) + '%' : undefined as any
}

export const objectToQueryString = (obj: {
  [key: string]: any
} = {}): string => {
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
  const avgMember = seq(data.flatMap(_ => mapFor(6, i => _[`_8_${i + 2}_1_For_household_${i + 2}_what_is_their_age`]))).filter(_ => !!_)
  const sexMember = seq(data.flatMap(_ => mapFor(6, i => _[`_8_${i + 2}_2_For_household_${i + 2}_what_is_their_sex`]))).filter(_ => !!_)
  const avgHoHH = seq(data.flatMap(_ => _[`_8_1_1_For_household_member_1_`])).filter(_ => !!_)
  const sexHoHH = seq(data.flatMap(_ => _[`_8_1_2_For_household_member_1_`])).filter(_ => !!_)
  console.info('avgMember', avgMember.sum(_ => +_) / avgMember.length)
  console.info('avgHoHH', avgHoHH.sum(_ => +_) / avgHoHH.length)
  console.info('sexMember', sexMember.filter(_ => _ === 'female').length / sexMember.length)
  console.info('sexHoHH', sexHoHH.filter(_ => _ === 'female').length / sexHoHH.length)
}

export const makeid = (length = 14) => {
  let result = ''
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const characters = letters + numbers
  const charactersLength = characters.length
  for (let i = 0; i < length - 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function groupByPredicates<T>(arr: T[], groupingFunctions: Array<(item: T) => string>): Record<string, any> {
  const result: Record<string, any> = {}

  arr.forEach((item) => {
    let current = result

    groupingFunctions.forEach((groupingFunction, index) => {
      const group = groupingFunction(item)
      const isLastFunction = index === groupingFunctions.length - 1

      if (!current[group]) {
        current[group] = isLastFunction ? [item] : {}
      } else if (isLastFunction) {
        current[group].push(item)
      }

      current = current[group]
    })
  })

  return result
}

export function groupByAndTransform<T>(arr: T[], predicates: ((item: T) => any)[], transformFn?: (value: T[]) => any): {
  [key: string]: any
} {
  const result: {
    [key: string]: any
  } = {}

  arr.forEach((item) => {
    let currentLevel = result
    predicates.forEach((predicate, index) => {
      const key = predicate(item)
      if (!currentLevel[key]) {
        currentLevel[key] = index === predicates.length - 1 ? [] : {}
      }
      currentLevel = currentLevel[key]
    })
    currentLevel.push(item)
  })

  if (transformFn) {
    transform(result)
  }

  return result

  function transform(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key])) {
        if (predicates.length === 1 || Object.keys(obj[key][0]).length === predicates.length) {
          obj[key] = transformFn!(obj[key])
        }
      } else {
        transform(obj[key])
      }
    })
  }
}

export const mapObjectValue = <K extends string, V, R>(t: Record<K, V>, fn: (_: V) => R): Record<K, R> => {
  const output = {} as Record<K, R>
  Enum.entries(t).forEach(([k, v]) => {
    output[k] = fn(v)
  })
  return output
}

export const mapObject = <K extends string, V, NK extends string, NV>(t: Record<K, V>, fn: (_: [K, V]) => [NK, NV]): Record<NK, NV> => {
  const output = {} as Record<NK, NV>
  Enum.entries(t).forEach(_ => {
    const res = fn(_)
    output[res[0]] = res[1]
  })
  return output
}

export const multipleFilters = <T>(list: T[], filters: Array<undefined | boolean | ((value: T, index: number, array: T[]) => boolean)>) => {
  if (filters.length === 0) return list
  return list.filter((t: T, index: number, array: T[]) => filters
    .filter(filter => filter instanceof Function)
    // @ts-ignore
    .every(filter => filter(t, index, array))
  )
}

export interface Paginate<T> {
  data: T[]
  totalSize: number
}

export const paginateData = <T>(limit: number, offset: number) => (data: T[]): Paginate<T> => {
  return {
    data: data.slice(offset, offset + limit),
    totalSize: data.length,
  }
}

export const forceArrayStringInference = <T extends string>(a: T[]) => a

export const uppercaseHandlingAcronyms = (text: string): string => {
  const acronyms = [
    'HoHH',
    'IDPs',
    'PwD',
    'PwDs',
    'HHs',
    'CoC',
    'w/',
    'PoC',
    'PoCs',
    'NFIs',
  ]
  text = text.toUpperCase()
  acronyms.forEach(_ => {
    text = text.replaceAll(_.toUpperCase(), _)
  })
  return text
}

export const getOverlapMonths = (startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date) => {
  const start1 = startOfMonth(startDate1)
  const end1 = startOfMonth(endDate1)
  const start2 = startOfMonth(startDate2)
  const end2 = startOfMonth(endDate2)

  const overlapStart = isBefore(start1, start2) ? start2 : start1
  const overlapEnd = isAfter(end1, end2) ? end2 : end1

  const overlapMonths = differenceInMonths(addMonths(overlapEnd, 1), overlapStart)

  return overlapMonths > 0 ? overlapMonths : 0
}

export const downloadBufferAsFile = (buffer: Buffer, filename: string) => {
  const _ = document.createElement('a')
  const content = new Blob([buffer])
  const encodedUri = window.URL.createObjectURL(content)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  link.click()
}

export const downloadStringAsFile = (stringData: string, fileName: string) => {
  const _ = document.createElement('a')
  _.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringData))
  _.setAttribute('download', fileName)
  _.click()
}


export const convertNumberIndexToLetter = (_: number) => {
  return (_ + 9).toString(36).toUpperCase()
}

export namespace Utils {

  export  type NonNullableKeys<T> = {
    [K in keyof T]-?: NonNullable<T[K]>;
  }

  export const removeAccent = (str: string): string => {
    const accentMap: Record<string, string> = {
      'à': 'a',
      'á': 'a',
      'â': 'a',
      'ã': 'a',
      'ä': 'a',
      'å': 'a',
      'ç': 'c',
      'è': 'e',
      'é': 'e',
      'ê': 'e',
      'ë': 'e',
      'ì': 'i',
      'í': 'i',
      'î': 'i',
      'ï': 'i',
      'ð': 'd',
      'ñ': 'n',
      'ò': 'o',
      'ó': 'o',
      'ô': 'o',
      'õ': 'o',
      'ö': 'o',
      'ø': 'o',
      'ù': 'u',
      'ú': 'u',
      'û': 'u',
      'ü': 'u',
      'ý': 'y',
      'ÿ': 'y',
      'ă': 'a',
      'ć': 'c',
      'đ': 'd',
      'ē': 'e',
    }

    return str.replace(/[àáâãäåçèéêëìíîïðñòóôõöøùúûüýÿćđē]/g, match => accentMap[match] || match)
  }

  export const pattern = {
    email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
    drcEmail: '^[a-zA-Z0-9._-]+@drc\.ngo$',
    // url: 'http',
    url: 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)',
  }

  export const regexp = mapObjectValue(pattern, _ => new RegExp(_))


  export const add = (...args: (string | number | undefined)[]) => {
    return args.reduce<number>((acc, _) => acc + safeNumber(_, 0), 0)
  }

  export const safeNumber: {
    (_: undefined | string | number, defaultValue?: undefined): number | undefined
    (_: undefined | string | number, defaultValue: number): number
  } = (_, defaultValue) => (isNaN(_ as number) ? defaultValue : +_!) as number

  export const removeHtml: {
    (_: string): string
    (_: undefined): undefined
    (_?: string): string | undefined
  } = (_) => _?.replace(/(<([^>]+)>)/gi, '') as any

  export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
      throw new Error(msg)
    }
  }

  export const slugify: {
    (_: string): string
    (_: undefined): undefined
    (_?: string): string | undefined
  } = (_) => _?.replaceAll(/\s/g, '_')
    .replaceAll(/[éèê]/g, 'e')
    .replaceAll(/[àâ]/g, 'a')
    .replaceAll(/[^a-zA-Z0-9_-]/g, '') as any

  export const dateToPeriod = (date: Date) => {
    const start = startOfMonth(date)
    return {
      start,
      end: addMonths(start, 1)
    }
  }

  export const logThen = (log: string) => <T>(args: T): T => {
    console.log(log, args)
    return args
  }

  export const openCanvasInNewTab = (canvas: HTMLCanvasElement, name: string) => {
    setTimeout(() => {
      // w.document.write('<static src="' + canvas.toDataURL('png') + '" />')
      canvas.toBlob((blob) => {
        const w = window.open(URL.createObjectURL(blob!), '_blank')!
        w.document.title = name
      })
      document.body.appendChild(canvas)
    }, 1000)
  }

  export const groupBy = _groupBy

  export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
      [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
  }
}

export const compareArray = <T extends string | number>(a?: T[], b?: T[]) => {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) return false
  }
  return true
}

export const tryy = <T>(fn: () => T) => {
  return {
    catchh: <C>(fnCatch: (e: Error) => C): T | C => {
      try {
        return fn()
      } catch (e: any) {
        return fnCatch(e)
      }
    }
  }
}