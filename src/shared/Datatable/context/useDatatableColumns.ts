import {DatatableColumnProps, DatatableRow} from '@/shared/Datatable/util/datatableType'
import {KeyOf} from '@/core/type/generic'

export const useDatatableColumns = <T extends DatatableRow>({
  columnsIndex,
}: {
  columnsIndex: Record<KeyOf<T>, DatatableColumnProps<T>>
}) => {

}