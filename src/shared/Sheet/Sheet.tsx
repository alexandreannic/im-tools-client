import {Box, BoxProps, LinearProgress, SxProps, TablePagination, Theme,} from '@mui/material'
import React, {ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {Fender} from 'mui-extension'
import {KeyOf, Utils} from '@/utils/utils'
import {SheetFilterDialog} from './SheetFilterDialog'
import {Arr, fnSwitch, map} from '@alexandreannic/ts-utils'
import {AAIconBtn} from '../IconBtn'
import {useAsync, useSetState} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {useSheetData} from './useSheetData'
import {SheetBody} from './SheetBody'
import {SheetHead} from './SheetHead'
import {SheetColumnConfigPopoverParams, SheetContext, SheetOptions, SheetPropertyType, SheetSearch} from '@/shared/Sheet/sheetType'
import {NumberChoicesPopover} from '@/shared/Sheet/SheetPopover'
import {format} from 'date-fns'

type OrderBy = 'asc' | 'desc'

export type SheetRow = {[key: string]: any}// Record<string, any/* string | number[] | string[] | Date | number | undefined*/>

export interface SheetTableProps<T extends SheetRow> extends Omit<BoxProps, 'onSelect'> {
  header?: ReactNode
  loading?: boolean
  total?: number
  title?: string
  select?: {
    onSelect: (_: string[]) => void
    getId: (_: T) => string
    selectActions?: ReactNode
  }
  // select?: {
  //   getId: (_: T) => string
  //   onSelect: (_: string[]) => void
  // },
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
    sortBy?: KeyOf<T>
    orderBy?: OrderBy
    onSortChange: (_: {sortBy?: KeyOf<T>; orderBy?: OrderBy}) => void
  }
}

export interface SheetColumnProps<T extends SheetRow> {
  id: string
  render: (_: T) => ReactNode
  noSort?: boolean
  width?: number
  head?: string | ReactNode
  align?: 'center' | 'right'
  onClick?: (_: T) => void
  renderExport?: boolean | ((_: T) => string | number | undefined | Date)
  hidden?: boolean
  alwaysVisible?: boolean
  tooltip?: (_: T) => string
  type?: SheetPropertyType//'number' | 'date' | 'string' | 'select_one' | 'select_multiple'
  options?: SheetOptions[]
  className?: string | ((_: T) => string | undefined)
  // sx?: (_: T) => SxProps<Theme> | undefined
  // style?: CSSProperties
  stickyEnd?: boolean
}

const sxStickyEnd: SxProps<Theme> = {
  paddingTop: '1px',
  position: 'sticky',
  right: 0,
  background: t => t.palette.background.paper,
}

export type SheetFilter = string
  | string[]
  | [Date | undefined, Date | undefined]
  | [number | undefined, number | undefined]

const Context = React.createContext<SheetContext<any>>({} as SheetContext<any>)
export const useSheetContext = <T extends SheetRow>() => useContext<SheetContext<T>>(Context as any)

