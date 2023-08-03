import {OrderBy, UseSetState} from '@alexandreannic/react-hooks-lib'
import {Dispatch, ReactNode, SetStateAction} from 'react'
import {SheetColumnProps, SheetRow, SheetTableProps} from '@/shared/Sheet/Sheet'
import {UseSheetData} from '@/shared/Sheet/context/useSheetData'
import {KeyOf} from '@/utils/utils'
import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {SheetFilterDialogProps} from '@/shared/Sheet/SheetFilterDialog'

export type SheetPropertyType = KoboQuestionType
// ,
  // 'date' |
  // 'select_one' |
  // 'select_multiple' |
  // 'text' |
  // 'integer' |
  // 'decimal'
// >

export interface SheetContext<T extends SheetRow> extends Pick<SheetTableProps<T>,
  'getRenderRowKey' |
  'select'
> {
  loading?: boolean
  columns: SheetColumnProps<T>[]
  columnsIndex: Record<KeyOf<T>, SheetColumnProps<T>>
  _data: UseSheetData
  _selected: UseSetState<string>
  search: SheetSearch<T>
  setSearch: Dispatch<SetStateAction<SheetSearch<T>>>
  filters: Record<KeyOf<T>, SheetFilter>
  setFilters: Dispatch<SetStateAction<Record<KeyOf<T>, SheetFilter>>>
}

export interface SheetOptions {
  value: string
  label: string
}

export interface SheetSearch<T = any> {
  limit: number
  offset: number
  sortBy?: string
  orderBy?: OrderBy
}

export type SheetFilter = string
  | string[]
  | [Date | undefined, Date | undefined]
  | [number | undefined, number | undefined]

export interface SheetPopoverParams<T = any> {
  anchorEl: HTMLElement
  columnId: string
  title: ReactNode
}

export interface SheetColumnConfigPopoverParams<T = any, TType = SheetPropertyType> extends SheetPopoverParams<T> {
  type: TType
  options?: NonNullable<SheetFilterDialogProps['options']>
}

// export interface SelectChartPopoverParams extends PopoverParams {
//   multiple?: boolean
// }