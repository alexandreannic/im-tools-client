import {Enum, fnSwitch, seq, Seq} from '@alexandreannic/ts-utils'
import {mapObject, mapObjectValue, sortObject} from '../utils/utils'
import {ReactNode} from 'react'

export interface ChartDataValPercent extends ChartDataVal {
  base: number
  percent: number
}

export interface ChartDataVal {
  value: number
  base?: number
  label?: ReactNode
  desc?: string
}

export const makeChartData: {
  (_: ChartDataValPercent): ChartDataValPercent
  (_: ChartDataVal): ChartDataVal
} = (_) => {
  return _ as any
}

export type ChartData<K extends string = string> = Record<K, ChartDataVal>

export namespace ChartTools {

  export const mapValue = <K extends string, V, R>(fn: (_: V) => R) => (obj: Record<K, V>): Record<K, R> => mapObjectValue(obj, fn)

  export const map = <K extends string, V, NK extends string, NV>(fn: (_: [K, V]) => [NK, NV]) => (obj: Record<K, V>): Record<NK, NV> => mapObject(obj, fn)

  export const take = <T extends string>(n: number) => (obj: Record<T, ChartDataVal>): Record<T, ChartDataVal> => {
    return seq(Enum.entries(obj).splice(0, n)).reduceObject(_ => _)
  }

  export const sortBy = {
    custom: <T extends string>(order: T[]) => <V>(obj: Record<T, V>): Record<T, V> => {
      return sortObject(obj as Record<T, V>, ([aK, aV], [bK, bV]) => {
        return order.indexOf(aK) - order.indexOf(bK)
      })
    },
    percent: <T extends string>(obj: Record<T, ChartDataVal>): Record<T, ChartDataVal> => {
      return sortObject(obj as Record<string, ChartDataVal>, ([aK, aV], [bK, bV]) => {
        try {
          return bV.value / (bV.base ?? 1) - aV.value / (aV.base ?? 1)
        } catch (e) {
          return 0
        }
      })
    },
    value: <T extends string>(obj: Record<T, ChartDataVal>): Record<T, ChartDataVal> => {
      return sortObject(obj as Record<string, ChartDataVal>, ([aK, aV], [bK, bV]) => {
        return bV.value - aV.value
      })
    },
    label: <T extends string>(obj: Record<T, ChartDataVal>): Record<T, ChartDataVal> => {
      return sortObject(obj as Record<string, ChartDataVal>, ([aK, aV], [bK, bV]) => {
        return (bV.label as string ?? '').localeCompare(aV.label as string ?? '')
      })
    }
  }

  export const single = <A extends string>({
    data,
    percent,
    filterValue,
  }: {
    data: A[],
    filterValue?: A[],
    percent?: boolean
  }): ChartData<Exclude<A, keyof typeof filterValue>> => {
    const obj = seq(data.filter(_ => filterValue ? !filterValue.includes(_) : true)).reduceObject<Record<A, number>>((curr, acc) => {
      return [curr, (acc[curr] ?? 0) + 1]
    })
    const res = {} as ChartData<A>
    Enum.keys(obj).forEach(k => {
      res[k] = {value: obj[k] / (percent ? data.length : 1)}
    })
    return ChartTools.sortBy.value(res)
  }

