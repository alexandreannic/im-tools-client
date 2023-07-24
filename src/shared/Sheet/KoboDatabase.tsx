import {useI18n} from '@/core/i18n'
import React, {ReactNode, useCallback, useMemo, useState} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {orderBy} from 'lodash'
import {multipleFilters, paginateData, Utils} from '@/utils/utils'
import {OrderBy, useAsync} from '@alexandreannic/react-hooks-lib'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {getKoboPath} from '@/shared/TableImg/KoboAttachedImg'
import {Box, TablePagination} from '@mui/material'
import {koboDatabaseStyle} from '@/shared/Sheet/SheetStyle'
import {MultipleChoicesPopover, NumberChoicesPopover} from '@/features/Database/DatabaseSubHeader'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import {useKoboDatabaseHelper} from '@/shared/Sheet/useKoboDatabaseHelper'
import {AaSelect} from '@/shared/Select/Select'
import {KoboDatabaseBtn, koboTypeToFilterType} from '@/shared/Sheet/koboDatabaseShared'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import {KoboDatabaseType} from '@/shared/Sheet/koboDatabaseType'
import {KoboDatabaseHead} from '@/shared/Sheet/KoboDatabaseHead'
import {KoboDatabaseBody} from '@/shared/Sheet/KoboDatabaseBody'
import {Fender} from 'mui-extension'

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

export const KoboDatabase = (props: {
  form: KoboApiForm
  data: KoboAnswer<any>[]
  header?: ReactNode
}) => {
  const {form, choicesIndex, questionIndex} = useKoboDatabaseHelper(props.form)
  const {m, formatDate, formatDateTime} = useI18n()
  const [langIndex, setLangIndex] = useState<number>(0)//, `lang-index-${Utils.slugify(form.name)}`)
  const [filters, setFilters] = useState<Record<string, KoboDatabaseType.Filter>>({} as any)
  const [sheetSearch, setSheetSearch] = useState<KoboDatabaseType.Search>({
    limit: 20,
    offset: 0,
    sortBy: 'end',
    orderBy: 'desc',
  })

  console.log('langIndex', langIndex)

  const _generateXLSFromArray = useAsync(generateXLSFromArray)

  const onOrderBy = (columnId: string, orderBy?: OrderBy) => {
    setSheetSearch(prev => ({...prev, orderBy: orderBy ?? prev.orderBy, sortBy: columnId}))
  }

  const setOpenCalculate = useCallback(({
    anchorEl,
    columnId,
  }: {
    anchorEl: HTMLElement
    columnId: string
  }) => {
    const firstDefinedValue = props.data.find(_ => !!_[columnId])
    if (isNaN(firstDefinedValue[columnId])) {
      setOpenSelectChartDialog({anchorEl, columnId})
    } else {
      setOpenIntegerChartDialog({anchorEl, columnId})
    }
  }, [form])

  const [openBeginRepeat, setOpenBeginRepeat] = useState<{
    anchorEl: HTMLElement
    group: Record<string, any>[]
  } | undefined>()

  const [openColumnConfig, setOpenColumnConfig] = useState<KoboDatabaseType.ColumnConfigPopoverParams | undefined>()

  const [openIntegerChartDialog, setOpenIntegerChartDialog] = useState<KoboDatabaseType.PopoverParams | undefined>()

  const [openSelectChartDialog, setOpenSelectChartDialog] = useState<KoboDatabaseType.SelectChartPopoverParams | undefined>()

  const onOpenColumnConfig = (q: KoboQuestionSchema, event: any) => {
    setOpenColumnConfig({
      anchorEl: event.currentTarget,
      columnId: q.name,
      type: koboTypeToFilterType(q.type),
      options: choicesIndex[q.select_from_list_name!]?.map(_ => ({value: _.name, label: getKoboLabel(_, langIndex)})),
    })
  }
  const filteredData = useMemo(() => {
    if (!props.data) return
    return multipleFilters(props.data, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (filter === undefined) return
      const type = questionIndex[k].type
      switch (type) {
        case 'date':
        case 'start':
        case 'end': {
          return row => {
            const v = row[k]
            if (!v) return false
            if (!((v as any) instanceof Date)) throw new Error(`Value of ${String(k)} is ${v} but Date expected.`)
            const [min, max] = filter as [Date, Date]
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
  }, [props.data, filters])

  const filteredAndSortedData = useMemo(() => {
    if (!filteredData) return
    return orderBy(filteredData, sheetSearch.sortBy, sheetSearch.orderBy)
  }, [filteredData, sheetSearch.sortBy, sheetSearch.orderBy])

  const filteredSortedAndPaginatedData = useMemo(() => {
    if (!filteredAndSortedData) return
    return paginateData<KoboAnswer>(sheetSearch.limit, sheetSearch.offset)(filteredAndSortedData)
  }, [sheetSearch.limit, sheetSearch.offset, filteredAndSortedData])

  const exportToCSV = () => {
    if (filteredAndSortedData) {
      _generateXLSFromArray.call({
        filename: Utils.slugify(props.form.name),
        data: props.data,
        schema: form.survey.map(q => {
          return {
            name: q.name,
            render: (row: any) => fnSwitch(q.type, {
              start: () => row.start,
              end: () => row.start,
              date: () => row.end,
              image: () => map(getKoboPath(row[q.name]), getKoboImagePath),
              select_one: () => getKoboLabel(row, langIndex),
              select_multiple: () => getKoboLabel(row, langIndex),
              calculate: () => map(row[q.name], _ => isNaN(_) ? _ : +_),
              integer: () => map(row[q.name], _ => +_),
            }, () => row[q.name])
          }
        })
      })
    }
  }

  return (
    <Box>
      <Box sx={{p: 1}}>
        <AaSelect<number>
          sx={{maxWidth: 128, mr: 1}}
          defaultValue={langIndex}
          onChange={setLangIndex}
          options={['xml', ...form.translations].map((_, i) => ({children: _, value: i - 1}))}
        />
        <KoboDatabaseBtn icon="filter_alt_off" tooltip={m.clearFilter} onClick={() => setFilters({})}/>
        <KoboDatabaseBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
        {props.header}
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        {map(openColumnConfig, c =>
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
              setSheetSearch(prev => ({...prev, offset: 0}))
              setOpenColumnConfig(undefined)
            }}
          />
        )}
        {map(openBeginRepeat, c =>
          <Box></Box>
        )}
        {map(openIntegerChartDialog, c =>
          <NumberChoicesPopover
            anchorEl={c.anchorEl}
            question={c.columnId}
            data={filteredData ?? []}
            onClose={() => setOpenIntegerChartDialog(undefined)}
          />
        )}
        {map(openSelectChartDialog, c =>
          <MultipleChoicesPopover
            langIndex={langIndex}
            translations={choicesIndex[questionIndex[c.columnId].select_from_list_name!]}
            anchorEl={c.anchorEl}
            question={c.columnId}
            data={filteredData ?? []}
            onClose={() => setOpenSelectChartDialog(undefined)}
          />
        )}
        <table className="table borderY">
          <KoboDatabaseHead
            setOpenIntegerChartDialog={setOpenIntegerChartDialog}
            setOpenSelectChartDialog={setOpenSelectChartDialog}
            setOpenCalculate={setOpenCalculate}
            form={form}
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
            <KoboDatabaseBody form={form} data={_} langIndex={langIndex} setOpenBeginRepeat={setOpenBeginRepeat}/>
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

