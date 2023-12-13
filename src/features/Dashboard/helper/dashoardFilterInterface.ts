import {multipleFilters} from '@/utils/utils'
import {Enum, Seq} from '@alexandreannic/ts-utils'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {ReactNode} from 'react'

export namespace DashboardFilterHelper {

  interface ShapeOption<TOption extends string = string> {
    value: TOption,
    label?: ReactNode
  }

  interface ShapeBase<TData, TOption extends string> {
    icon?: string
    // name: string
    getOptions: undefined | ShapeOption<TOption>[]
    label: string
    customFilter?: (filterValue: string[], _: TData) => boolean
    skipOption?: string[]
  }

  export interface ShapeMultiple<TData, TOption extends string = string> extends ShapeBase<TData, TOption> {
    multiple: true
    getValue?: (_: TData) => TOption[] | undefined
  }

  export interface ShapeSingle<TData, TOption extends string = string> extends ShapeBase<TData, TOption> {
    multiple?: false
    getValue?: (_: TData) => TOption | undefined
  }

  export const buildOptions = (opt: string[], addBlank?: boolean): ShapeOption[] => {
    return [
      ...(addBlank ? [SheetUtils.blankOption] : []),
      ...opt.map(buildOption),
    ]
  }

  export const buildOption = (_: string): ShapeOption => {
    return {value: _, label: _}
  }

  export type Shape<TData, TOption extends string = string> = ShapeMultiple<TData, TOption> | ShapeSingle<TData, TOption>

  export const makeShape = <TData extends Record<string, any>>(filters: Record<string, Shape<TData>>) => filters

  export type InferShape<F extends Record<string, Shape<any>>> = Record<keyof F, string[]>

  export const filterData = <TData, TValue extends string, TName extends string>(
    d: Seq<TData>,
    shapes: Partial<Record<TName, Shape<TData, TValue>>>,
    filters: Record<TName, string[] | undefined>
  ): Seq<TData> => {
    return multipleFilters(d, Enum.entries(filters).filter(([k]) => shapes[k] !== undefined).map(([filterName, filterValue]) => {
      if (!filterValue || filterValue.length <= 0) return
      const shape = shapes[filterName]!
      if (shape.customFilter) return _ => shape.customFilter!(filterValue, _)
      if (!shape.getValue) throw new Error('Either getValue or customFilter should be defined for ' + filterName)
      if (shape.multiple)
        return _ => !!filterValue.find(f => shape.getValue!(_)?.includes(f as any))
      return _ => filterValue.includes(shape.getValue!(_) as any)
    })) as Seq<TData>
  }

  export const filterDataFromLokiJs = <TData extends object, TValue extends string, TName extends string>(
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