  export const multiple = <A extends string>({
    data,
    base = 'percentOfTotalAnswers',
    filterValue,
  }: {
    data: Seq<A[] | undefined>,
    filterValue?: A[],
    base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
  }): ChartData<A> => {
    const filteredData = data.compact().filter(_ => filterValue ? seq(_).intersect(filterValue).length === 0 : true)
    const flatData: A[] = filteredData.flatMap(_ => _)
    const obj = seq(flatData).reduceObject<Record<A, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1])
    const baseCount = fnSwitch(base!, {
      percentOfTotalAnswers: filteredData.length,
      percentOfTotalChoices: flatData.length,
    }, _ => undefined)
    const res = {} as ChartData<A>
    Enum.keys(obj).forEach(k => {
      if (!res[k]) res[k] = {value: 0, base: 0}
      res[k].value = obj[k]
      res[k].base = baseCount
    })
    return ChartTools.sortBy.value(res)
  }

  export const groupBy = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    filterBase,
    groupBy
  }: {
    data: A[]
    groupBy: (_: A) => K | undefined
    filter: (_: A) => boolean
    filterBase?: (_: A) => boolean
  }): ChartData<K> => {
    const res: ChartData<any> = {} as any
    data.forEach(x => {
      const value = groupBy(x) ?? 'undefined'
      if (!res[value]) res[value] = {value: 0} as ChartDataVal
      if (filterBase && filterBase(x)) {
        res[value].base = (res[value].base ?? 0) + 1
      }
      if (filter(x)) {
        res[value].value = res[value].value! + 1
      }
    })
    return res
  }

  export const byCategory = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    categories,
    filterBase,
    filterZeroCategory
  }: {
    data: A[]
    filter: (_: A) => boolean | undefined
    filterBase?: (_: A) => boolean | undefined
    filterZeroCategory?: boolean
    categories: Record<K, (_: A) => boolean>
  }): Record<K, ChartDataValPercent> => {
    const res = Enum.keys(categories).reduce((acc, category) => ({...acc, [category]: {value: 0, base: 0, percent: 0}}), {} as Record<K, ChartDataValPercent>)
    data.forEach(x => {
      Enum.entries(categories).forEach(([category, isCategory]) => {
        if (!isCategory(x)) return
        if (filterBase && !filterBase(x)) return
        const r = res[category]
        r.base += 1
        if (filter(x)) {
          r.value += 1
          r.percent = r.value / r.base
        }
      })
    })
    if (filterZeroCategory) {
      Enum.keys(res).forEach(k => {
        if (res[k].value === 0) delete res[k]
      })
    }
    return res
  }
  // export const reduceByCategory = <A extends Record<string, any>, K extends string, R>({
  //   data,
  //   reduce,
  //   categories,
  //   initialValue,
  // }: {
  //   data: A[]
  //   reduce: (acc: R, _: A) => R
  //   categories: Record<K, (_: A) => boolean>
  //   initialValue: R,
  // }): Record<K, R> => {
  //   const res = Enum.keys(categories).reduce((acc, category) => ({...acc, [category]: undefined}), {} as Record<K, R>)
  //   data.forEach(x => {
  //     Enum.entries(categories).forEach(([category, isCategory]) => {
  //       if (!isCategory(x)) return
  //       res[category] = filter(res[category], x)
  //     })
  //   })
  //   return res

  // }

  export const sumByCategory = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    sumBase,
    categories,
  }: {
    data: A[]
    filter: (_: A) => number
    sumBase?: (_: A) => number
    categories: Record<K, (_: A) => boolean>
  }): Record<K, ChartDataVal> => {
    const res = Enum.keys(categories).reduce((acc, category) => ({...acc, [category]: {value: 0, base: 0}}), {} as Record<K, {value: number, base: 0}>)
    data.forEach(x => {
      Enum.entries(categories).forEach(([category, isCategory]) => {
        if (!isCategory(x)) return
        const base = sumBase ? sumBase(x) : 1
        if (base) {
          res[category].base += base
          res[category].value += filter(x) ?? 0
        }
      })
    })
    return res
  }

  export const setLabel = <A extends string>(m: Record<A, ReactNode>) => (data: ChartData<A>): ChartData<A> => {
    Enum.keys(data).forEach(k => {
      data[k].label = m[k]
    })
    return data
  }


  export const setDesc = (m: Record<string, string>) => (data: ChartData): ChartData => {
    Object.keys(data).forEach(k => {
      data[k].desc = m[k]
    })
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
  }): ChartDataValPercent => {
    const v = seq(data).count(value)
    const b = (base ? seq(data).count(base) : data.length) || 1
    return {value: v, base: b, percent: v / b}
  }

  export const groupByDate = <F extends string>({
    data,
    getDate,
    percentageOf,
  }: {
    data: F[]
    getDate: (_: F) => string | undefined
    percentageOf?: (_: F) => boolean
  }): ChartData<F> => {
    const obj = seq(data).reduceObject<Record<string, {filter: number, total: number}>>((x, acc) => {
      const date = getDate(x) ?? 'undefined'
      let value = acc[date]
      if (!value) value = {filter: 0, total: 0}
      if (percentageOf) {
        value.filter += percentageOf(x) ? 1 : 0
      }
      value.total += 1
      return [date, value]
    })
    const res: ChartData = {}
    Object.entries(obj).forEach(([k, v]) => {
      res[k] = {
        label: k,
        value: percentageOf ? v.filter / v.total : v.total,
      }
    })
    return res
  }
}
