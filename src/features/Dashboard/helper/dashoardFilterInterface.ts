import {multipleFilters} from '@/utils/utils'
import {Enum} from '@alexandreannic/ts-utils'

export namespace DashboardFilterHelper {

  interface ShapeBase<TOption> {
    icon?: string
    // name: string
    getOptions: undefined | ({value: TOption, label: string})[]
    label: string
    skipOption?: string[]
  }

  export interface ShapeMultiple<TData, TOption> extends ShapeBase<TOption> {
    multiple: true
    getValue: (_: TData) => TOption[]
  }

  export interface ShapeSingle<TData, TOption> extends ShapeBase<TOption> {
    multiple?: false
    getValue: (_: TData) => TOption
  }

  export type Shape<TData, TOption = any> = ShapeMultiple<TData, TOption> | ShapeSingle<TData, TOption>

  export const makeShape = <TData extends Record<string, any>>(filters: Record<string, Shape<TData>>) => filters

  export type InferShape<F extends Record<string, Shape<any>>> = Record<keyof F, string[]>

  export const filterData = <TData, TValue, TName extends string>(
    d: TData[],
    shapes: Partial<Record<TName, Shape<TData, TValue>>>,
    filters: Record<TName, string[]>
  ): TData[] => {
    return multipleFilters(d, Enum.entries(filters).filter(([k]) => shapes[k] !== undefined).map(([filterName, filterValue]) => {
      if (filterValue.length <= 0) return
      const shape = shapes[filterName]!
      if (shape.multiple)
        return _ => !!filterValue.find(f => shape.getValue(_)?.includes(f as any))
      return _ => filterValue.includes(shape.getValue(_) as any)
    }))
  }

  export const filterDataFromLokiJs = <TData extends object, TValue, TName extends string>(
    d: Collection<TData>,
    shapes: Partial<Record<TName, Shape<TData, TValue>>>,
    filters: Record<TName, string[]>
  ): TData[] => {
    const lokiFilters: any = {}
    Enum.entries(filters).forEach(([filterName, filterValue]) => {
      if (filterValue.length <= 0) return
      const shape = shapes[filterName]!
      lokiFilters[filterName] = {$in: filterValue}
    })
    return d.find(lokiFilters)
  }
}



