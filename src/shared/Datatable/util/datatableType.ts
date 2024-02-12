import React, {CSSProperties, ReactNode} from 'react'
import {BoxProps} from '@mui/material'
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
  columns: DatatableColumn.Props<T, K>[]
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

export namespace DatatableColumn {

  export type Value = string[] | string | undefined | Date | number | null | boolean

  export type RenderT<T extends Value, TOption = any> = {
    label: ReactNode
    option?: TOption
    value: T
    tooltip?: string | undefined | null
    export?: null | string | number | undefined | Date
  }

  export interface Base<T extends DatatableRow, K extends string = string> {
    id: K
    noSort?: boolean
    width?: number
    head?: string
    align?: 'center' | 'right'
    onClick?: (_: T) => void
    hidden?: boolean
    alwaysVisible?: boolean
    style?: (_: T) => CSSProperties
    styleHead?: CSSProperties
    typeIcon?: ReactNode
    className?: string | ((_: T) => string | undefined)
    stickyEnd?: boolean
  }

  export namespace SelectOne {
    export type RenderShort<T extends DatatableRow> = (_: T) => string | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<string | undefined, ReactNode>
    export type InnerType<T extends DatatableRow> = {
      type: 'select_one'
      options?: () => DatatableOptions[]
      render: Render<T>
    }
    export type Type<T extends DatatableRow> = {
      type: 'select_one'
      options?: () => DatatableOptions[]
    } & ({
      renderQuick: Render<T>
    } | {
      render: RenderShort<T>
    })
  }

  export namespace SelectMultiple {
    export type RenderShort<T extends DatatableRow> = (_: T) => string[]
    export type Render<T extends DatatableRow> = (_: T) => RenderT<string[], ReactNode>
    export type InnerType<T extends DatatableRow> = {
      type: 'select_multiple'
      render: Render<T>
      options?: () => DatatableOptions[]
    }
    export type Type<T extends DatatableRow> = {
      type: 'select_multiple'
      options?: () => DatatableOptions[]
    } & ({
      renderQuick: Render<T>
    } | {
      render: RenderShort<T>
    })
  }

  export namespace Undefined {
    export type RenderShort<T extends DatatableRow> = (_: T) => ReactNode
    export type InnerType<T extends DatatableRow> = {
      type?: undefined
      render: (_: T) => RenderT<undefined>
    }
    export type Type<T extends DatatableRow> = {
      type?: undefined
      render: RenderShort<T>
    }
  }

  export namespace Text {
    export type RenderShort<T extends DatatableRow> = (_: T) => string | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<string | undefined>
    export type InnerType<T extends DatatableRow> = {
      type?: 'string'
      render: Render<T>
    }
    export type Type<T extends DatatableRow> = {
      type?: 'string'
    } & ({
      renderQuick: Render<T>
    } | {
      render: RenderShort<T>
    })
  }

  export namespace Date {
    export type RenderShort<T extends DatatableRow> = (_: T) => string | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<Date | undefined>
    export type InnerType<T extends DatatableRow> = {
      type: 'date'
      render: Render<T>
    }
    export type Type<T extends DatatableRow> = {
      type: 'date'
    } & ({
      renderQuick: Render<T>
    } | {
      render: RenderShort<T>
    })
  }

  export namespace Number {
    export type RenderShort<T extends DatatableRow> = (_: T) => number | undefined
    export type InnerType<T extends DatatableRow> = {
      type: 'number'
      render: (_: T) => RenderT<number | undefined>
    }
    export type Type<T extends DatatableRow> = {
      type: 'number'
    } & ({
      renderQuick: RenderShort<T>
    } | {
      render: RenderShort<T>
    })
  }

  export type InnerProps<T extends DatatableRow, K extends string = string> = Base<T, K> & (
    Text.InnerType<T> |
    SelectOne.InnerType<T> |
    Date.InnerType<T> |
    Number.InnerType<T> |
    SelectMultiple.InnerType<T> |
    Undefined.InnerType<T>
    )
  export type Props<T extends DatatableRow, K extends string = string> = Base<T, K> & (
    Text.Type<T> |
    SelectOne.Type<T> |
    Date.Type<T> |
    Number.Type<T> |
    SelectMultiple.Type<T> |
    Undefined.Type<T>
    )

  export const isQuick = (_: Props<any>): _ is InnerProps<any> => {
    return !!(_ as any).renderQuick
  }
}


export type DatatableFilterValueString = {
  filterBlank?: boolean,
  value?: string
} | undefined
export type DatatableFilterValueSelect = string[]
export type DatatableFilterValueDate = [Date | undefined, Date | undefined]
export type DatatableFilterValueNumber = [number | undefined, number | undefined]
export type DatatableFilterValue = DatatableFilterValueString | DatatableFilterValueSelect | DatatableFilterValueDate | DatatableFilterValueNumber
export type DatatableBlankValue = ''

// type SchemaItem = {
//   id: string;
//   type: string;
// };
//
// type FilterValue<T extends SchemaItem> = T['type'] extends 'string'
//   ? string
//   : T['type'] extends 'date'
//     ? Date
//     : never;
//
// type Filters<T extends SchemaItem[]> = {
//   [K in T[number]['id']]: any
// };
//
// type CallFnArgs<T extends SchemaItem[]> = {
//   schema: T;
//   filters: Filters<T>;
// };
//
// function callFn<T extends SchemaItem[]>(args: CallFnArgs<T>): void {
//   // Your implementation here
// }
//
// // Example usage
// callFn({
//   schema: [{ id: 'first', type: 'string' }, { id: 'second', type: 'date' }],
//   filters: { xxx: 'test', second: new Date() },
// });