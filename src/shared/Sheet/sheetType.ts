import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {ReactNode} from 'react'
import {SheetFilterDialogProps} from '@/shared/Sheet/SheetFilterDialog'

export type SheetPropertyType = 'date' | 'number' | 'string' | 'select_one' | 'select_multiple'

export interface SheetOptions {
  value?: string
  label?: string
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

export interface SheetPopoverParams {
  anchorEl: HTMLElement
  columnId: string
  title: string
}

export interface SheetColumnConfigPopoverParams extends SheetPopoverParams {
  type: SheetPropertyType
  options?: NonNullable<SheetFilterDialogProps['options']>
}
