import {Box, BoxProps, GlobalStyles, LinearProgress, SxProps, Theme,} from '@mui/material'
import React, {CSSProperties, ReactNode, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Fender, Txt} from 'mui-extension'
import {usePersistentState} from 'react-persistent-state'

const generalStyles = <GlobalStyles
  styles={t => ({
    '.table': {
      tableLayout: 'fixed',
      overflow: 'auto',
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
    'thead th': {
      zIndex: 2,
      background: t.palette.background.paper,
      top: 0,
      position: 'sticky',
    },
    '.td.fw': {
      width: '100%',
    },
    '::-webkit-resizer': {
      background: 'invisible',
    },
    '.td': {
      // display: 'inline-flex',
      alignItems: 'center',
      height: 30,
      resize: 'both',
      padding: '2px 0 2px 2px',
      border: `1px solid ${t.palette.divider}`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      // minWidth: 100,
      // width: 100,
    }
  })}
/>

type OrderBy = 'asc' | 'desc'

export interface DatatableProps<T> extends BoxProps {
  header?: ReactNode
  actions?: ReactNode
  loading?: boolean
  total?: number
  data?: T[]
  getRenderRowKey?: (_: T, index: number) => string
  onClickRows?: (_: T, event: React.MouseEvent<HTMLElement>) => void
  columns: DatatableColumnProps<T>[]
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

export interface DatatableColumnProps<T> {
  id: string
  head?: string | ReactNode
  render: (_: T) => ReactNode
  hidden?: boolean
  alwaysVisible?: boolean
  className?: string | ((_: T) => string | undefined)
  sx?: (_: T) => SxProps<Theme> | undefined
  style?: CSSProperties
  stickyEnd?: boolean
  number?: boolean
}

const sxStickyEnd: SxProps<Theme> = {
  paddingTop: '1px',
  position: 'sticky',
  right: 0,
  background: t => t.palette.background.paper,
}

export const Sheet = <T extends any = any>({
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
  sort,
  onClickRows,
  ...props
}: DatatableProps<T>) => {
  const {m} = useI18n()
  const displayableColumns = useMemo(() => columns.filter(_ => !_.hidden), [columns])
  const toggleableColumnsName = useMemo(
    () => displayableColumns.filter(_ => !_.alwaysVisible && _.head && _.head !== ''),
    [displayableColumns],
  )
  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>([], id)
  const filteredColumns = useMemo(() => displayableColumns.filter(_ => !hiddenColumns.includes(_.id)), [columns, hiddenColumns])
  const displayTableHeader = useMemo(() => !!displayableColumns.find(_ => _.head !== ''), [displayableColumns])

  const onSortBy = (columnId: typeof columns[0]['id']) => {
    console.log(columnId)
    if (!sort) return
    if (sort.sortBy === columnId && sort.orderBy === 'desc') {
      sort.onSortChange({sortBy: undefined, orderBy: undefined})
    } else {
      sort.onSortChange({sortBy: columnId, orderBy: sort.orderBy === 'asc' ? 'desc' : 'asc'})
    }
  }

  return (
    <Box sx={{overflow: 'scroll'}}>
      <Box sx={{width: 'max-content'}}>
        {generalStyles}

        <Box component="table" {...props} className="table">
          <thead>
          <tr className="tr trh">
            {filteredColumns.map((_, i) => {
              const sortedByThis = sort?.sortBy === _.id ?? true
              return (
                <th
                  onResize={console.log}
                  key={_.id}
                  onClick={() => onSortBy(_.id)}
                  className={'td th' + (sortedByThis ? ' th-sorted' : '')}
                >
                  {_.head}
                </th>
              )
            })}
          </tr>
          </thead>
          {loading && (
            <LinearProgress/>
          )}

          <tbody>
          {data?.map((item, i) => (
            <tr
              className="tr"
              key={getRenderRowKey ? getRenderRowKey(item, i) : i}
              onClick={e => onClickRows?.(item, e)}
            >
              {filteredColumns.map((_, i) => (
                <td
                  title={_.render(item) as any}
                  key={i}
                  className="td td-clickable"
                >
                  {_.render(item)}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </Box>
        {!loading && (!data || data?.length === 0) && (
          <div>
            {renderEmptyState ? renderEmptyState : <Fender title={m.noDataAtm} icon="highlight_off"/>}
          </div>
        )}
        <div className="td fw">
          <Txt bold>{data?.length}</Txt>
        </div>
      </Box>
    </Box>
  )
}
