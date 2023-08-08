import {Badge, Box, BoxProps, Icon, LinearProgress, SxProps, TablePagination, Theme,} from '@mui/material'
import React, {ReactNode, useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Fender, Txt} from 'mui-extension'
import {KeyOf, Utils} from '@/utils/utils'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {AAIconBtn} from '../IconBtn'
import {useAsync, useMemoFn} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {SheetBody} from './SheetBody'
import {SheetHead} from './SheetHead'
import {SheetOptions, SheetPropertyType} from '@/shared/Sheet/sheetType'
import {format} from 'date-fns'
import {SheetProvider, useSheetContext} from '@/shared/Sheet/context/SheetContext'
import {id} from 'date-fns/locale'

type OrderBy = 'asc' | 'desc'

export type SheetRow = Record<string, any>// Record<string, any/* string | number[] | string[] | Date | number | undefined*/>

export interface SheetTableProps<T extends SheetRow> extends Omit<BoxProps, 'onSelect'> {
  header?: ReactNode
  loading?: boolean
  total?: number
  title?: string
  readonly select?: {
    readonly onSelect: (_: string[]) => void
    readonly getId: (_: T) => string
    readonly selectActions?: ReactNode
  }
  readonly data?: T[]
  getRenderRowKey?: (_: T, index: number) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLElement>) => void
  rowsPerPageOptions?: number[]
  columns: SheetColumnProps<T>[]
  showColumnsToggle?: boolean
  showColumnsToggleBtnTooltip?: string
  showExportBtn?: boolean
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
  renderValue?: (_: T) => string | number | undefined
  render: (_: T, i: number) => ReactNode
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
  typeIcon?: ReactNode
  options?: () => SheetOptions[]
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

export const Sheet = <T extends SheetRow = SheetRow>({
  id,
  loading,
  total,
  data,
  title,
  showExportBtn,
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
  return (
    <SheetProvider
      columns={columns}
      data={data}
      select={select}
      getRenderRowKey={getRenderRowKey}
    >
      <_Sheet
        id={id}
        showExportBtn={showExportBtn}
        renderEmptyState={renderEmptyState}
        header={header}
        sx={props.sx}
        loading={loading}
      />
    </SheetProvider>
  )
}

const _Sheet = <T extends SheetRow>({
  header,
  sx,
  id,
  showExportBtn,
  renderEmptyState,
  loading,
  rowsPerPageOptions,
}: Pick<SheetTableProps<T>, 'id' | 'showExportBtn' | 'rowsPerPageOptions' | 'renderEmptyState' | 'header' | 'loading' | 'sx'>) => {
  const ctx = useSheetContext()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)
  useEffect(() => ctx.select?.onSelect(ctx.selected.toArray), [ctx.selected.get])
  const {m} = useI18n()

  const exportToCSV = () => {
    if (ctx.data.filteredAndSortedData) {
      _generateXLSFromArray.call(Utils.slugify('TODO') ?? 'noname', {
        sheetName: 'data',
        data: ctx.data.filteredAndSortedData,
        schema: ctx.columns
          .filter(_ => _.renderExport)
          .map(q => ({
            name: q.head as string ?? q.id,
            render: (row: any) => {
              if (!q.renderExport) return
              if (q.renderExport === true) return fnSwitch(q.type!, {
                number: () => map(row[q.id], _ => +_),
                date: () => map(row[q.id], (_: Date) => format(_, 'yyyy-MM-dd hh:mm:ss'))
              }, () => row[q.id])
              return q.renderExport(row)
            }
          })),
      })
    }
  }

  const filterCount = useMemoFn(ctx.data.filters, _ => Enum.keys(_).length)

  return (
    <>
      <Box sx={{position: 'relative', p: 1, display: 'flex', alignItems: 'center'}}>
        <Badge badgeContent={filterCount} color="primary" overlap="circular" onClick={() => ctx.data.setFilters({})}>
          <AAIconBtn sx={{mr: 1}} icon="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount}/>
        </Badge>
        {header}
        {showExportBtn && (
          <AAIconBtn loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
        )}
        {ctx.selected.size > 0 && (
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
                {ctx.selected.size} {m.selected}.
              </Box>
              {ctx.select?.selectActions}
              <AAIconBtn color="primary" icon="clear" onClick={ctx.selected.clear}/>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={{
          // width: 'max-coontent'
        }}>
          <Box id={id} component="table" className="borderY table" sx={{...sx, minWidth: '100%'}}>
            <SheetHead
              data={ctx.data.filteredSortedAndPaginatedData?.data}
              search={ctx.data.search}
              filters={ctx.data.filters}
              columns={ctx.columns}
              columnsIndex={ctx.columnsIndex}
              select={ctx.select}
              selected={ctx.selected}
              onOpenFilter={ctx.modal.filterPopover.open}
              onOpenStats={ctx.modal.statsPopover.open}
            />
            <tbody>
            {map(ctx.data.filteredSortedAndPaginatedData, data => {
              return data.data.length > 0 ? (
                <SheetBody
                  loading={loading}
                  data={data.data}
                  select={ctx.select}
                  columns={ctx.columns}
                  getRenderRowKey={ctx.getRenderRowKey}
                  selected={ctx.selected}
                />
              ) : (
                <tr>
                  <td className="td-loading" colSpan={ctx.columns?.length ?? 1}>
                    <Box sx={{display: 'flex', alignItems: 'center', p: 4}}>
                      <Icon color="disabled" sx={{fontSize: 40, mr: 2}}>block</Icon>
                      <Txt color="disabled" size="title">{m.noDataAtm}</Txt>
                    </Box>
                  </td>
                </tr>
              )}) ?? (loading && (
              <tr>
                <td className="td-loading" colSpan={ctx.columns?.length ?? 1}>
                  <LinearProgress/>
                </td>
              </tr>
            ))}
            </tbody>
          </Box>
        </Box>
      </Box>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={ctx.data.filteredData?.length ?? 0}
        rowsPerPage={ctx.data.search.limit}
        page={ctx.data.search.offset / ctx.data.search.limit}
        onPageChange={(event: unknown, newPage: number) => {
          ctx.data.setSearch(prev => ({...prev, offset: newPage * ctx.data.search.limit}))
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          ctx.data.setSearch(prev => ({...prev, limit: event.target.value as any}))
        }}
      />
    </>
  )
}

