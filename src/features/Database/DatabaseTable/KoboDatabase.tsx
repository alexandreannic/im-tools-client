import {useI18n} from '@/core/i18n'
import React, {ReactNode, useCallback, useMemo, useState} from 'react'
import {KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Kobo, KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {orderBy} from 'lodash'
import {multipleFilters, paginateData} from '@/utils/utils'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {Enum, map} from '@alexandreannic/ts-utils'
import {Box, TablePagination} from '@mui/material'
import {DatesPopover, MultipleChoicesPopover, NumberChoicesPopover} from '@/features/Database/DatabaseTable/DatabaseSubHeader'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import {AaSelect} from '@/shared/Select/Select'
import {KoboDatabaseType} from '@/features/Database/DatabaseTable/koboDatabaseType'
import {KoboDatabaseHead} from '@/features/Database/DatabaseTable/KoboDatabaseHead'
import {KoboDatabaseBody} from '@/features/Database/DatabaseTable/KoboDatabaseBody'
import {Fender} from 'mui-extension'
import {KoboDatabaseExportBtn} from '@/features/Database/DatabaseTable/KoboDatabaseExportBtn'
import {useKoboDatabaseContext} from '@/features/Database/DatabaseTable/KoboDatabaseContext'
import {KoboRepeatGroupDetails} from '@/features/Database/DatabaseTable/KoboRepeatGroupDetails'
import {endOfDay, startOfDay} from 'date-fns'

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

export const KoboDatabase = (props: {
  data: KoboAnswer<any>[]
  header?: ReactNode
}) => {
  const {sanitizedForm: form, choicesIndex, questionIndex} = useKoboDatabaseContext()
  const {m, formatDate, formatDateTime} = useI18n()
  const [langIndex, setLangIndex] = useState<number>(0)//, `lang-index-${Utils.slugify(form.name)}`)
  const [filters, setFilters] = useState<Record<string, KoboDatabaseType.Filter>>({} as any)
  const [sheetSearch, setSheetSearch] = useState<KoboDatabaseType.Search>({
    limit: 20,
    offset: 0,
    sortBy: 'end',
    orderBy: 'desc',
  })

  const onOrderBy = (columnId: string, orderBy?: OrderBy) => {
    setSheetSearch(prev => ({...prev, orderBy: orderBy ?? prev.orderBy, sortBy: columnId}))
  }

  const [openBeginRepeat, setOpenBeginRepeat] = useState<{
    anchorEl: HTMLElement
    columnId: string
    group: Record<string, any>[]
  } | undefined>()

  const [openFilterPopover, setOpenFilterPopover] = useState<KoboDatabaseType.ColumnConfigPopoverParams | undefined>()
  const [openStatsPopover, setOpenStatsPopover] = useState<KoboDatabaseType.ColumnConfigPopoverParams | undefined>()

  const onOpenBeginRepeat = useCallback((questionName: string, group: Record<string, any>[], event: any) => {
    setOpenBeginRepeat({
      anchorEl: event.currentTarget,
      columnId: questionName,
      group,
    })
  }, [choicesIndex])

  const onOpenStatsConfig = useCallback((q: KoboQuestionSchema, event: any) => {
    // const firstDefinedValue = props.data.find(_ => !!_[columnId])
    // if (isNaN(firstDefinedValue[columnId])) {
    setOpenStatsPopover({
      anchorEl: event.currentTarget,
      columnId: q.name,
      type: q.type,
      options: choicesIndex[q.select_from_list_name!]?.map(_ => ({value: _.name, label: getKoboLabel(_, langIndex)})),
    })
  }, [choicesIndex])

  const onOpenColumnConfig = useCallback((q: KoboQuestionSchema, event: any) => {
    setOpenFilterPopover({
      anchorEl: event.currentTarget,
      columnId: q.name,
      type: q.type,
      options: choicesIndex[q.select_from_list_name!]?.map(_ => ({value: _.name, label: getKoboLabel(_, langIndex)})),
    })
  }, [choicesIndex])

  const mappedData = useMemo(() => {
    return props.data.map(_ => Kobo.mapAnswerBySchema(questionIndex, _))
  }, [props.data])

  const filteredData = useMemo(() => {
    if (!mappedData) return
    return multipleFilters(mappedData, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (filter === undefined) return
      const type = questionIndex[k].type
      switch (type) {
        case 'date':
        case 'start':
        case 'end': {
          return row => {
            const v = row[k] as Date | undefined
            if (!v) return false
            if (!((v as any) instanceof Date)) throw new Error(`Value of ${String(k)} is ${v} but Date expected.`)
            const [_min, _max] = filter as [Date, Date]
            const min = startOfDay(_min)
            const max = endOfDay(_max)
            return (!min || v.getTime() >= min.getTime()) && (!max || v.getTime() <= max.getTime())
          }
        }
        case 'select_one': {
          return row => {
            const v = row[k] as string
            if (!v) return false
            return (filter as string[]).includes(v)
          }
        }
        case 'select_multiple': {
          return row => {
            const v = row[k] as string[]
            const vArray = Array.isArray(v) ? v : [v]
            return !!vArray.find(_ => (filter as string[]).includes(_))
          }
        }
        default: {
          return row => {
            const v = row[k]
            if (!v) return false
            if (typeof v !== 'string') throw new Error(`Value of ${String(k)} is ${v} but expected string.`)
            return v.includes(filter as string)
          }
        }
      }
    }))
  }, [mappedData, filters])

  const filteredAndSortedData = useMemo(() => {
    if (!filteredData) return
    return orderBy(filteredData, sheetSearch.sortBy, sheetSearch.orderBy)
  }, [filteredData, sheetSearch.sortBy, sheetSearch.orderBy])

  const filteredSortedAndPaginatedData = useMemo(() => {
    if (!filteredAndSortedData) return
    return paginateData<KoboMappedAnswer>(sheetSearch.limit, sheetSearch.offset)(filteredAndSortedData)
  }, [sheetSearch.limit, sheetSearch.offset, filteredAndSortedData])

  return (
    <Box>
      <Box sx={{p: 1}}>
        <AaSelect<number>
          sx={{maxWidth: 128, mr: 1}}
          defaultValue={langIndex}
          onChange={setLangIndex}
          options={['xml', ...form.content.translations].map((_, i) => ({children: _, value: i - 1}))}
        />
        <KoboDatabaseExportBtn
          data={filteredAndSortedData}
          form={form}
          langIndex={langIndex}
        />
        {props.header}
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        {map(openFilterPopover, c =>
          <SheetFilterDialog
            title={getKoboLabel(questionIndex[c.columnId], langIndex)}
            anchorEl={c.anchorEl}
            columnId={c.columnId}
            options={c.options}
            type={c.type}
            orderBy={sheetSearch.orderBy}
            sortBy={sheetSearch.sortBy}
            onOrderByChange={_ => onOrderBy(c.columnId, _)}
            value={filters[c.columnId] as any}
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
              setSheetSearch(prev => ({...prev, offset: 0}))
              setOpenFilterPopover(undefined)
            }}
          />
        )}
        {map(openBeginRepeat, c =>
          <KoboRepeatGroupDetails
            anchorEl={c.anchorEl}
            group={c.group}
            form={form}
            onClose={() => setOpenBeginRepeat(undefined)}
          />
        )}
        {map(openStatsPopover, c => {
          console.log('open', c)
          switch (c.type) {
            case 'decimal':
            case 'integer':
              return <NumberChoicesPopover
                anchorEl={c.anchorEl}
                question={c.columnId}
                data={filteredData ?? []}
                onClose={() => setOpenStatsPopover(undefined)}
              />
            case 'date':
            case 'start':
            case 'end':
              return (
                <DatesPopover
                  anchorEl={c.anchorEl}
                  question={c.columnId}
                  data={filteredData ?? []}
                  onClose={() => setOpenStatsPopover(undefined)}
                />
              )
            case 'select_one':
            case 'select_multiple':
            case 'calculate':
              return <MultipleChoicesPopover
                langIndex={langIndex}
                translations={choicesIndex[questionIndex[c.columnId].select_from_list_name!]}
                anchorEl={c.anchorEl}
                multiple={c.type === 'select_multiple'}
                question={c.columnId}
                data={filteredData ?? []}
                onClose={() => setOpenStatsPopover(undefined)}
              />
            default:
              return undefined
          }
        })}
        <table className="table borderY">
          <KoboDatabaseHead
            form={form}
            onOpenStats={onOpenStatsConfig}
            onOpenColumnConfig={onOpenColumnConfig}
            sheetSearch={sheetSearch}
            filters={filters}
            langIndex={langIndex}
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
          {map(filteredSortedAndPaginatedData?.data, _ =>
            <KoboDatabaseBody form={form} data={_} langIndex={langIndex} onOpenBeginRepeat={onOpenBeginRepeat}/>
          )}
        </table>
        {filteredSortedAndPaginatedData?.data.length === 0 && (
          <Fender sx={{my: 2}} title={m.noDataAtm} icon="highlight_off"/>
        )}
      </Box>
      <TablePagination
        rowsPerPageOptions={[20, 100, 500, 1000]}
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
    </Box>
  )
}

