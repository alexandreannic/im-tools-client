import {Box, BoxProps, Checkbox, Icon, LinearProgress, SxProps, TablePagination, Theme,} from '@mui/material'
import React, {ReactNode, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Fender, IconBtn} from 'mui-extension'
import {usePersistentState} from 'react-persistent-state'
import {multipleFilters, paginateData, Utils} from '../../utils/utils'
import {SheetFilterDialog} from './SheetFilterDialog'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {AAIconBtn} from '../IconBtn'
import {useAsync, useSetState} from '@alexandreannic/react-hooks-lib'
import {orderBy} from 'lodash'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {koboDatabaseStyle} from '@/shared/Sheet/SheetStyle'
import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {MultipleChoicesPopover, NumberChoicesPopover, SheetIcon} from '@/features/Database/DatabaseSubHeader'
import {SheetSelectToolbar} from '@/shared/Sheet/SheetSelectToolbar'

type OrderBy = 'asc' | 'desc'

type Answer = Record<string, any/* string | number[] | string[] | Date | number | undefined*/>

export interface SheetTableProps<T extends Answer> extends BoxProps {
  header?: ReactNode
  loading?: boolean
  total?: number
  title?: string
  select?: {
    selectActions?: ReactNode
    getId: (_: T) => string
    onSelect: (_: string[]) => void
  },
  readonly data?: T[]
  getRenderRowKey?: (_: T, index: number) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLElement>) => void
  rowsPerPageOptions?: number[]
  columns: SheetColumnProps<T>[]
  showColumnsToggle?: boolean
  showColumnsToggleBtnTooltip?: string
  renderEmptyState?: ReactNode
  sort?: {
    sortableColumns?: string[]
    sortBy?: keyof T
    orderBy?: OrderBy
    onSortChange: (_: {sortBy?: keyof T; orderBy?: OrderBy}) => void
  }
}

// namespace ColumnType {
//   interface Type {
//     type: KoboQuestionType
//   }
//
//   export interface Date extends Type {
//     type: 'date'
//     min?: Date
//     max?: Date
//   }
//
//   export interface SelectMultiple extends Type {
//     type: 'select_multiple'
//     options: string[]
//   }
//
//   export interface SelectOne extends Type {
//     type: 'select_one'
//     options: string[]
//   }
//
//   export interface Text extends Type {
//     type: 'text',
//   }
//
//   export interface Integer extends Type {
//     type: 'integer',
//   }
//
//   export interface Calculate extends Type {
//     type: 'calculate',
//   }
//
//   // type = {
//
//   // }
// }
// type ColumnTypes = ColumnType.Date |
//   ColumnType.SelectMultiple |
//   ColumnType.SelectOne |
//   ColumnType.Integer |
//   ColumnType.String

export interface SheetColumnProps<T extends Answer> {
  id: string
  noSort?: boolean
  head?: string | ReactNode
  // subHead?: (filteredData: T[]) => string | ReactNode
  align?: 'center' | 'right'
  onClick?: (_: T) => void
  render: (_: T) => ReactNode
  renderExport?: (_: T) => string | number | undefined | Date
  hidden?: boolean
  alwaysVisible?: boolean
  tooltip?: (_: T) => string
  type?: KoboQuestionType
  className?: string | ((_: T) => string | undefined)
  // sx?: (_: T) => SxProps<Theme> | undefined
  // style?: CSSProperties
  stickyEnd?: boolean
  number?: boolean
}

const sxStickyEnd: SxProps<Theme> = {
  paddingTop: '1px',
  position: 'sticky',
  right: 0,
  background: t => t.palette.background.paper,
}

type Filter = string
  | string[]
  | [Date | undefined, Date | undefined]
  | [number | undefined, number | undefined]