export const Sheet = <T extends SheetRow = SheetRow>({
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
  const {m} = useI18n()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)
  const [search, setSearch] = useState<SheetSearch<T>>({
    limit: 20,
    offset: 0,
    sortBy: sort?.sortBy,
    orderBy: sort?.orderBy,
  })
  const columnsIndex = useMemo(() => Arr(columns).reduceObject<Record<KeyOf<T>, SheetColumnProps<T>>>(_ => [_.id, _]), [columns])
  const _selected = useSetState<string>()
  useMemo(() => select?.onSelect(_selected.toArray), [_selected.get])


  // const [filteringProperty, setFilteringProperty] = useState<KeyOf<T> | undefined>(undefined)
  const [filters, setFilters] = useState<Record<KeyOf<T>, SheetFilter>>({} as any)

  // const displayableColumns: SheetColumnProps<T>[] = useMemo(() => {
  //   return columns.filter(_ => !_.hidden)
  // }, [columns])
  // const [hiddenColumns, setHiddenColumns] = usePersistentState<(KeyOf<T>)[]>([], id)
  // const filteredColumns = useMemo(() => displayableColumns.filter(_ => !hiddenColumns.includes(_.id)), [columns, hiddenColumns])

  const onOrderBy = (columnId: string, orderBy?: OrderBy) => {
    setSearch(prev => ({...prev, orderBy, sortBy: columnId}))
  }

  const exportToCSV = () => {
    console.log('_data.filteredAndSortedData', _data.filteredAndSortedData)
    if (_data.filteredAndSortedData) {
      _generateXLSFromArray.call({
        filename: Utils.slugify(title) ?? 'noname',
        data: _data.filteredAndSortedData,
        schema: columns
          .filter(_ => _.renderExport)
          .map(q => ({
            name: q.head as string ?? q.id,
            render: (row: any) => {
              if (!q.renderExport) return
              if (q.renderExport === true) return fnSwitch(q.type!, {
                integer: () => map(row[q.id], _ => +_),
                decimal: () => map(row[q.id], _ => +_),
                date: () => map(row[q.id], (_: Date) => format(_, 'yyyy-MM-dd hh:mm:ss'))
              }, () => row[q.id])
              return q.renderExport(row)
            }
          })),
      })
    }
  }

  const [openFilterPopover, setOpenFilterPopover] = useState<SheetColumnConfigPopoverParams<T> | undefined>()
  const [openStatsPopover, setOpenStatsPopover] = useState<SheetColumnConfigPopoverParams<T> | undefined>()

  const onOpenFilterConfig = useCallback((q: SheetColumnProps<T>, event: any) => {
    setOpenFilterPopover({
      anchorEl: event.currentTarget,
      columnId: q.id,
      type: q.type!,
      options: q.options,
    })
  }, [])

  const onOpenStatsConfig = useCallback((q: SheetColumnProps<T>, event: any) => {
    setOpenStatsPopover({
      anchorEl: event.currentTarget,
      columnId: q.id,
      type: q.type!,
      options: q.options,
    })
  }, [])

  const _data = useSheetData<T>({
    loading,
    columnsIndex,
    data: data,
    search: search,
    filters,
  })


  return (
    <Context.Provider value={{
      _selected,
      _data: _data as any,
      search,
      filters,
      setFilters,
      columnsIndex,
      columns,
      select,
      getRenderRowKey,
      setSearch,
    }}>
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
      {map(openStatsPopover, c => {
        switch (c.type) {
          case 'decimal':
          case 'integer':
            return <NumberChoicesPopover
              anchorEl={c.anchorEl}
              question={c.columnId}
              data={_data.filteredData ?? []}
              onClose={() => setOpenStatsPopover(undefined)}
            />
          case 'date':
          case 'select_one':
          case 'select_multiple':
          default:
            return undefined
        }
      })}
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={{
          // width: 'max-content'
        }}>
          <Box component="table" {...props} className="borderY table" sx={{minWidth: '100%'}}>
            <SheetHead
              onOpenColumnConfig={onOpenFilterConfig}
              onOpenStats={onOpenStatsConfig}
            />
            <tbody>
            {!_data.filteredSortedAndPaginatedData && loading && (
              <tr>
                <td className="td-loading" colSpan={columns?.length ?? 1}>
                  <LinearProgress/>
                </td>
              </tr>
            )}
            </tbody>
            <SheetBody/>
          </Box>
          {!loading && (!_data.filteredData || _data.filteredData.length === 0) && (
            <div>
              {renderEmptyState ? renderEmptyState : <Fender sx={{my: 2}} title={m.noDataAtm} icon="highlight_off"/>}
            </div>
          )}
        </Box>
      </Box>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={_data.filteredData?.length ?? 0}
        rowsPerPage={search.limit}
        page={search.offset / search.limit}
        onPageChange={(event: unknown, newPage: number) => {
          setSearch(prev => ({...prev, offset: newPage * search.limit}))
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(prev => ({...prev, limit: event.target.value as any}))
        }}
      />
      {map(openFilterPopover, c =>
        <SheetFilterDialog
          title={c.columnId}
          anchorEl={c.anchorEl}
          sortBy={search.sortBy}
          orderBy={search.orderBy}
          onOrderByChange={_ => onOrderBy(c.columnId, _)}
          value={filters[c.columnId] as any}
          columnId={c.columnId}
          type={c.type}
          options={c.options}
          onClose={() => setOpenFilterPopover(undefined)}
          onClear={() => setFilters(prev => {
            if (prev) {
              delete prev[c.columnId!]
            }
            // setFilteringProperty(undefined)
            return {...prev}
          })}
          onChange={(p: string, v: string | string[] | [Date, Date]) => {
            setFilters(_ => ({..._, [p]: v}))
            setOpenFilterPopover(undefined)
          }}
        />
      )}
    </Context.Provider>
  )
}

