import {Box, BoxProps, Checkbox, GlobalStyles, Icon, LinearProgress, SxProps, TablePagination, Theme,} from '@mui/material'
import React, {CSSProperties, ReactNode, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Fender, IconBtn} from 'mui-extension'
import {usePersistentState} from 'react-persistent-state'
import {multipleFilters, paginateData} from '../../utils/utils'
import {SheetFilterDialog} from './SheetFilterDialog'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import * as assert from 'assert'
import {useSetState} from '@alexandreannic/react-hooks-lib'
import {AAIconBtn} from '../IconBtn'

const generalStyles = <GlobalStyles
  styles={t => ({
    '.table': {
      tableLayout: 'fixed',
      overflowX: 'auto',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      // borderTop: `1px solid ${t.palette.divider}`,
      // borderLeft: `1px solid ${t.palette.divider}`,
    },
    // 'th:first-child': {
    //   position: 'sticky',
    //   left: 0,
    //   zIndex: 2,
    // },
    '.th': {
      // overflow: 'auto',
    },
    '.tr': {
      // display: 'flex',
      whiteSpace: 'nowrap',
      // borderBottom: `1px solid ${t.palette.divider}`,
    },
    '.th.th-sorted': {
      borderBottomColor: t.palette.primary.main,
      boxShadow: `${t.palette.primary.main} 0 -1px 0 0 inset`,
    },
    '.td-clickable:hover': {
      background: t.palette.action.hover,
    },
    '.td.fw': {
      width: '100%',
    },
    '::-webkit-resizer': {
      background: 'invisible',
    },
    '.td:first-of-type': {
      paddingLeft: 8,
    },
    '.td-center': {
      textAlign: 'center',
    },
    '.td-right': {
      textAlign: 'right',
    },
    '.td': {
      // display: 'inline-flex',
      alignItems: 'center',
      height: 30,
      resize: 'both',
      padding: '2px 2px 2px 2px',
      borderBottom: `1px solid ${t.palette.divider}`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      // minWidth: 100,
      // width: 100,
    },
    'thead .th': {
      zIndex: 2,
      background: t.palette.background.paper,
      top: 0,
      paddingTop: t.spacing(.75),
      paddingBottom: t.spacing(.75),
      position: 'sticky',
      color: t.palette.text.secondary,
    },
  })}
/>

type OrderBy = 'asc' | 'desc'

type Answer = Record<string, any/* string | number[] | string[] | Date | number | undefined*/>

export interface SheetTableProps<T extends Answer> extends BoxProps {
  header?: ReactNode
  actions?: ReactNode
  loading?: boolean
  total?: number
  select?: {
    selectActions?: ReactNode
    getId: (_: T) => string
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
    onSortChange: (_: {sortBy?: string; orderBy?: OrderBy}) => void
  }
}

export interface SheetColumnProps<T extends Answer> {
  id: string
  noSort?: boolean
  head?: string | ReactNode
  align?: 'center' | 'right'
  render: (_: T) => ReactNode
  hidden?: boolean
  alwaysVisible?: boolean
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
    return Array.isArray(f) && (typeof f[0] === 'string')
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
  columns,
  getRenderRowKey,
  actions,
  header,
  showColumnsToggle,
  showColumnsToggleBtnTooltip,
  renderEmptyState,
  rowsPerPageOptions = [5, 10, 25, 100],
  sort,
  onClickRows,
  select,
  ...props
}: SheetTableProps<T>) => {
  const [limit, setLimit] = useState(25)
  const [offset, setOffset] = useState(0)
  const _selected = useSetState<string>()

  const {m} = useI18n()
  const [filteringProperty, setFilteringProperty] = useState<keyof T | undefined>(undefined)
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
  // const editingPropertyType = useMemo(() => columns.find(_ => _.id === filteringProperty)?.type, [filteringProperty])

  // const displayableColumns = useMemo(() => columns.filter(_ => !_.hidden), [columns])
  // const toggleableColumnsName = useMemo(
  //   () => displayableColumns.filter(_ => !_.alwaysVisible && _.head && _.head !== ''),
  //   [displayableColumns],
  // )
  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>([], id)
  const filteredColumns = useMemo(() => displayableColumns.filter(_ => !hiddenColumns.includes(_.id)), [columns, hiddenColumns])
  // const displayTableHeader = useMemo(() => !!displayableColumns.find(_ => _.head !== ''), [displayableColumns])

  const onSortBy = (columnId: typeof columns[0]['id']) => {
    if (!sort) return
    if (sort.sortBy === columnId && sort.orderBy === 'desc') {
      sort.onSortChange({sortBy: undefined, orderBy: undefined})
    } else {
      sort.onSortChange({sortBy: columnId, orderBy: sort.orderBy === 'asc' ? 'desc' : 'asc'})
    }
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

  const filteredAndPaginatedData = useMemo(() => {
    if (!filteredData) return
    return paginateData<T>(limit, offset)(filteredData)
  }, [limit, offset, filteredData])

  return (
    <>
      <Box sx={{position: 'relative', p: 2}}>
        {header}
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
      <Box sx={{overflowX: 'scroll'}}>
        <Box sx={{width: 'max-content'}}>
          {generalStyles}

          <Box component="table" {...props} className="table">
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
                return (
                  <th
                    key={_.id}
                    onClick={() => onSortBy(_.id)}
                    className={'td th' + (sortedByThis ? ' th-sorted' : '') + (fnSwitch(_.align!, {
                      'center': ' td-center',
                      'right': ' td-right'
                    }, _ => ''))}
                  >
                    {_.head}
                    <IconBtn size="small">
                      <Icon
                        fontSize="small"
                        color={filters[_.id] ? 'primary' : 'disabled'}
                        sx={{verticalAlign: 'middle', mx: 1}}
                        onClick={e => {
                          e.stopPropagation()
                          setFilteringProperty(_.id)
                        }}
                      >
                        filter_list
                      </Icon>
                    </IconBtn>
                  </th>
                )
              })}
            </tr>
            </thead>
            {loading && (
              <LinearProgress/>
            )}

            <tbody>
            {filteredAndPaginatedData?.data.map((item, i) => (
              <tr
                className="tr"
                key={getRenderRowKey ? getRenderRowKey(item, i) : i}
                onClick={e => onClickRows?.(item, e)}
              >
                {select?.getId && (
                  <td className="td td-center">
                    <Checkbox size="small" checked={_selected.has(select.getId(item))} onChange={() => _selected.toggle(select.getId(item))}/>
                  </td>
                )}
                {filteredColumns.map((_, i) => (
                  <td
                    title={_.render(item) as any}
                    key={i}
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
        rowsPerPage={limit}
        page={offset / limit}
        onPageChange={(event: unknown, newPage: number) => {
          setOffset(newPage * limit)
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLimit(event.target.value as any)
        }}
      />
      <SheetFilterDialog
        value={filteringProperty && filters[filteringProperty] as any}
        propertyType={propertyTypes[filteringProperty]}
        property={filteringProperty as string}
        onClose={() => setFilteringProperty(undefined)}
        onClear={() => setFilters(prev => {
          if (prev) {
            delete prev[filteringProperty!]
          }
          // setFilteringProperty(undefined)
          return {...prev}
        })}
        onChange={(p: string, v: string | string[]) => {
          setFilters(_ => ({..._, [p]: v}))
          setFilteringProperty(undefined)
        }}
      />
    </>
  )
}
