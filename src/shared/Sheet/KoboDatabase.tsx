import {useI18n} from '@/core/i18n'
import React, {memo, useCallback, useMemo, useState} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {orderBy} from 'lodash'
import {multipleFilters, paginateData, Utils} from '@/utils/utils'
import {OrderBy, useAsync} from '@alexandreannic/react-hooks-lib'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {getKoboPath, KoboImg} from '@/shared/TableImg/KoboImg'
import {Box, TablePagination} from '@mui/material'
import {koboDatabaseStyle} from '@/shared/Sheet/SheetStyle'
import {MultipleChoicesPopover, NumberChoicesPopover, SheetIcon} from '@/features/Database/DatabaseSubHeader'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import {useKoboDatabaseHelper} from '@/shared/Sheet/useKoboDatabaseHelper'
import {AaSelect} from '@/shared/Select/Select'
import {KoboDatabaseBtn} from '@/shared/Sheet/koboDatabaseShared'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import {type} from 'os'
import {AAIconBtnProps} from '@/shared/IconBtn'

interface Search {
  limit: number
  offset: number
  sortBy: keyof KoboAnswer
  orderBy: OrderBy
}

type Filter = string
  | string[]
  | [Date | undefined, Date | undefined]
  | [number | undefined, number | undefined]

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number) => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

