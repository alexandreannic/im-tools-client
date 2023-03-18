import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {objToArray, sortObject} from '../utils/utils'

/** @deprecated*/
export interface ChartData {
  name: string
  value: number
}

export interface ChartDataObjValue {
  value: number
  base?: number
  label?: string
  desc?: string
}

export type ChartD<K extends string = string> = Record<K, ChartDataObjValue>

export type ChartDataObj<T extends string> = Record<T, ChartDataObjValue>

export namespace ChartTools {

  export const sortBy = {
    percent: <T extends string>(obj: Record<T, ChartDataObjValue>): Record<T, ChartDataObjValue> => {
      return sortObject(obj as Record<string, ChartDataObjValue>, ([aK, aV], [bK, bV]) => {
        try {
          return bV.value / (bV.base ?? 1) - aV.value / (aV.base ?? 1)
        } catch (e) {
          return 0
        }
      })
    },
    value: <T extends string>(obj: Record<T, ChartDataObjValue>): Record<T, ChartDataObjValue> => {
      return sortObject(obj as Record<string, ChartDataObjValue>, ([aK, aV], [bK, bV]) => {
        return bV.value - aV.value
      })
    }
  }

  export const multiple = <A extends string>({
    data,
    type,
  }: {
    data: A[][],
    type?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
  }): ChartD<A> => {
    const all = data.flatMap(_ => _)
    const obj = Arr(all).reduceObject<Record<A, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1])
    const base = fnSwitch(type!, {
      percentOfTotalAnswers: data.length,
      percentOfTotalChoices: all.length,
    }, _ => undefined)
    const res: ChartD = {}
    Enum.keys(obj).forEach(k => {
      if (!res[k]) res[k] = {value: 0, base: 0}
      // res[k].value = obj[k]
      res[k].value = obj[k]
      res[k].value = obj[k] / (base ?? 1)
    })
    return res
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
  }): ChartD => {
    const res: ChartD<any> = {} as any
    data.forEach(x => {
      const value = groupBy(x)
      if (filterBase && !filterBase(x)) return
      if (!res[value]) res[value] = {value: 0, base: 0} as ChartDataObjValue
      res[value].base = res[value].base! + 1
      if (filter(x)) {
        res[value].value = res[value].base! + 1
      }
    })
    return res
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
  }): Record<K, ChartDataObjValue> => {
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
    return res
  }

  export const single = <A extends string>({
    data,
    percent,
  }: {
    data: A[],
    percent?: boolean
  }): ChartD<A> => {
    const obj = Arr(data).reduceObject<Record<A, number>>((curr, acc) => {
      return [curr, (acc[curr] ?? 0) + 1]
    })
    const res: ChartD = {}
    Enum.keys(obj).forEach(k => {
      res[k] = {value: obj[k] / (percent ? data.length : 1)}
    })
    return res
  }

  export const setLabel = (m: Record<string, string>) => (data: ChartD): ChartD => {
    Object.keys(data).forEach(k => {
      data[k].label = m[k]
    })
    return data
  }


  export const setDesc = (m: Record<string, string>) => (data: ChartD): ChartD => {
    Object.keys(data).forEach(k => {
      data[k].desc = m[k]
    })
    return data
  }

  /** @deprecated */
  export const translateOld = (m: Record<string, string>) => (data: ChartData): ChartData => {
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

  export const groupByDate = <F extends string>({
    data,
    getDate,
    percentageOf,
  }: {
    data: F[]
    getDate: (_: F) => string | undefined
    percentageOf?: (_: F) => boolean
  }): ChartD<F> => {
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
    const res: ChartD = {}
    Object.entries(obj).forEach(([k, v]) => {
      res[k] = {
        label: k,
        value: percentageOf ? v.filter / v.total : v.total,
      }
    })
    return res
  }
}
