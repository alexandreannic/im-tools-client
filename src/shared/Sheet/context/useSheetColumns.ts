import {KeyOf} from '@/utils/utils'
import {SheetColumnProps, SheetRow} from '@/shared/Sheet/util/sheetType'

export const useSheetColumns = <T extends SheetRow>({
  columnsIndex,
}: {
  columnsIndex: Record<KeyOf<T>, SheetColumnProps<T>>
}) => {

}