export const KoboDatabase = (props: {
  form: KoboApiForm
  data: KoboAnswer<any>[]
}) => {
  const {form, choicesIndex, questionIndex} = useKoboDatabaseHelper(props.form)
  const {m, formatDate, formatDateTime} = useI18n()
  const [langIndex, setLangIndex] = useState<number>(0)//, `lang-index-${Utils.slugify(form.name)}`)
  console.log('langIndex', langIndex)
  const [filters, setFilters] = useState<Record<string, Filter>>({} as any)
  const [sheetSearch, setSheetSearch] = useState<Search>({
    limit: 20,
    offset: 0,
    sortBy: 'end',
    orderBy: 'desc',
  })

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

  const [openColumnConfig, setOpenColumnConfig] = useState<{
    anchorEl: HTMLElement
    schema: KoboQuestionSchema
  } | undefined>()

  const [openIntegerChartDialog, setOpenIntegerChartDialog] = useState<{
    anchorEl: HTMLElement
    columnId: string
  } | undefined>()

  const [openSelectChartDialog, setOpenSelectChartDialog] = useState<{
    anchorEl: HTMLElement
    columnId: string
    multiple?: boolean
  } | undefined>()

  const filteredData = useMemo(() => {
    if (!props.data) return
    return multipleFilters(props.data, Enum.keys(filters).map(k => {
      const filter = filters[k]
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
            return !!v.find(_ => (filter as string[]).includes(_))
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
      <AaSelect<number>
        sx={{maxWidth: 128}}
        defaultValue={langIndex}
        onChange={setLangIndex}
        options={['xml', ...form.translations].map((_, i) => ({children: _, value: i - 1}))}
      />
      <KoboDatabaseBtn icon="filter_alt_off" tooltip={m.clearFilter} onClick={() => setFilters({})}/>
      <KoboDatabaseBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
      <Box sx={{overflowX: 'auto'}}>
        {koboDatabaseStyle}
        {map(openColumnConfig, c =>
          <SheetFilterDialog
            anchorEl={c.anchorEl}
            orderBy={sheetSearch.orderBy}
            onOrderByChange={_ => onOrderBy(c.schema.name, _)}
            value={filters[c.schema.name] as any}
            langIndex={langIndex}
            schema={c.schema}
            choicesIndex={choicesIndex}
            form={form}
            onClose={() => setOpenColumnConfig(undefined)}
            onClear={() => setFilters(prev => {
              if (prev) {
                delete prev[c.schema.name!]
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
        <Box component="table" className="table" sx={{minWidth: '100%'}}>
          <TableHead
            setOpenIntegerChartDialog={setOpenIntegerChartDialog}
            setOpenSelectChartDialog={setOpenSelectChartDialog}
            setOpenCalculate={setOpenCalculate}
            form={form}
            setOpenColumnConfig={setOpenColumnConfig}
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
            <TableBody form={form} data={_} langIndex={langIndex}/>
          )}
        </Box>
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

const TableHead = memo(({
  form,
  sheetSearch,
  filters,
  setOpenColumnConfig,
  setOpenIntegerChartDialog,
  setOpenSelectChartDialog,
  langIndex,
  setOpenCalculate,
}: {
  sheetSearch: any
  filters: any
  setOpenColumnConfig: any
  setOpenIntegerChartDialog: any
  setOpenCalculate: any
  setOpenSelectChartDialog: any
  form: KoboApiForm['content'],
  langIndex?: number
}) => {
  return (
    <thead>
    <tr className="tr trh">
      {form.survey.map(q =>
        <th key={q.name}>{getKoboLabel(q, langIndex)}</th>
      )}
    </tr>
    <tr>
      {form.survey.map(q => {
        const sortedByThis = sheetSearch.sortBy === q.name ?? false
        const active = sortedByThis || filters[q.name]
        const commonProps: Partial<AAIconBtnProps> = {
          disabled: true,
          sx: {marginRight: 'auto'},
          tooltip: q.type
        }
        return (
          <td key={q.name} className="td-right">
            <span style={{display: 'flex', justifyContent: 'flex-end'}}>
            {(() => {
              switch (q.type) {
                case 'start':
                case 'end':
                case 'date': {
                  return (
                    <SheetIcon icon="event" {...commonProps}/>
                  )
                }
                case 'select_multiple': {
                  return (
                    <>
                      <SheetIcon icon="check_box" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenSelectChartDialog({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                          multiple: true,
                        })
                      }}/>
                    </>
                  )
                }
                case 'select_one': {
                  return (
                    <>
                      <SheetIcon icon="radio_button_checked" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenSelectChartDialog({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                          multiple: false,
                        })
                      }}/>
                    </>
                  )
                }
                case 'integer': {
                  return (
                    <>
                      <SheetIcon icon="tag" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenIntegerChartDialog({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                        })
                      }}/>
                    </>
                  )
                }
                case 'calculate': {
                  return (
                    <>
                      <SheetIcon icon="functions" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenCalculate({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                        })
                      }}/>
                    </>
                  )
                }
                case 'image': {
                  return (
                    <SheetIcon icon="image" {...commonProps}/>
                  )
                }
                case 'text': {
                  return (
                    <SheetIcon icon="short_text" {...commonProps}/>
                  )
                }
                case 'note': {
                  return (
                    <SheetIcon icon="info" {...commonProps}/>
                  )
                }
                default: {
                  return (
                    q.type
                  )
                }
              }
            })()}
              <SheetIcon color={active ? 'primary' : undefined} icon="filter_alt" onClick={e => {
                setOpenColumnConfig({anchorEl: e.currentTarget, schema: q})
              }}/>
            </span>
          </td>
        )
      })}
    </tr>
    </thead>
  )
})

const TableBody = memo(({
  form,
  data,
  langIndex,
}: {
  langIndex?: number
  form: KoboApiForm['content']
  data: KoboAnswer<Record<string, any>>[],
}) => {
  const {formatDateTime, formatDate} = useI18n()
  const optionsTranslations = useMemo(() => {
    const res: Record<string, Record<string, string>> = {}
    form.choices.forEach(choice => {
      if (!res[choice.list_name]) res[choice.list_name] = {}
      res[choice.list_name][choice.name] = getKoboLabel(choice, langIndex)
    })
    return res
  }, [form, langIndex])
  return (
    <tbody>
    {data.map(row =>
      <tr key={row.id}>
        {form.survey.map(q =>
          <td key={q.name}>
            {fnSwitch(q.type, {
              image: () => (
                <KoboImg attachments={row.attachments} fileName={row[q.name]}/>
              ),
              integer: () => (
                row[q.name]
              ),
              calculate: () => (
                row[q.name]
              ),
              date: () => (
                map(row[q.name], (_: Date) => (
                  <span title={formatDateTime(_)}>{formatDate(_)}</span>
                ))
              ),
              select_one: () => (
                map(row[q.name], v => {
                  return optionsTranslations[q.select_from_list_name!][v]
                })
              ),
              select_multiple: () => (
                map(row[q.name], (v: string) => {
                  const render = v.split(' ').map(_ => optionsTranslations[q.select_from_list_name!][_]).join(' | ')
                  return <span title={render}>{render}</span>
                })
              ),
              select_one_from_file: () => (
                row[q.name]
              ),
              start: () => (
                map(row[q.name], (_: Date) => (
                  <span title={formatDateTime(_)}>{formatDate(_)}</span>
                ))
              ),
              end: () => (
                map(row[q.name], (_: Date) => (
                  <span title={formatDateTime(_)}>{formatDate(_)}</span>
                ))
              ),
            }, type => JSON.stringify(row[q.name]))}
          </td>
        )}
      </tr>
    )}
    </tbody>
  )
})