import {DatatableBlankValue, DatatableColumnProps, DatatableOptions, DatatableRow} from '@/shared/Datatable/util/datatableType'
import React, {ReactNode} from 'react'

export class DatatableUtils {

  static readonly localStorageKey = {
    column: 'database-columns-',
    filters: 'datatable-filters-',
  }
  // static readonly FILTER_BLANK_TEXT = 'FILTER_BLANK_TEXT_someRandomTextToAvoidCollision_9fa3'
  static readonly buildColumns = <T extends DatatableRow = DatatableRow>(_: DatatableColumnProps<T>[]) => _

  static readonly blank: DatatableBlankValue = ''
  static readonly blankLabel = <i>BLANK</i>
  static readonly blankOption: DatatableOptions = {value: DatatableUtils.blank, label: DatatableUtils.blankLabel}

  static readonly buildOptions = (opt: string[], addBlank?: boolean): DatatableOptions[] => {
    return [
      ...(addBlank ? [DatatableUtils.blankOption] : []),
      ...opt.map(DatatableUtils.buildOption),
    ]
  }

  static readonly buildOption = (_: string): DatatableOptions => {
    return {value: _, label: _}
  }

  static readonly buildCustomOption = (_: string, label?: ReactNode): DatatableOptions => {
    return {value: _, label: label ?? _}
  }

  /** @deprecated*/
  static readonly getValueGetter = <T extends DatatableRow>(col: Pick<DatatableColumnProps<T>, 'render' | 'renderValue'>, colName: string): (_: T, i?: number) => any => {
    return col.renderValue ?? col.render as any ?? ((_: T, i: number) => _[colName])
  }
}

type SchemaItem = Readonly<{
  readonly id: string;
  readonly type: string;
}>

type FilterValue<T extends SchemaItem> = T['type'] extends 'string'
  ? string
  : T['type'] extends 'date'
    ? Date
    : never;

// type Filters<T extends SchemaItem> = {

type CallFnArgs<T extends SchemaItem[]> = {
  readonly schema: Readonly<{
    readonly id: string;
    readonly type: string;
  }>;
  readonly filters: {
    [K in T[number]['id']]: any
  };
};

// function callFn<T extends SchemaItem[]>(args: CallFnArgs<T>): void {
// }
//
// // Example usage
// callFn({
//   schema: [{id: 'first', type: 'string'}, {id: 'second', type: 'date'}],
//   filters: {jj: 'test', xxx: new Date(),},
// })
//
// const x = {
//   schema: [{id: 'first', type: 'string'}, {id: 'second', type: 'date'}]
// } as const
//
// const fn: { [K in (typeof x)[number]['id']]: string } = {'first': 'a'}








