import {Badge, Box, BoxProps, Icon, LinearProgress, TablePagination,} from '@mui/material'
import React, {CSSProperties, ReactNode, useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
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
import {DatatableColumnToggle} from '@/shared/Datatable/DatatableColumnsToggle'
import {usePersistentState} from '@/alexlib-labo/usePersistantState'

type OrderBy = 'asc' | 'desc'

export type SheetRow = Record<string, any>// Record<string, any/* string | number[] | string[] | Date | number | undefined*/>

export interface SheetTableProps<T extends SheetRow> extends Omit<BoxProps, 'onSelect'> {
  header?: ReactNode
  loading?: boolean
  total?: number
  defaultLimit?: number
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

interface SheetColumnPropsSelectOne<T extends SheetRow> extends SheetColumnPropsBase<T> {
  type?: Exclude<SheetPropertyType, 'date'>
  renderValue?: (_: T) => string | string[] | Date | number | undefined
}

interface SheetColumnPropsDate<T extends SheetRow> extends SheetColumnPropsBase<T> {
  type: 'date'
  renderValue?: (_: T) => Date | undefined
}

export type SheetColumnProps<T extends SheetRow> = SheetColumnPropsSelectOne<T> | SheetColumnPropsDate<T>

export interface SheetColumnPropsBase<T extends SheetRow> {
  id: string
  // type?: SheetPropertyType//'number' | 'date' | 'string' | 'select_one' | 'select_multiple'
  // renderValue?: (_: T) => string | number | undefined
  render: (_: T, i: number) => ReactNode
  noSort?: boolean
  width?: number
  head?: string
  align?: 'center' | 'right'
  onClick?: (_: T) => void
  renderExport?: boolean | ((_: T) => string | number | undefined | Date)
  hidden?: boolean
  alwaysVisible?: boolean
  tooltip?: null | ((_: T) => undefined | string)
  style?: CSSProperties
  styleHead?: CSSProperties
  typeIcon?: ReactNode
  options?: () => SheetOptions[]
  className?: string | ((_: T) => string | undefined)
  // sx?: (_: T) => SxProps<Theme> | undefined
  // style?: CSSProperties
  stickyEnd?: boolean
}

export type SheetFilterValueString = {filterBlank?: boolean, value?: string} | undefined
export type SheetFilterValueSelect = string[]
export type SheetFilterValueDate = [Date | undefined, Date | undefined]
export type SheetFilterValueNumber = [number | undefined, number | undefined]
export type SheetFilterValue = SheetFilterValueString | SheetFilterValueSelect | SheetFilterValueDate | SheetFilterValueNumber

export class SheetUtils {

  // static readonly FILTER_BLANK_TEXT = 'FILTER_BLANK_TEXT_someRandomTextToAvoidCollision_9fa3'
  static readonly buildColumns = <T extends SheetRow = SheetRow>(_: SheetColumnProps<T>[]) => _

  static readonly blankValue = ''
  static readonly blankOption: SheetOptions = {value: SheetUtils.blankValue, label: <i>BLANK</i>}

  static readonly buildOptions = (opt: string[], addBlank?: boolean): SheetOptions[] => {
    return [
      ...(addBlank ? [SheetUtils.blankOption] : []),
      ...opt.map(SheetUtils.buildOption),
    ]
  }

  static readonly buildOption = (_: string): SheetOptions => {
    return {value: _, label: _}
  }

  static readonly buildCustomOption = (_: string, label?: string): SheetOptions => {
    return {value: _, label: label ?? _}
  }

  static readonly getValueGetter = <T extends SheetRow>(col: Pick<SheetColumnProps<T>, 'render' | 'renderValue'>, colName: string) => {
    return col.renderValue ?? col.render as any ?? ((_: T) => _[colName])
  }
}


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
  defaultLimit,
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
      defaultLimit={defaultLimit}
      select={select}
      getRenderRowKey={getRenderRowKey}
    >
      <_Sheet
        id={id}
        title={title}
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
  rowsPerPageOptions = [10, 20, 100, 500, 1000],
  title,
}: Pick<SheetTableProps<T>, 'id' | 'title' | 'showExportBtn' | 'rowsPerPageOptions' | 'renderEmptyState' | 'header' | 'loading' | 'sx'>) => {
  const ctx = useSheetContext()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)
  useEffect(() => ctx.select?.onSelect(ctx.selected.toArray), [ctx.selected.get])
  const {m} = useI18n()

  const exportToCSV = () => {
    if (ctx.data.filteredAndSortedData) {
      _generateXLSFromArray.call(Utils.slugify(title) ?? 'noname', {
        sheetName: 'data',
        data: ctx.data.filteredAndSortedData,
        schema: ctx.columns
          .filter(_ => _.renderExport)
          .map(q => ({
            head: q.head as string ?? q.id,
            render: (row: any) => {
              // if (!q.renderExport || !q.renderValue) return
              if (q.renderExport === false) return
              if (q.renderExport === true) return fnSwitch(q.type!, {
                number: () => map(row[q.id], _ => +_),
                date: () => map(row[q.id], (_: Date) => format(_, 'yyyy-MM-dd hh:mm:ss'))
              }, () => row[q.id])
              if (q.renderExport) {
                return q.renderExport(row)
              }
              if (q.renderValue) {
                return q.renderValue(row)
              }
              return row[q.id]
            }
          })),
      })
    }
  }

  const filterCount = useMemoFn(ctx.data.filters, _ => Enum.keys(_).length)

  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>([], 'database-columns-' + id)
  const filteredColumns = useMemo(() => ctx.columns.filter(_ => !hiddenColumns.includes(_.id)), [ctx.columns, hiddenColumns])

  return (
    <>
      <Box sx={{position: 'relative', p: 1, display: 'flex', alignItems: 'center'}}>
        <Badge badgeContent={filterCount} color="primary" overlap="circular" onClick={() => ctx.data.setFilters({})}>
          <AAIconBtn sx={{mr: 1}} children="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount}/>
        </Badge>
        <DatatableColumnToggle
          sx={{mr: 1}}
          columns={ctx.columns}
          hiddenColumns={hiddenColumns}
          onChange={_ => setHiddenColumns(_)}
          title={m.toggleDatatableColumns}
        />
        {header}
        {showExportBtn && (
          <AAIconBtn loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} children="download"/>
        )}
        {ctx.selected.size > 0 && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            borderRadius: t => t.shape.borderRadius + 'px',
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
              fontWeight: t => t.typography.fontWeightBold,
              background: t => t.palette.action.focus,
              px: 2,
              border: t => `2px solid ${t.palette.primary.main}`,
              borderTopLeftRadius: t => t.shape.borderRadius + 'px',
              borderTopRightRadius: t => t.shape.borderRadius + 'px',
              // margin: .75,
              // color: t => t.palette.primary.main,
              // borderRadius: t => t.shape.borderRadius + 'px',
            }}>
              <Box sx={{flex: 1,}}>
                {ctx.selected.size} {m.selected}.
              </Box>
              {ctx.select?.selectActions}
              <AAIconBtn color="primary" children="clear" onClick={ctx.selected.clear}/>
            </Box>
          </Box>
        )}
      </Box>
      {loading && (
        <LinearProgress sx={{marginBottom: '-4px'}}/>
      )}
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={{
          // width: 'max-coontent'
        }}>
          <Box id={id} component="table" className="borderY table" sx={{...sx, minWidth: '100%'}}>
            <SheetHead
              data={ctx.data.filteredSortedAndPaginatedData?.data}
              search={ctx.data.search}
              filters={ctx.data.filters}
              columns={filteredColumns}
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
                  data={data.data}
                  select={ctx.select}
                  columns={filteredColumns}
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
              )
            })}
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

