import {SheetColumnProps, SheetRow} from '@/shared/Sheet/util/sheetType'
import {KeyOf} from '@/core/type/generic'

export const useSheetColumns = <T extends SheetRow>({
  columnsIndex,
}: {
  columnsIndex: Record<KeyOf<T>, SheetColumnProps<T>>
}) => {

}