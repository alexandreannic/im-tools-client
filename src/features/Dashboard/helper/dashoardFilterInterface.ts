import {Messages} from '@/core/i18n/localization/en'
import {multipleFilters} from '@/utils/utils'
import {Enum} from '@alexandreannic/ts-utils'

export namespace DashboardFilterHelper {

  export interface Shape<T> {
    icon?: string
    options: keyof T
    propertyIfDifferentThanOption?: string
    multiple?: boolean
    label: (_: Messages) => string
    skipOption?: string[]
  }

  export const makeShape = <T>() => <K extends string>(filters: Record<K, Shape<T>>) => filters

  export type InferShape<F extends Record<string, Shape<any>>> = Record<keyof F, string[]>

  export const filterData = <T, O, K extends string>(
    d: T[],
    shape: Partial<Record<K, Shape<O>>>,
    filters: Record<K, string[]>
  ): T[] => {
    return multipleFilters(d, Enum.entries(filters).map(([k, filterValue]) => {
      if (filterValue.length <= 0) return
      const property = shape[k]!.propertyIfDifferentThanOption ?? shape[k]!.options
      if (shape[k]?.multiple)
        return _ => !!filterValue.find(f => f.includes((_ as any)[property] as any))
      return _ => filterValue.includes((_ as any)[property] as any)
    }))
  }

  export const filterDataFromLokiJs = <T extends object, O, K extends string>(
    d: Collection<T>,
    shape: Partial<Record<K, Shape<O>>>,
    filters: Record<K, string[]>
  ): T[] => {
    const lokiFilters: any = {}
    Enum.entries(filters).forEach(([k, filterValue]) => {
      if (filterValue.length <= 0) return
      const property = shape[k]!.propertyIfDifferentThanOption ?? shape[k]!.options
      lokiFilters[property] = {$in: filterValue}
    })
    return d.find(lokiFilters)
  }
}



