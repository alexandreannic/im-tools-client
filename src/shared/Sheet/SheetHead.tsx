import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {Box, Checkbox} from '@mui/material'
import React from 'react'
import {SheetColumnProps, SheetRow} from '@/shared/Sheet/Sheet'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {SheetContext} from '@/shared/Sheet/context/SheetContext'

export const SheetHead = (() => {
  const Component = <T extends SheetRow>({
    onOpenStats,
    data,
    selected,
    select,
    columns,
    filters,
    search,
    onOpenFilter,
  }: {
    onOpenFilter: (_: SheetColumnProps<T>, event: any) => void
    onOpenStats: (_: SheetColumnProps<T>, event: any) => void
  } & Pick<SheetContext<T>, 'selected' | 'columns' | 'columnsIndex' | 'select'> & {
    data?: T[]
    search: SheetContext<T>['data']['search']
    filters: SheetContext<T>['data']['filters']
  }) => {
    return (
      <thead>
      <tr className="tr trh">
        {map(select?.getId, getId => (
          <th className="td th td-center">
            <Checkbox
              size="small"
              checked={selected.size === data?.length}
              indeterminate={selected.size !== data?.length && selected.size !== 0}
              onChange={() => {
                if (!data) return
                // @ts-ignore
                if (selected.size === 0 && data) selected.add(data.map(getId))
                else selected.clear()
              }}
            />
          </th>
        ))}
        {columns.map((_, i) => {
          const sortedByThis = search?.sortBy === _.id ?? true
          const active = sortedByThis || filters[_.id]
          return (
            <th
              key={_.id}
              title={_.head}
              // onClick={() => onSortBy(_.id)}
              className={'td th' + (active ? ' th-active' : '') + (fnSwitch(_.align!, {
                'center': ' td-center',
                'right': ' td-right'
              }, _ => ''))}
            >
              <Box className="th-resize" style={{width: _.width}}>
                {_.head}
              </Box>
            </th>
          )
        })}
      </tr>
      <tr>
        {columns.map(c => {
          const sortedByThis = search.sortBy === c.id ?? false
          const active = sortedByThis || !!filters[c.id]
          return (
            <td key={c.id} className="td-sub-head">
              <SheetHeadContent
                column={c}
                active={active}
                onOpenStats={e => onOpenStats(c, e)}
                onOpenFilter={e => onOpenFilter(c, e)}
              />
            </td>
          )
        })}
      </tr>
      </thead>
    )
  }
  return React.memo(Component) as typeof Component
})()

export const SheetHeadTypeIcon = (props: {
  tooltip: string,
  children: string,
}) => {
  return <TableIcon sx={{marginRight: 'auto'}} fontSize="small" color="disabled" {...props}/>
}

export const SheetHeadContent = ({
  active,
  column,
  onOpenFilter,
  onOpenStats,
}: {
  column: SheetColumnProps<any>
  onOpenFilter: (e: any) => void
  onOpenStats: (e: any) => void
  active?: boolean
}) => {
  return (
    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
      {(() => {
        if (column.typeIcon) return column.typeIcon
        switch (column.type) {
          case 'date':
            return <SheetHeadTypeIcon children="event" tooltip={column.type}/>
          case 'select_multiple':
            return <SheetHeadTypeIcon children="check_box" tooltip={column.type}/>
          case 'select_one':
            return <SheetHeadTypeIcon children="radio_button_checked" tooltip={column.type}/>
          case 'number':
            return <SheetHeadTypeIcon children="tag" tooltip={column.type}/>
          case 'string':
            return <SheetHeadTypeIcon children="short_text" tooltip={column.type}/>
          default:
            return column.type
        }
      })()}
      {(column.options || ['date', 'number'].includes(column.type!)) && (
        <TableIconBtn children="bar_chart" onClick={e => onOpenStats(e)}/>
      )}
      {column.type && (
        <TableIconBtn
          color={active ? 'primary' : undefined}
          children="filter_alt"
          onClick={e => onOpenFilter(e)}
        />
      )}
    </span>
  )
}