/** @deprecated*/
const checkFilterType = (() => {
  const isForDate = (f: Filter): f is [Date | undefined, Date | undefined] => {
    return Array.isArray(f) && (f[0] instanceof Date)
  }
  const isNumber = (f: Filter): f is [number | undefined, number | undefined] => {
    return Array.isArray(f) && (typeof f[0] === 'number')
  }
  const isForMultipleChoices = (f: Filter): f is string[] => {
    return Array.isArray(f) && ((typeof f[0] === 'string') || f.length === 0)
  }
  const isString = (f: Filter): f is string => {
    return (typeof f === 'string')
  }
  return {
    isNumber,
    isForDate,
    isForMultipleChoices,
    isString
  }
})()

export const Sheet = <T extends Answer = Answer>({
  id,
  loading,
  total,
  data,
  title,
  columns,
  getRenderRowKey,
  header,
  showColumnsToggle,
  showColumnsToggleBtnTooltip,
  renderEmptyState,
  rowsPerPageOptions = [20, 100, 500, 1000],
  sort,
  onClickRows,
  select,
  ...props
}: SheetTableProps<T>) => {
  const _generateXLSFromArray = useAsync(generateXLSFromArray)
  const {m} = useI18n()
  const [sheetSearch, setSheetSearch] = useState({
    limit: 20,
    offset: 0,
    sortBy: sort?.sortBy,
    orderBy: sort?.orderBy,
  })

  const _selected = useSetState<string>()
  useMemo(() => select?.onSelect(_selected.toArray), [_selected.get])

  const [openIntegerChartDialog, setOpenIntegerChartDialog] = useState<{
    anchorEl: HTMLElement
    columnId: string
  } | undefined>()
  const [openSelectChartDialog, setOpenSelectChartDialog] = useState<{
    anchorEl: HTMLElement
    columnId: string
    multiple?: boolean
  } | undefined>()
  const [openColumnConfig, setOpenColumnConfig] = useState<{
    anchorEl: HTMLElement
    columnId: string
  } | undefined>()

  // const [filteringProperty, setFilteringProperty] = useState<keyof T | undefined>(undefined)
  const [filters, setFilters] = useState<Record<keyof T, Filter>>({} as any)
  const displayableColumns: SheetColumnProps<T>[] = useMemo(() => {
    return columns.filter(_ => !_.hidden)
  }, [columns])

  const propertyTypes = useMemo(() => {
    const types = {} as Record<keyof T, SheetColumnProps<any>['type']>
    columns.forEach(_ => {
      types[_.id as keyof T] = _.type
    })
    return types
  }, [columns])
  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>([], id)
  const filteredColumns = useMemo(() => displayableColumns.filter(_ => !hiddenColumns.includes(_.id)), [columns, hiddenColumns])

  const onOrderBy = (columnId: keyof T, orderBy?: OrderBy) => {
    setSheetSearch(prev => ({...prev, orderBy, sortBy: columnId}))
  }

  // const columnTypeIndex = useMemo(() => {
  //   return Arr(columns).reduceObject<Record<string, ColumnType>>(_ => [_.id, _.type])
  // }, [columns])

  const filteredData = useMemo(() => {
    if (!data) return
    return multipleFilters(data, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (!filter || filter.length === 0) return undefined
      // if (Array.isArray(columnTypeIndex[k])) {
      //   return row => {
      //     const v = row[k]
      //     if (!v) return false
      //     if (Array.isArray(v)) return !!(v as string[]).find(_ => filter.includes(_))
      //     if (typeof v !== 'string') throw new Error(`Value of ${String(k)} is ${v} but string expected.`)
      //     return filter.includes(v)
      //   }
      // }
      if (checkFilterType.isNumber(filter)) {
        return row => {
          const v = row[k]
          if (!v) return false
          if (typeof v !== 'number') throw new Error(`Value of ${String(k)} is ${v} but number expected.`)
          const [min, max] = filter
          return (!min || v >= min) && (!max || v <= max)
        }
      }
      if (checkFilterType.isForMultipleChoices(filter)) {

      }
      if (checkFilterType.isForDate(filter)) {
        return row => {
          const v = row[k]
          if (!v) return false
          if (!((v as any) instanceof Date)) throw new Error(`Value of ${String(k)} is ${v} but Date expected.`)
          const [min, max] = filter
          return (!min || v.getTime() >= min.getTime()) && (!max || v.getTime() <= max.getTime())
        }
      }
      if (checkFilterType.isString(filter)) {
        return row => {
          const v = row[k]
          if (!v) return false
          if (typeof v !== 'string') throw new Error(`Value of ${String(k)} is ${v} but expected string.`)
          return v.includes(filter)
        }
      }
      throw new Error(`Unhandled type for ${String(k)}`)
    }))
  }, [data, filters])

  const filteredAndSortedData = useMemo(() => {
    if (!filteredData) return
    return orderBy(filteredData, sheetSearch.sortBy, sheetSearch.orderBy)
  }, [filteredData, sheetSearch.sortBy, sheetSearch.orderBy])

  const filteredSortedAndPaginatedData = useMemo(() => {
    if (!filteredAndSortedData) return
    return paginateData<T>(sheetSearch.limit, sheetSearch.offset)(filteredAndSortedData)
  }, [sheetSearch.limit, sheetSearch.offset, filteredAndSortedData])

  const exportToCSV = () => {
    if (filteredAndSortedData) {
      _generateXLSFromArray.call({
        filename: Utils.slugify(title) ?? 'noname',
        data: filteredAndSortedData,
        schema: columns
          .filter(_ => _.renderExport)
          .map(_ => ({name: _.head as string ?? _.id, render: _.renderExport ? _.renderExport : () => ''})),
      })
    }
  }

  return (
    <>
      <Box sx={{position: 'relative', p: 2}}>
        {header}
        <AAIconBtn loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
        {_selected.size > 0 && (
          <SheetSelectToolbar>
            <Box sx={{flex: 1,}}>
              {_selected.size} {m.selected}.
            </Box>
            {select?.selectActions}
            <AAIconBtn color="primary" icon="clear" onClick={_selected.clear}/>
          </SheetSelectToolbar>
        )}
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={{
          // width: 'max-content'
        }}>
          {koboDatabaseStyle}
          <Box component="table" {...props} className="table" sx={{minWidth: '100%'}}>
            <thead>
            <tr className="tr trh">
              {map(select?.getId, getId => (
                <th className="td th td-center">
                  <Checkbox
                    size="small"
                    checked={_selected.size === data?.length}
                    indeterminate={_selected.size !== data?.length && _selected.size !== 0}
                    onChange={() => {
                      if (!data) return
                      if (_selected.size === 0) _selected.add(data.map(getId))
                      else _selected.clear()
                    }}
                  />
                </th>
              ))}
              {filteredColumns.map((_, i) =>
                <th
                  key={_.id}
                  className={'td th' + (fnSwitch(_.align!, {
                    'center': ' td-center',
                    'right': ' td-right'
                  }, _ => ''))}
                >
                  {_.head}
                </th>
              )}
            </tr>
            </thead>
            <tbody>
            <tr className="tr">
              {filteredColumns.map((_, i) => {
                const sortedByThis = sort?.sortBy === _.id ?? true
                const active = sortedByThis || filters[_.id]
                return (
                  <td key={_.id} className="td">
                    {fnSwitch(_.type!, {
                      date: type => (
                        <>
                          <SheetIcon icon="event" tooltip={type} disabled/>
                        </>
                      ),
                      integer: type => (
                        <>
                          <SheetIcon icon="tag" tooltip={type} disabled/>
                          <SheetIcon icon="bar_chart" onClick={e => {
                            setOpenIntegerChartDialog({
                              anchorEl: e.currentTarget,
                              columnId: _.id,
                            })
                          }}/>
                        </>
                      ),
                      select_multiple: type => (
                        <>
                          <SheetIcon icon="check_box" tooltip={type} disabled/>
                          <SheetIcon icon="bar_chart" onClick={e => {
                            setOpenSelectChartDialog({
                              anchorEl: e.currentTarget,
                              columnId: _.id,
                              multiple: true,
                            })
                          }}/>
                        </>
                      ),
                      select_one: type => (
                        <>
                          <SheetIcon icon="radio_button_checked" tooltip={type} disabled/>
                          <SheetIcon icon="bar_chart" onClick={e => {
                            setOpenSelectChartDialog({
                              anchorEl: e.currentTarget,
                              columnId: _.id,
                              multiple: false,
                            })
                          }}/>
                        </>
                      ),
                    }, () => <></>)}
                    <SheetIcon color={active ? 'primary' : undefined} icon="keyboard_arrow_down" onClick={e => {
                      setOpenColumnConfig({anchorEl: e.currentTarget, columnId: _.id})
                    }}/>
                  </td>
                )
              })}
            </tr>
            <TableBody
              loading={loading}
              columns={filteredColumns}
              data={filteredSortedAndPaginatedData?.data}
              getRenderRowKey={getRenderRowKey}
              select={select ? {
                is: _selected.has,
                onToggle: _selected.toggle,
                getId: select.getId,
              } : undefined}
            />
            </tbody>
          </Box>
          {!loading && (!filteredData || filteredData.length === 0) && (
            <div>
              {renderEmptyState ? renderEmptyState : <Fender title={m.noDataAtm} icon="highlight_off"/>}
            </div>
          )}
        </Box>
      </Box>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData?.length ?? 0}
        rowsPerPage={sheetSearch.limit}
        page={sheetSearch.offset / sheetSearch.limit}
        onPageChange={(event: unknown, newPage: number) => {
          setSheetSearch(prev => ({...prev, offset: newPage * sheetSearch.limit}))
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSheetSearch(prev => ({...prev, limit: event.target.value as any}))
        }}
      />
      {map(openIntegerChartDialog, c =>
        <NumberChoicesPopover
          anchorEl={c.anchorEl}
          question={c.columnId}
          data={filteredData ?? []}
          onClose={() => setOpenSelectChartDialog(undefined)}
        />
      )}
      {map(openSelectChartDialog, c =>
        <MultipleChoicesPopover
          anchorEl={c.anchorEl}
          question={c.columnId}
          data={filteredData ?? []}
          onClose={() => setOpenSelectChartDialog(undefined)}
        />
      )}
      {map(openColumnConfig, c =>
        <SheetFilterDialog
          anchorEl={c.anchorEl}
          orderBy={sheetSearch.orderBy}
          onOrderByChange={_ => onOrderBy(c.columnId, _)}
          value={filters[c.columnId] as any}
          schema={propertyTypes[c.columnId]}
          property={c.columnId}
          onClose={() => setOpenColumnConfig(undefined)}
          onClear={() => setFilters(prev => {
            if (prev) {
              delete prev[c.columnId!]
            }
            // setFilteringProperty(undefined)
            return {...prev}
          })}
          onChange={(p: string, v: string | string[]) => {
            setFilters(_ => ({..._, [p]: v}))
            setOpenColumnConfig(undefined)
          }}
        />
      )}
    </>
  )
}

const TableBody = (() => {
  const Component = <T extends Answer>({
    loading,
    columns,
    data,
    getRenderRowKey,
    select
  }: {
    select?: {
      is: any,
      getId: (_: T) => string
      onToggle: any,
    }
    getRenderRowKey?: (_: T, index: number) => string
    data?: T[],
    loading?: boolean,
    columns: SheetColumnProps<T>[],
  }) => {
    console.log('renderbody')
    return (
      <>
        {!data && loading && (
          <tr>
            <td className="td-loading" colSpan={columns?.length ?? 1}>
              <LinearProgress/>
            </td>
          </tr>
        )}
        {data?.map((item, i) => (
          <tr
            className="tr"
            key={getRenderRowKey ? getRenderRowKey(item, i) : i}
            // onClick={e => onClickRows?.(item, e)}
          >
            {select && (
              <td className="td td-center">
                <Checkbox size="small" checked={select.is(select.getId(item))} onChange={() => select.onToggle(select.getId(item))}/>
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