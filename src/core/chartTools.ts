import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {KoboAnswer} from './sdk/kobo/KoboType'

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
  }) => {
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

  export const indexByDate = <F>({
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
