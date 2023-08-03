import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {Box, Checkbox} from '@mui/material'
import React, {useEffect} from 'react'
import {SheetColumnProps, SheetRow} from '@/shared/Sheet/Sheet'
import {TableIcon, TableIconBtn, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'
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
              style={{width: _.width}}
              // onClick={() => onSortBy(_.id)}
              className={'td th' + (active ? ' th-active' : '') + (fnSwitch(_.align!, {
                'center': ' td-center',
                'right': ' td-right'
              }, _ => ''))}
            >
              <Box className="th-resize">
                {_.head}
              </Box>
            </th>
          )
        })}
      </tr>
      <tr>
        {columns.map(q => {
          const sortedByThis = search.sortBy === q.id ?? false
          const active = sortedByThis || !!filters[q.id]
          return (
            <td key={q.id} className="td-right">
              <SheetHeadContent
                type={q.type}
                active={active}
                onOpenStats={e => onOpenStats(q, e)}
                onOpenFilter={e => onOpenFilter(q, e)}
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

export const SheetHeadContent = ({
  active,
  type,
  onOpenFilter,
  onOpenStats,
}: {
  type: SheetColumnProps<any>['type']
  onOpenFilter: (e: any) => void
  onOpenStats: (e: any) => void
  active?: boolean
}) => {
  const commonProps: Partial<TableIconProps> = {
    color: 'disabled',
    sx: {marginRight: 'auto'},
    tooltip: type
  }
  return (
    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
      {(() => {
        switch (type) {
          case 'start':
          case 'end':
          case 'date':
            return <TableIcon icon="event" {...commonProps}/>

          case 'select_multiple': {
            return <TableIcon icon="check_box" {...commonProps}/>
          }
          case 'select_one': {
            return <TableIcon icon="radio_button_checked" {...commonProps}/>
          }
          case 'decimal':
          case 'integer': {
            return <TableIcon icon="tag" {...commonProps}/>
          }
          case 'calculate': {
            return <TableIcon icon="functions" {...commonProps}/>
          }
          case 'begin_repeat': {
            return <TableIcon icon="repeat" {...commonProps}/>
          }
          case 'select_one_from_file': {
            return <TableIcon icon="attach_file" {...commonProps}/>
          }
          case 'image': {
            return <TableIcon icon="image" {...commonProps}/>
          }
          case 'text': {
            return <TableIcon icon="short_text" {...commonProps}/>
          }
          case 'geopoint': {
            return <TableIcon icon="location_on" {...commonProps}/>
          }
          case 'note': {
            return <TableIcon icon="info" {...commonProps}/>
          }
          default: {
            return type
          }
        }
      })()}
      {type && ['calculate', 'integer', 'decimal', 'select_multiple', 'select_one', 'start', 'end', 'date',].includes(type) && (
        <TableIconBtn icon="bar_chart" onClick={e => onOpenStats(e)}/>
      )}
      <TableIconBtn
        color={active ? 'primary' : undefined}
        icon="filter_alt"
        onClick={e => onOpenFilter(e)}
      />
    </span>
  )
}
