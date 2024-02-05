import React, {CSSProperties, ReactNode} from 'react'
import {BoxProps} from '@mui/material'
import {NonNullableKeys} from '@/utils/utilsType'
import {KeyOf} from '@/core/type/generic'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'

export type DatatablePropertyType = 'date' | 'number' | 'string' | 'select_one' | 'select_multiple'

export type OrderBy = 'asc' | 'desc'

export interface DatatableOptions {
  value: string
  // label?: string
  // Should be string to filter options in filters popup
  label?: ReactNode
}

export interface DatatableSearch<T = any> {
  limit: number
  offset: number
  sortBy?: string
  orderBy?: OrderBy
}

export type DatatableRow = Record<string, any> // Record<string, any/* string | number[] | string[] | Date | number | undefined*/>
export interface DatatableTableProps<T extends DatatableRow, K extends string = string> extends Omit<BoxProps, 'onSelect'> {
  header?: ReactNode | ((_: {
    data: T[]
    filteredData: T[]
    filteredAndSortedData: T[]
  }) => ReactNode)
  id: string
  loading?: boolean
  total?: number
  defaultFilters?: Record<K, any>
  defaultLimit?: number
  title?: string
  readonly select?: {
    readonly onSelect: (_: string[]) => void
    readonly getId: (_: T) => string
    readonly selectActions?: ReactNode
  }
  readonly data?: T[]
  getRenderRowKey?: (_: T, index: number) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLElement>) => void
  rowsPerPageOptions?: number[]
  columns: DatatableColumnProps<T, K>[]
  showColumnsToggle?: boolean
  hidePagination?: boolean
  showColumnsToggleBtnTooltip?: string
  showExportBtn?: boolean
  renderEmptyState?: ReactNode
  onFiltersChange?: (_: Record<KeyOf<T>, DatatableFilterValue>) => void
  onDataChange?: (_: {
    data?: T[]
    filteredData?: T[]
    filteredAndSortedData?: T[]
    filteredSortedAndPaginatedData?: ApiPaginate<T>
  }) => void
  sort?: {
    sortableColumns?: string[]
    sortBy?: KeyOf<T>
    orderBy?: OrderBy
    onSortChange: (_: {
      sortBy?: KeyOf<T>;
      orderBy?: OrderBy
    }) => void
  }
}

interface DatatableColumnPropsText<T extends DatatableRow> {
  type?: Exclude<DatatablePropertyType, 'date' | 'number' | 'select_multiple' | 'select_one'>
  renderValue?: (_: T) => string | number | undefined
}

type DatatableColumnPropsSelectOne<T extends DatatableRow> = {
  type: 'select_one'
  renderValue?: (_: T) => string | undefined
  options?: () => DatatableOptions[]
  renderOption?: (_: T) => ReactNode
}

type DatatableColumnPropsSelectMultiple<T extends DatatableRow> = {
  type: 'select_multiple'
  renderValue?: (_: T) => string[] | undefined
  options?: () => DatatableOptions[]
  renderOption?: (_: T) => ReactNode
}

interface DatatableColumnPropsDate<T extends DatatableRow> {
  type: 'date'
  renderValue?: (_: T) => Date | undefined
}

interface DatatableColumnPropsNumber<T extends DatatableRow> {
  type: 'number'
  renderValue?: (_: T) => number | undefined
}

interface DatatableColumnPropsUndefined<T> {
  type?: undefined
  renderValue?: (_: T) => string | boolean | number | undefined
}

export type DatatableColumnProps<T extends DatatableRow, K extends string = string> = DatatableColumnPropsBase<T, K> & (
  DatatableColumnPropsText<T> |
  DatatableColumnPropsSelectOne<T> |
  DatatableColumnPropsDate<T> |
  DatatableColumnPropsNumber<T> |
  DatatableColumnPropsSelectMultiple<T> |
  DatatableColumnPropsUndefined<T>
  )

export interface DatatableColumnPropsBase<T extends DatatableRow, K extends string = string> {
  // type?: DatatablePropertyType//'number' | 'date' | 'string' | 'select_one' | 'select_multiple'
  // renderValue?: (_: T) => string | number | undefined
  // sx?: (_: T) => SxProps<Theme> | undefined
  // style?: CSSProperties
  id: K
  render: (_: T) => ReactNode
  noSort?: boolean
  width?: number
  head?: string
  align?: 'center' | 'right'
  onClick?: (_: T) => void
  renderExport?: boolean | ((_: T) => string | number | undefined | Date)
  hidden?: boolean
  alwaysVisible?: boolean
  tooltip?: null | ((_: T) => undefined | string)
  style?: (_: T) => CSSProperties
  styleHead?: CSSProperties
  typeIcon?: ReactNode
  className?: string | ((_: T) => string | undefined)
  stickyEnd?: boolean
}

export type DatatableInnerColumnProps<T extends DatatableRow> = Omit<DatatableColumnProps<T>, 'renderValue' | 'type'> & (
  NonNullableKeys<DatatableColumnPropsText<T>> |
  NonNullableKeys<DatatableColumnPropsSelectOne<T>> |
  NonNullableKeys<DatatableColumnPropsSelectMultiple<T>> |
  NonNullableKeys<DatatableColumnPropsDate<T>> |
  NonNullableKeys<DatatableColumnPropsNumber<T>> |
  DatatableColumnPropsUndefined<T>
  )

export type DatatableFilterValueString = {
  filterBlank?: boolean,
  value?: string
} | undefined
export type DatatableFilterValueSelect = string[]
export type DatatableFilterValueDate = [Date | undefined, Date | undefined]
export type DatatableFilterValueNumber = [number | undefined, number | undefined]
export type DatatableFilterValue = DatatableFilterValueString | DatatableFilterValueSelect | DatatableFilterValueDate | DatatableFilterValueNumber
export type DatatableBlankValue = ''

type SchemaItem = {
  id: string;
  type: string;
};

type FilterValue<T extends SchemaItem> = T['type'] extends 'string'
  ? string
  : T['type'] extends 'date'
    ? Date
    : never;

type Filters<T extends SchemaItem[]> = {
  [K in T[number]['id']]: any
};

type CallFnArgs<T extends SchemaItem[]> = {
  schema: T;
  filters: Filters<T>;
};

function callFn<T extends SchemaItem[]>(args: CallFnArgs<T>): void {
  // Your implementation here
}

// Example usage
callFn({
  schema: [{ id: 'first', type: 'string' }, { id: 'second', type: 'date' }],
  filters: { xxx: 'test', second: new Date() },
});