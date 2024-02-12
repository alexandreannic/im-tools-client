import {Checkbox} from '@mui/material'
import {fnSwitch} from '@alexandreannic/ts-utils'
import React from 'react'
import {DatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatatableRow, DatatableTableProps} from '@/shared/Datatable/util/datatableType'

export const DatatableBody = (() => {
  const Component = <T extends DatatableRow>({
    data,
    select,
    columns,
    getRenderRowKey,
    selected,
    onClickRows,
  }: Pick<DatatableTableProps<any>, 'onClickRows'> & Pick<DatatableContext<T>,
    'selected' |
    'select' |
    'columns' |
    'getRenderRowKey'
  > & {
    data: T[]
  }) => {
    return (
      <>
        {data.map((item, rowI) => (
          <tr
            className={'tr' + (onClickRows ? ' tr-clickable' : '')}
            key={getRenderRowKey ? getRenderRowKey(item, rowI) : rowI}
            onClick={e => onClickRows?.(item, e)}
          >
            {select && (
              <td className="td td-center td-sticky-start">
                <Checkbox size="small" checked={selected.has(select.getId(item))} onChange={() => selected.toggle(select.getId(item))}/>
              </td>
            )}
            {columns.map((_, i) => {
              const render = _.render(item)
              return (
                <td
                  title={render.tooltip as any}
                  key={i}
                  style={_.style?.(item)}
                  onClick={_.onClick ? () => _.onClick?.(item) : undefined}
                  className={[
                    'td',
                    _.stickyEnd ? 'td-sticky-end' : '',
                    _.type === 'number' ? 'td-right' : '',
                    fnSwitch(_.align!, {
                      'center': 'td-center',
                      'right': 'td-right'
                    }, _ => '')
                  ].join(' ')}
                >
                  {JSON.stringify(render.label)}
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