import {Checkbox} from '@mui/material'
import {fnSwitch} from '@alexandreannic/ts-utils'
import React from 'react'
import {SheetRow, useSheetContext} from '@/shared/Sheet/Sheet'

export const SheetBody = (() => {
  const Component = <T extends SheetRow>({}: {}) => {
    const {
      loading,
      _data,
      select,
      columns,
      getRenderRowKey,
      _selected,
    } = useSheetContext()

    return (
      <>
        {_data.filteredSortedAndPaginatedData?.data.map((item, i) => (
          <tr
            className="tr"
            key={getRenderRowKey ? getRenderRowKey(item, i) : i}
            // onClick={e => onClickRows?.(item, e)}
          >
            {select && (
              <td className="td td-center">
                <Checkbox size="small" checked={_selected.has(select.getId(item))} onChange={() => _selected.toggle(select.getId(item))}/>
              </td>
            )}
            {columns.map((_, i) => (
              <td
                title={_.tooltip?.(item) ?? _.render(item) as any}
                key={i}
                onClick={_.onClick ? () => _.onClick?.(item) : undefined}
                className={'td td-clickable ' + fnSwitch(_.align!, {
                  'center': 'td-center',
                  'right': 'td-right'
                }, _ => '')}
              >
                {_.render(item)}
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  }
  return React.memo(Component) as typeof Component
})()