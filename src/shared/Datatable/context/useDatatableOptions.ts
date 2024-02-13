import {DatatableColumn, DatatableOptions, DatatableRow} from '@/shared/Datatable/util/datatableType'
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
  columns: DatatableColumn.InnerProps<any>[],
  columnsIndex: Record<KeyOf<T>, DatatableColumn.InnerProps<any>>
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
            ?.distinct(_ => col.render(_).value)
            .sort((a, b) => (col.render(b).value ?? '').localeCompare(col.render(a).value ?? ''))
            .map(_ => DatatableUtils.buildCustomOption(
              col.render(_).value as string,
              col.render(_).option as string,
            )))
        } else if (col.type === 'select_multiple') {
          optionsRef.set(columnId, seq(data.filterExceptBy(columnId))
            ?.flatMap(_ => col.render(_).value)
            .distinct(_ => _)
            .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
            .map(_ => _ ? DatatableUtils.buildCustomOption(_, col.render(_).option as string) : DatatableUtils.blankOption)
          )
        }
      }
    }
    return optionsRef.get(columnId)
  }, [data.filteredData, data.filters, columns])
}