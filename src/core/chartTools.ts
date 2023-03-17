import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {objToArray} from '../utils/utils'

export interface ChartData {
  name: string
  value: number
}

export interface ChartDataObjValue {
  value: number
  baseValue?: number
  text?: string
}

export type ChartDataObj<T extends string> = Record<T, ChartDataObjValue>

export namespace ChartTools {

  export const multiple = <A extends string>({
    data,
    type,
    m,
    sortBy = 'value'
  }: {
    data: A[][],
    type?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
    m?: Record<A, string>,
    sortBy?: 'value' | 'name'
  }): ChartData[] => {
    const all = data.flatMap(_ => _)
    const obj = Arr(all).reduceObject<Record<A, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1])
    const base = fnSwitch(type!, {
      percentOfTotalAnswers: data.length,
      percentOfTotalChoices: all.length,
    }, _ => undefined)
    return Enum.entries(obj)
      .map(([k, v]) => ({name: m ? m[k] : k, value: v / (base ?? 1)}))
      .sort((a, b) => (b[sortBy] + '').localeCompare('' + a[sortBy], undefined, {numeric: true}))
  }

  export const groupBy = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    filterBase,
    groupBy
  }: {
    data: A[]
    groupBy: (_: A) => any
    filter: (_: A) => boolean
    filterBase?: (_: A) => boolean
  }): {name: string, value: number, base: number}[] => {
    const res: Record<string, {value: number, base: number}> = {} as any
    data.forEach(x => {
      const value = groupBy(x)
      if (filterBase && !filterBase(x)) return
      value[x].base = (value[x].base ?? 0) + 1
      if (filter(x)) {
        value[x].value = (value[x].base ?? 0) + 1
      }
    })
    return objToArray(res).map(_ => ({..._, ..._.value}))
  }

  export const byCategory = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    categories,
    filterBase
  }: {
    data: A[]
    filter: (_: A) => boolean
    filterBase?: (_: A) => boolean
    categories: Record<K, (_: A) => boolean>
  }): {name: K, value: number, base: number}[] => {
    const res = Enum.keys(categories).reduce((acc, category) => ({...acc, [category]: {value: 0, base: 0}}), {} as Record<K, {value: number, base: number}>)
    data.forEach(x => {
      Enum.entries(categories).forEach(([category, isCategory]) => {
        if (!isCategory(x)) return
        if (filterBase && !filterBase(x)) return
        res[category].base += 1
        if (filter(x)) {
          res[category].value += 1
        }
      })
    })
    return objToArray(res).map(_ => ({..._, ..._.value}))
  }

  export const single = <A extends string>({
    data,
    percent,
  }: {
    data: A[],
    percent?: boolean
  }) => {
    const obj = Arr(data).reduceObject<Record<A, number>>((curr, acc) => {
      return [curr, (acc[curr] ?? 0) + 1]
    })
    return Enum.entries(obj)
      .map(([k, v]) => ({name: k, value: v / (percent ? data.length : 1)}))
  }

  export const translate = (m: Record<string, string>) => (data: ChartData): ChartData => {
    data.name = m[data.name] ?? data.name
    return data
  }

  export const percentage = <A>({
    data,
    value,
    base
  }: {
    data: A[],
    value: (a: A) => boolean,
    base?: (a: A) => boolean,
  }) => {
    const v = Arr(data).count(value)
    const b = base ? Arr(data).count(base) : data.length
    return v / b
  }

  export const groupByDate = <F>({
    data,
    getDate,
    percentageOf,
  }: {
    data: F[]
    getDate: (_: F) => string | undefined
    percentageOf?: (_: F) => boolean
  }): _Arr<{date: string, count: number}> => {
    const obj = Arr(data).reduceObject<Record<string, {filter: number, total: number}>>((x, acc) => {
      const date = getDate(x) ?? 'undefined'
      let value = acc[date]
      if (!value) value = {filter: 0, total: 0}
      if (percentageOf) {
        value.filter += percentageOf(x) ? 1 : 0
      }
      value.total += 1
      return [date, value]
    })
    return Arr(Enum.entries(obj).map(([k, v]) => ({date: k, count: percentageOf ? v.filter / v.total : v.total})))
  }
}
