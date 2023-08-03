import {useI18n} from '@/core/i18n'
import React, {ReactNode} from 'react'
import {useMemoFn} from '@alexandreannic/react-hooks-lib'
import {Enum, map} from '@alexandreannic/ts-utils'
import {Badge, Box, TablePagination} from '@mui/material'
import {AaSelect} from '@/shared/Select/Select'
import {KoboDatabaseHead} from '@/features/Database/DatabaseTable/KoboDatabaseHead'
import {KoboDatabaseBody} from '@/features/Database/DatabaseTable/KoboDatabaseBody'
import {Fender} from 'mui-extension'
import {KoboDatabaseExportBtn} from '@/features/Database/DatabaseTable/KoboDatabaseExportBtn'
import {useKoboDatabaseContext} from '@/features/Database/DatabaseTable/Context/KoboDatabaseContext'
import {AAIconBtn} from '@/shared/IconBtn'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

export const KoboDatabase = (props: {
  header?: ReactNode
}) => {
  const ctx = useKoboDatabaseContext()
  const {m, formatDate, formatDateTime} = useI18n()
  // const [filters, setFilters] = useState<Record<string, SheetFilter>>({} as any)
  // const [sheetSearch, setSheetSearch] = useState<SheetSearch<KoboAnswer>>({
  //   limit: 20,
  //   offset: 0,
  //   sortBy: 'end',
  //   orderBy: 'desc',
  // })
  //
  // const onOrderBy = (columnId: string, orderBy?: OrderBy) => {
  //   setSheetSearch(prev => ({...prev, orderBy: orderBy ?? prev.orderBy, sortBy: columnId}))
  // }

  // const [openBeginRepeat, setOpenBeginRepeat] = useState<{
  //   anchorEl: HTMLElement
  //   columnId: string
  //   group: Record<string, any>[]
  // } | undefined>()

  // const [openFilterPopover, setOpenFilterPopover] = useState<SheetColumnConfigPopoverParams<KoboAnswer, KoboQuestionType> | undefined>()
  // const [openStatsPopover, setOpenStatsPopover] = useState<SheetColumnConfigPopoverParams<KoboAnswer, KoboQuestionType> | undefined>()
  //
  // const onOpenBeginRepeat = useCallback((questionName: string, group: Record<string, any>[], event: any) => {
  //   setOpenBeginRepeat({
  //     anchorEl: event.currentTarget,
  //     columnId: questionName,
  //     group,
  //   })
  // }, [choicesIndex])

  // const onOpenStatsConfig = useCallback((q: KoboQuestionSchema, event: any) => {
  //   setOpenStatsPopover({
  //     anchorEl: event.currentTarget,
  //     columnId: q.name,
  //     type: q.type,
  //     // options: choicesIndex[q.select_from_list_name!]?.map(_ => ({value: _.name, label: getKoboLabel(_, langIndex)})),
  //   })
  // }, [choicesIndex])
  //
  // const onOpenFilterConfig = useCallback((q: KoboQuestionSchema, event: any) => {
  //   setOpenFilterPopover({
  //     anchorEl: event.currentTarget,
  //     columnId: q.name,
  //     type: q.type,
  //     options: choicesIndex[q.select_from_list_name!]?.map(_ => ({name: _.name, label: getKoboLabel(_, langIndex)})),
  //   })
  // }, [choicesIndex])
  //
  const filterCount = useMemoFn(ctx.data.filters, _ => Enum.keys(_).length)

  return (
    <Box>
      <Box sx={{p: 1}}>
        <AaSelect<number>
          sx={{maxWidth: 128, mr: 1}}
          defaultValue={ctx.langIndex}
          onChange={ctx.setLangIndex}
          options={['xml', ...ctx.schema.sanitizedSchema.content.translations].map((_, i) => ({children: _, value: i - 1}))}
        />
        <Badge badgeContent={filterCount} color="primary" overlap="circular" onClick={() => ctx.data.setFilters({})}>
          <AAIconBtn icon="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount}/>
        </Badge>
        <KoboDatabaseExportBtn
          data={ctx.data.filteredAndSorted}
          form={ctx.schema.sanitizedSchema}
        />
        {props.header}
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        {map(ctx.popover.filter.isOpen, c =>
          <SheetFilterDialog
            title={getKoboLabel(ctx.schema.questionIndex[c.columnId], ctx.langIndex)}
            anchorEl={c.anchorEl}
            columnId={c.columnId}
            options={c.options}
            type={c.type}
            orderBy={ctx.data.sheetSearch.orderBy}
            sortBy={ctx.data.sheetSearch.sortBy}
            onOrderByChange={_ => ctx.data.onOrderBy(c.columnId, _)}
            value={ctx.data.filters[c.columnId] as any}
            onClose={ctx.popover.filter.onClose}
            onClear={() => ctx.data.setFilters(prev => {
              if (prev) {
                delete prev[c.columnId!]
              }
              // setFilteringProperty(undefined)
              return {...prev}
            })}
            onChange={(p: string, v: string | string[] | [Date, Date]) => {
              ctx.data.setFilters(_ => ({..._, [p]: v}))
              ctx.data.setSheetSearch(prev => ({...prev, offset: 0}))
              ctx.popover.filter.onClose()
            }}
          />
        )}
        {/*{map(openBeginRepeat, c =>*/}
        {/*  <KoboRepeatGroupDetailsPopover*/}
        {/*    anchorEl={c.anchorEl}*/}
        {/*    group={c.group}*/}
        {/*    form={form}*/}
        {/*    onClose={() => setOpenBeginRepeat(undefined)}*/}
        {/*  />*/}
        {/*)}*/}
        {/*{map(openStatsPopover, c => {*/}
        {/*  switch (c.type) {*/}
        {/*    case 'decimal':*/}
        {/*    case 'integer':*/}
        {/*      return <NumberChoicesPopover*/}
        {/*        anchorEl={c.anchorEl}*/}
        {/*        question={c.columnId}*/}
        {/*        data={filteredData ?? []}*/}
        {/*        onClose={() => setOpenStatsPopover(undefined)}*/}
        {/*      />*/}
        {/*    case 'date':*/}
        {/*    case 'start':*/}
        {/*    case 'end':*/}
        {/*      return (*/}
        {/*        <DatesPopover*/}
        {/*          anchorEl={c.anchorEl}*/}
        {/*          question={c.columnId}*/}
        {/*          data={filteredData ?? []}*/}
        {/*          onClose={() => setOpenStatsPopover(undefined)}*/}
        {/*        />*/}
        {/*      )*/}
        {/*    case 'select_one':*/}
        {/*    case 'select_multiple':*/}
        {/*    case 'calculate':*/}
        {/*      return <MultipleChoicesPopover*/}
        {/*        translations={choicesIndex[questionIndex[c.columnId].select_from_list_name!].map(_ => ({name: _.name, label: getKoboLabel(_, langIndex)}))}*/}
        {/*        anchorEl={c.anchorEl}*/}
        {/*        multiple={c.type === 'select_multiple'}*/}
        {/*        property={c.columnId}*/}
        {/*        data={filteredData ?? []}*/}
        {/*        onClose={() => setOpenStatsPopover(undefined)}*/}
        {/*      />*/}
        {/*    default:*/}
        {/*      return undefined*/}
        {/*  }*/}
        {/*})}*/}
        <table className="table borderY">
          <KoboDatabaseHead
            langIndex={ctx.langIndex}
            sheetSearch={ctx.data.sheetSearch}
            filters={ctx.data.filters}
            onOpenColumnConfig={ctx.popover.filter.onOpen}
            onOpenStats={ctx.popover.stats.onOpen}
            form={ctx.schema.sanitizedSchema}
          />
          {/*<thead>*/}
          {/*<tr className="tr trh">*/}
          {/*  {form.content.survey.map(question =>*/}
          {/*    <th key={question.name}>{question.name}</th>*/}
          {/*  )}*/}
          {/*</tr>*/}
          {/*<tr>*/}
          {/*  {form.content.survey.map(q => {*/}
          {/*    const sortedByThis = sheetSearch.sortBy === q.name ?? false*/}
          {/*    const active = sortedByThis || filters[q.name]*/}
          {/*    return (*/}
          {/*      <td key={q.name}>*/}
          {/*        <SheetIcon color={active ? 'primary' : undefined} icon="keyboard_arrow_down" onClick={e => {*/}
          {/*          setOpenColumnConfig({anchorEl: e.currentTarget, schema: q})*/}
          {/*        }}/>*/}
          {/*      </td>*/}
          {/*    )*/}
          {/*  })}*/}
          {/*</tr>*/}
          {/*</thead>*/}
          {map(ctx.data.filteredSortedAndPaginated?.data, _ =>
            <KoboDatabaseBody
              form={ctx.schema.sanitizedSchema}
              data={_}
              onOpenBeginRepeat={ctx.popover.beginRepeat.onOpen}
              langIndex={ctx.langIndex}
              translateOption={ctx.schema.translateOption}
            />
          )}
        </table>
        {ctx.data.filteredSortedAndPaginated?.data.length === 0 && (
          <Fender sx={{my: 2}} title={m.noDataAtm} icon="highlight_off"/>
        )}
      </Box>
      <TablePagination
        rowsPerPageOptions={[20, 100, 500, 1000]}
        component="div"
        count={ctx.data.filtered?.length ?? 0}
        rowsPerPage={ctx.data.sheetSearch.limit}
        page={ctx.data.sheetSearch.offset / ctx.data.sheetSearch.limit}
        onPageChange={(event: unknown, newPage: number) => {
          ctx.data.setSheetSearch(prev => ({...prev, offset: newPage * ctx.data.sheetSearch.limit}))
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          ctx.data.setSheetSearch(prev => ({...prev, limit: event.target.value as any}))
        }}
      />
    </Box>
  )
}

