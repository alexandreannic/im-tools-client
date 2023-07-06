import { Messages } from '@/core/i18n/localization/en'
import { multipleFilters } from '@/utils/utils'
import { Enum } from '@alexandreannic/ts-utils'

export namespace DashboardFilterHelper {

  export interface Shape<T> {
    icon?: string
    property: keyof T
    multiple?: boolean
    label: (_: Messages) => string
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
      const property = shape[k]!.property
      if (shape[k]?.multiple)
        return _ => filterValue.includes((_ as any)[property] as any)
      return _ => !!filterValue.find(f => f.includes((_ as any)[property] as any))
    }))
  }
}



