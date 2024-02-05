import {DatatableInnerColumnProps, DatatableOptions, DatatableRow} from '@/shared/Datatable/util/datatableType'
import {useCallback, useEffect, useMemo} from 'react'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {seq} from '@alexandreannic/ts-utils'
import {UseDatatableData} from '@/shared/Datatable/context/useDatatableData'

import {KeyOf} from '@/core/type/generic'

export type UseDatatableOptions<T extends DatatableRow> = ReturnType<typeof useDatatableOptions<T>>

const optionsRef = new Map<string, DatatableOptions[] | undefined>()

export const useDatatableOptions = <T extends DatatableRow>({
  data,
  columns,
  columnsIndex,
}: {
  data: UseDatatableData<T>
  columns: DatatableInnerColumnProps<any>[],
  columnsIndex: Record<KeyOf<T>, DatatableInnerColumnProps<any>>
}) => {

  const automaticOptionColumns = useMemo(() => columns.filter(_ =>
    (_.type === 'select_multiple' || _.type === 'select_one') && _.options === undefined
  ), [columns])

  useEffect(function resetAutomaticRef() {
    automaticOptionColumns.forEach(c => {
      optionsRef.delete(c.id)
    })
  }, [data.filteredData])

  return useCallback((columnId: KeyOf<T>) => {
    if (!optionsRef.has(columnId)) {
      const col = columnsIndex[columnId]
      if ((col.type === 'select_one' || col.type === 'select_multiple') && col.options) {
        optionsRef.set(columnId, col.options())
      } else {
        if (col.type === 'select_one') {
          optionsRef.set(columnId, seq(data.filterExceptBy(columnId))
            ?.distinct(_ => col.renderValue(_))
            .sort((a, b) => (col.renderValue(b) ?? '').localeCompare(col.renderValue(a) ?? ''))
            .map(_ => DatatableUtils.buildCustomOption(
              col.renderValue(_) as string,
              col.renderOption(_) as string,
            )))
        } else if (col.type === 'select_multiple') {
          optionsRef.set(columnId, seq(data.filterExceptBy(columnId))
            ?.flatMap(_ => col.renderValue(_))
            .distinct(_ => _)
            .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
            .map(_ => _ ? DatatableUtils.buildCustomOption(_, col.renderOption!(_) as string) : DatatableUtils.blankOption)
          )
        }
      }
    }
    return optionsRef.get(columnId)
  }, [data.filteredData, data.filters, columns])
}