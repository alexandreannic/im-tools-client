import {Checkbox} from '@mui/material'
import {fnSwitch} from '@alexandreannic/ts-utils'
import React from 'react'
import {SheetRow} from '@/shared/Sheet/Sheet'
import {SheetContext} from '@/shared/Sheet/context/SheetContext'

export const SheetBody = (() => {
  const Component = <T extends SheetRow>({
    data,
    select,
    columns,
    getRenderRowKey,
    selected,
  }: Pick<SheetContext<T>,
    'selected' |
    'select' |
    'columns' |
    'getRenderRowKey'
  > & {
    data: T[]
  }) => {
    return (
      <>
        {data.map((item, i) => (
          <tr
            className="tr"
            key={getRenderRowKey ? getRenderRowKey(item, i) : i}
            // onClick={e => onClickRows?.(item, e)}
          >
            {select && (
              <td className="td td-center td-sticky-start">
                <Checkbox size="small" checked={selected.has(select.getId(item))} onChange={() => selected.toggle(select.getId(item))}/>
              </td>
            )}
            {columns.map((_, i) => {
              const render = _.render(item, i)
              return (
                <td
                  title={_.tooltip !== null && (_.tooltip?.(item) ?? (render as any))}
                  key={i}
                  style={_.style}
                  onClick={_.onClick ? () => _.onClick?.(item) : undefined}
                  className={[
                    'td',
                    'td-clickable',
                    _.stickyEnd ? 'td-sticky-end' : '',
                    _.type === 'number' ? 'td-right' : '',
                    fnSwitch(_.align!, {
                      'center': 'td-center',
                      'right': 'td-right'
                    }, _ => '')
                  ].join(' ')}
                >
                  {render}
                </td>
              )
            })}
          </tr>
        ))}
      </>
    )
  }
  return React.memo(Component) as typeof Component
})()