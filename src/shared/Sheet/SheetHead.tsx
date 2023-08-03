import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {Box, Checkbox} from '@mui/material'
import React from 'react'
import {SheetColumnProps, SheetRow, useSheetContext} from '@/shared/Sheet/Sheet'
import {TableIcon, TableIconBtn, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'

export const SheetHeadContent = ({
  active,
  type,
  onOpenConfig,
  onOpenStats,
}: {
  type: SheetColumnProps<any>['type']
  onOpenConfig: (e: any) => void
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
        onClick={e => onOpenConfig(e)}
      />
    </span>
  )
}

export const SheetHead = <T extends SheetRow>({
  onOpenStats,
  onOpenColumnConfig,
}: {
  onOpenColumnConfig: (_: SheetColumnProps<T>, event: any) => void
  onOpenStats: (_: SheetColumnProps<T>, event: any) => void
}) => {
  const {
    _data,
    _selected,
    select,
    filters,
    columns,
    search
  } = useSheetContext()
  return (
    <thead>
    <tr className="tr trh">
      {map(select?.getId, getId => (
        <th className="td th td-center">
          <Checkbox
            size="small"
            checked={_selected.size === _data?.data?.length}
            indeterminate={_selected.size !== _data.data?.length && _selected.size !== 0}
            onChange={() => {
              if (!_data) return
              if (_selected.size === 0 && _data.data) _selected.add(_data.data.map(getId))
              else _selected.clear()
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
            // onClick={() => onSortBy(_.id)}
            className={'td th' + (active ? ' th-active' : '') + (fnSwitch(_.align!, {
              'center': ' td-center',
              'right': ' td-right'
            }, _ => ''))}
          >
            <div className="th-resize" style={{width: _.width}}>
              {_.head}
            </div>
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
              onOpenConfig={e => onOpenColumnConfig(q, e)}
            />
          </td>
        )
      })}
    </tr>
    </thead>
  )
}