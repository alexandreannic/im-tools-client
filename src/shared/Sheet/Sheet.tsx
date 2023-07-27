import {Box, BoxProps, Checkbox, GlobalStyles, Icon, LinearProgress, SxProps, TablePagination, Theme,} from '@mui/material'
import React, {ReactNode, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Fender, IconBtn} from 'mui-extension'
import {usePersistentState} from 'react-persistent-state'
import {multipleFilters, paginateData, Utils} from '../../utils/utils'
import {SheetFilterDialog, SheetFilterDialogProps} from './SheetFilterDialog'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {AAIconBtn} from '../IconBtn'
import {useAsync, useSetState} from '@alexandreannic/react-hooks-lib'
import {orderBy} from 'lodash'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {koboTypeToFilterType} from '@/features/Database/DatabaseTable/koboDatabaseShared'
import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'

// const generalStyles = <GlobalStyles
//   styles={t => ({
//     '.table': {
//       tableLayout: 'fixed',
//       // overflowX: 'auto',
//       borderCollapse: 'collapse',
//       borderSpacing: 0,
//       // borderTop: `1px solid ${t.palette.divider}`,
//       // borderLeft: `1px solid ${t.palette.divider}`,
//     },
//     // 'th:first-child': {
//     //   position: 'sticky',
//     //   left: 0,
//     //   zIndex: 2,
//     // },
//     '.th': {
//       position: 'relative',
//       // overflow: 'auto',
//     },
//     '.tr': {
//       // display: 'flex',
//       whiteSpace: 'nowrap',
//       // borderBottom: `1px solid ${t.palette.divider}`,
//     },
//     // '.th-action': {
//     //   position: 'absolute',
//     //   left: 0,
//     //   display: 'none',
//     // },
//     // '.th:hover .th-action': {
//     //   display: 'block',
//     // },
//     '.th-active': {
//       borderBottomColor: t.palette.primary.main,
//       boxShadow: `${t.palette.primary.main} 0 -1px 0 0 inset`,
//     },
//     '.td-clickable:hover': {
//       background: t.palette.action.hover,
//     },
//     '.td.fw': {
//       width: '100%',
//     },
//     '::-webkit-resizer': {
//       background: 'invisible',
//     },
//     '.td:first-of-type': {
//       paddingLeft: 8,
//     },
//     '.td-center': {
//       textAlign: 'center',
//     },
//     '.td-right': {
//       textAlign: 'right',
//     },
//     '.td-loading': {
//       padding: 0,
//       border: 'none',
//     },
//     '.td': {
//       // display: 'inline-flex',
//       alignItems: 'center',
//       height: 38,
//       resize: 'both',
//       padding: '2px 2px 2px 2px',
//       borderBottom: `1px solid ${t.palette.divider}`,
//       whiteSpace: 'nowrap',
//       // overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       // minWidth: 100,
//       // width: 100,
//     },
//     'thead .th': {
//       height: 42,
//       zIndex: 2,
//       background: t.palette.background.paper,
//       top: 0,
//       paddingTop: t.spacing(.25),
//       paddingBottom: t.spacing(.25),
//       position: 'sticky',
//       color: t.palette.text.secondary,
//     },
//   })}
// />

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

export interface SheetColumnProps<T extends Answer> {
  id: string
  render: (_: T) => ReactNode
  noSort?: boolean
  width?: number
  head?: string | ReactNode
  align?: 'center' | 'right'
  onClick?: (_: T) => void
  renderExport?: (_: T) => string | number | undefined | Date
  hidden?: boolean
  alwaysVisible?: boolean
  tooltip?: (_: T) => string
  type?: 'number' | 'date' | string[] | 'string'
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

  const [openColumnConfig, setOpenColumnConfig] = useState<{
    anchorEl: HTMLElement
    columnId: string
    type: KoboQuestionType
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

  const filteredData = useMemo(() => {
    if (!data) return
    return multipleFilters(data, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (!filter || filter.length === 0) return undefined
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
        return row => {
          const v = row[k]
          if (!v) return false
          if (Array.isArray(v)) return !!(v as string[]).find(_ => filter.includes(_))
          if (typeof v !== 'string') throw new Error(`Value of ${String(k)} is ${v} but string expected.`)
          return filter.includes(v)
        }
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
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: t => t.palette.background.paper,
          }}>
            <Box sx={{
              position: 'absolute',
              top: -1,
              right: -1,
              left: -1,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              border: t => `2px solid ${t.palette.primary.main}`,
              color: t => t.palette.primary.main,
              fontWeight: t => t.typography.fontWeightBold,
              background: t => t.palette.action.focus,
              borderTopLeftRadius: t => t.shape.borderRadius + 'px',
              borderTopRightRadius: t => t.shape.borderRadius + 'px',
              px: 2,
            }}>
              <Box sx={{flex: 1,}}>
                {_selected.size} {m.selected}.
              </Box>
              {select?.selectActions}
              <AAIconBtn color="primary" icon="clear" onClick={_selected.clear}/>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={{
          // width: 'max-content'
        }}>
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
              {filteredColumns.map((_, i) => {
                const sortedByThis = sort?.sortBy === _.id ?? true
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
                    {_.head}
                    <IconBtn size="small" sx={{mx: .5}} className="th-action">
                      <Icon
                        fontSize="small"
                        color={active ? 'primary' : 'disabled'}
                        sx={{verticalAlign: 'middle'}}
                        onClick={e => {
                          setOpenColumnConfig({
                            anchorEl: e.currentTarget,
                            columnId: _.id,
                            type: (() => {
                              if (Array.isArray(_.type)) return 'list'
                              return _.type
                            })(),
                          })
                        }}
                      >
                        keyboard_arrow_down
                      </Icon>
                    </IconBtn>
                  </th>
                )
              })}
            </tr>
            </thead>
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
          </Box>
          {!loading && (!filteredData || filteredData.length === 0) && (
            <div>
              {renderEmptyState ? renderEmptyState : <Fender sx={{my: 2}} title={m.noDataAtm} icon="highlight_off"/>}
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
      {map(openColumnConfig, c =>
        <SheetFilterDialog
          title={c.columnId}
          anchorEl={c.anchorEl}
          orderBy={sheetSearch.orderBy}
          onOrderByChange={_ => onOrderBy(c.columnId, _)}
          value={filters[c.columnId] as any}
          columnId={c.columnId}
          type={c.type}
          onClose={() => setOpenColumnConfig(undefined)}
          onClear={() => setFilters(prev => {
            if (prev) {
              delete prev[c.columnId!]
            }
            // setFilteringProperty(undefined)
            return {...prev}
          })}
          onChange={(p: string, v: string | string[] | [Date, Date]) => {
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
    return (
      <tbody>
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
      </tbody>
    )
  }
  return React.memo(Component) as typeof Component
})()