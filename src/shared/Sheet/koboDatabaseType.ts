import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {SheetFilterDialogProps} from '@/shared/Sheet/SheetFilterDialog'

export namespace KoboDatabaseType {
  export interface Search {
    limit: number
    offset: number
    sortBy: keyof KoboAnswer
    orderBy: OrderBy
  }


  export type Filter = string
    | string[]
    | [Date | undefined, Date | undefined]
    | [number | undefined, number | undefined]

  export interface PopoverParams {
    anchorEl: HTMLElement
    columnId: string
  }

  export interface ColumnConfigPopoverParams extends PopoverParams {
    type: SheetFilterDialogProps['type']
    options?: NonNullable<SheetFilterDialogProps['options']>
  }

  export interface SelectChartPopoverParams extends PopoverParams {
    multiple?: boolean
  }
}
