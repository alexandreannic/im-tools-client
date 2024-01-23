import {Enum} from '@alexandreannic/ts-utils'
import {addMonths, differenceInMonths, isAfter, isBefore, startOfMonth} from 'date-fns'
import {groupBy as _groupBy} from '@/utils/groupBy'
import {NonNullableKeys} from '@/utils/utilsType'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'

export const generateId = () => ('' + Math.random()).split('.')[1]

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

/**@deprecated use Enum instead*/
export const objToArray = <T extends object, K extends string = 'name', V extends string = 'value'>(
  obj: T,
  keyName: K = 'name' as K,
  valueName: V = 'value' as V
): ({ [KK in K]: keyof T } & { [VV in V]: T[keyof T] })[] => {
  return Object.entries(obj).map(([k, v]) => ({[keyName]: k, [valueName]: v})) as any
}

/**@deprecated use Enum instead*/
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

export const multipleFilters = <T>(list: T[], filters: Array<undefined | boolean | ((value: T, index: number, array: T[]) => boolean)>) => {
  if (filters.length === 0) return list
  return list.filter((t: T, index: number, array: T[]) => filters
    .filter(filter => filter instanceof Function)
    // @ts-ignore
    .every(filter => filter(t, index, array))
  )
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

export class Utils {

  static readonly removeAccent = (str: string): string => {
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

  static readonly pattern = {
    email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
    drcEmail: '^[a-zA-Z0-9._-]+@drc\.ngo$',
    // url: 'http',
    url: 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)',
  }

  static readonly regexp = new Enum(Utils.pattern).transform((k, v) => [k, new RegExp(v)]).get()


  static readonly add = (...args: (string | number | undefined)[]) => {
    return args.reduce<number>((acc, _) => acc + Utils.safeNumber(_, 0), 0)
  }

  static readonly safeNumber: {
    (_: undefined | string | number, defaultValue?: undefined): number | undefined
    (_: undefined | string | number, defaultValue: number): number
  } = (_, defaultValue) => (isNaN(_ as number) ? defaultValue : +_!) as number

  static readonly removeHtml: {
    (_: string): string
    (_: undefined): undefined
    (_?: string): string | undefined
  } = (_) => _?.replace(/(<([^>]+)>)/gi, '') as any

  static readonly assert = (condition: any, msg?: string): asserts condition => {
    if (!condition) {
      throw new Error(msg)
    }
  }

  static readonly nullValuesToUndefined = <T extends Record<string | number, null | undefined | any>>(obj: T): NonNullableKeys<T> => {
    return new Enum(obj).transform((k, v) => [k as any, v === null ? undefined : v]).get() as any
  }

  static readonly slugify: {
    (_: string): string
    (_: undefined): undefined
    (_?: string): string | undefined
  } = (_) => _?.replaceAll(/\s/g, '_')
    .replaceAll(/[éèê]/g, 'e')
    .replaceAll(/[àâ]/g, 'a')
    .replaceAll(/[^a-zA-Z0-9_-]/g, '') as any

  static readonly logThen = (log: string) => <T>(args: T): T => {
    console.log(log, args)
    return args
  }

  static readonly openCanvasInNewTab = (canvas: HTMLCanvasElement, name: string) => {
    setTimeout(() => {
      // w.document.write('<static src="' + canvas.toDataURL('png') + '" />')
      canvas.toBlob((blob) => {
        const w = window.open(URL.createObjectURL(blob!), '_blank')!
        w.document.title = name
      })
      document.body.appendChild(canvas)
    }, 1000)
  }

  static readonly groupBy = _groupBy
}

export const compareArray = <T extends string | number>(a?: T[], b?: T[]) => {
  if (a === undefined || b === undefined) {
    return a === b
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

export const paginateData = <T>(limit: number, offset: number) => (data: T[]): ApiPaginate<T> => {
  return {
    data: data.slice(offset, offset + limit),
    total: data.length,
  }
}