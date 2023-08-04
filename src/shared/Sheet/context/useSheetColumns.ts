import {SheetColumnProps, SheetRow} from '@/shared/Sheet/Sheet'
import {KeyOf} from '@/utils/utils'

export const useSheetColumns = <T extends SheetRow>({
  columnsIndex,
}: {
  columnsIndex: Record<KeyOf<T>, SheetColumnProps<T>>
}) => {

}