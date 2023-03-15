import {Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {KoboAnswer} from './sdk/kobo/KoboType'

export namespace ChartTools {
  
  export const multiple = <F extends string>({
    data,
    type,
    m,
    sortBy = 'value'
  }: {
    data: F[][],
    type?: 'percentOfTotalAnswers' | 'percentOfTotalChoices',
    m?: Record<F, string>,
    sortBy?: 'value' | 'name'
  }) => {
    const all = data.flatMap(_ => _)
    const obj = Arr(all).reduceObject<Record<F, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1])
    const base = fnSwitch(type!, {
      percentOfTotalAnswers: data.length,
      percentOfTotalChoices: all.length,
    }, _ => undefined)
    return Enum.entries(obj)
      .map(([k, v]) => ({name: m ? m[k] : k, value: v / (base ?? 1)}))
      .sort((a, b) => (b[sortBy] + '').localeCompare('' + a[sortBy], undefined, {numeric: true}))
  }

  export const single = <F extends KoboAnswer>(k: keyof F) => (f: F[]) => {
    return Arr(f).reduceObject<Record<NonNullable<F[keyof F]>, number>>((curr, acc) => {
      const answer = curr[k]!
      return [answer, (acc[answer] ?? 0) + 1]
    })
  }

  export const indexByDate = <F, >({
    data,
    getDate,
    percentageOf,
  }: {
    data: F[]
    getDate: (_: F) => string | undefined
    percentageOf?: (_: F) => boolean
  }): {date: string, count: number}[] => {
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
    return Enum.entries(obj).map(([k, v]) => ({date: k, count: percentageOf ? v.filter / v.total : v.total}))
  }
}
