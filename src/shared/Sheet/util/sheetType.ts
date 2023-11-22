import React, {CSSProperties, ReactNode} from 'react'
import {BoxProps} from '@mui/material'
import {KeyOf, Utils} from '@/utils/utils'
import {NonNullableKeys} from '@/utils/utilsType'

export type SheetPropertyType = 'date' | 'number' | 'string' | 'select_one' | 'select_multiple'

export type OrderBy = 'asc' | 'desc'

export interface SheetOptions {
  value: string
  // label?: string
  label?: ReactNode
}

export interface SheetSearch<T = any> {
  limit: number
  offset: number
  sortBy?: string
  orderBy?: OrderBy
}

export type SheetRow = Record<string, any> // Record<string, any/* string | number[] | string[] | Date | number | undefined*/>
export interface SheetTableProps<T extends SheetRow> extends Omit<BoxProps, 'onSelect'> {
  header?: ReactNode | ((_: {
    data: T[]
    filteredData: T[]
    filteredAndSortedData: T[]
  }) => ReactNode)
  id: string
  loading?: boolean
  total?: number
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
  columns: SheetColumnProps<T>[]
  showColumnsToggle?: boolean
  hidePagination?: boolean
  showColumnsToggleBtnTooltip?: string
  showExportBtn?: boolean
  renderEmptyState?: ReactNode
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

interface SheetColumnPropsText<T extends SheetRow> {
  type?: Exclude<SheetPropertyType, 'date' | 'number' | 'select_multiple' | 'select_one'>
  renderValue?: (_: T) => string | number | undefined
}

type SheetColumnPropsSelectOne<T extends SheetRow> = {
  type?: 'select_one'
  renderValue?: (_: T) => string | undefined
  options?: () => SheetOptions[]
  renderOption?: (_: T) => ReactNode
}

type SheetColumnPropsSelectMultiple<T extends SheetRow> = {
  type?: 'select_multiple'
  renderValue?: (_: T) => string[] | undefined
  options?: () => SheetOptions[]
  renderOption?: (_: T) => ReactNode
}

interface SheetColumnPropsDate<T extends SheetRow> {
  type: 'date'
  renderValue?: (_: T) => Date | undefined
}

interface SheetColumnPropsNumber<T extends SheetRow> {
  type: 'number'
  renderValue?: (_: T) => number | undefined
}

interface SheetColumnPropsUndefined<T> {
  type?: undefined
  renderValue?: (_: T) => string | boolean | number | undefined
}

export type SheetColumnProps<T extends SheetRow> = SheetColumnPropsBase<T> & (
  SheetColumnPropsText<T> |
  SheetColumnPropsSelectOne<T> |
  SheetColumnPropsDate<T> |
  SheetColumnPropsNumber<T> |
  SheetColumnPropsSelectMultiple<T> |
  SheetColumnPropsUndefined<T>
  )

export interface SheetColumnPropsBase<T extends SheetRow> {
  // type?: SheetPropertyType//'number' | 'date' | 'string' | 'select_one' | 'select_multiple'
  // renderValue?: (_: T) => string | number | undefined
  // sx?: (_: T) => SxProps<Theme> | undefined
  // style?: CSSProperties
  id: string
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

export type SheetInnerColumnProps<T extends SheetRow> = Omit<SheetColumnProps<T>, 'renderValue' | 'type'> & (
  NonNullableKeys<SheetColumnPropsText<T>> |
  NonNullableKeys<SheetColumnPropsSelectOne<T>> |
  NonNullableKeys<SheetColumnPropsSelectMultiple<T>> |
  NonNullableKeys<SheetColumnPropsDate<T>> |
  NonNullableKeys<SheetColumnPropsNumber<T>> |
  SheetColumnPropsUndefined<T>
  )

export type SheetFilterValueString = {
  filterBlank?: boolean,
  value?: string
} | undefined
export type SheetFilterValueSelect = string[]
export type SheetFilterValueDate = [Date | undefined, Date | undefined]
export type SheetFilterValueNumber = [number | undefined, number | undefined]
export type SheetFilterValue = SheetFilterValueString | SheetFilterValueSelect | SheetFilterValueDate | SheetFilterValueNumber
export type SheetBlankValue = ''