import {useCallback, useEffect, useMemo, useState} from 'react'
import {orderBy} from 'lodash'
import {KeyOf, multipleFilters, paginateData} from '@/utils/utils'
import {Enum} from '@alexandreannic/ts-utils'
import {SheetColumnProps, SheetFilterValue, SheetRow} from '@/shared/Sheet/Sheet'
import {SheetSearch} from '@/shared/Sheet/sheetType'
import {OrderBy} from '@alexandreannic/react-hooks-lib'

export type UseSheetData = ReturnType<typeof useSheetData>

export const useSheetData = <T extends SheetRow>({
  data,
  columnsIndex,
  defaultLimit = 20,
}: {
  defaultLimit?: number
  data?: T[]
  columnsIndex: Record<KeyOf<T>, SheetColumnProps<T>>
}) => {
  const [filters, setFilters] = useState<Record<KeyOf<T>, SheetFilterValue>>({} as any)

  const [search, setSearch] = useState<SheetSearch<any>>({
    limit: defaultLimit,
    offset: 0,
  })

  const onOrderBy = useCallback((columnId: string, orderBy?: OrderBy) => {
    setSearch(prev => ({...prev, orderBy, sortBy: columnId}))
  }, [])

  const filteredData = useMemo(() => {
    if (!data) return
    return multipleFilters(data, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (filter === undefined) return
      const type = columnsIndex[k].type
      const renderValue = columnsIndex[k].renderValue ?? ((_: T) => _[k])
      switch (type) {
        case 'date': {
          return row => {
            const v = renderValue(row) as Date | undefined
            if (!v) return false
            if (!((v as any) instanceof Date)) {
              console.warn(`Value of ${String(k)} is`, v, `but Date expected.`)
              throw new Error(`Value of ${String(k)} is ${v} but Date expected.`)
            }
            const [min, max] = filter as [Date, Date]
            return (!min || v.getTime() >= min.getTime()) && (!max || v.getTime() <= max.getTime())
          }
        }
        case 'select_one': {
          return row => {
            const v = renderValue(row) as string
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
        case 'number': {
          return row => {
            const v = row[k] as number | undefined
            const min = filter[0] as number | undefined
            const max = filter[1] as number | undefined
            return !!v && (!max || v <= max) && (!min || v >= min)
          }
        }
        default: {
          return row => {
            const v = renderValue(row)
            if (!v) return false
            if (typeof v !== 'string' && typeof v !== 'number') {
              console.warn('Value of ${String(k)} is', v)
              throw new Error(`Value of ${String(k)} is ${v} but expected string.`)
            }
            return ('' + v).includes(filter as string)
          }
        }
      }
    }))
  }, [data, filters])

  const filteredAndSortedData = useMemo(() => {
    if (!filteredData) return
    return orderBy(filteredData, search.sortBy, search.orderBy)
  }, [filteredData, search.sortBy, search.orderBy])

  const filteredSortedAndPaginatedData = useMemo(() => {
    if (!filteredAndSortedData) return
    return paginateData<T>(search.limit, search.offset)(filteredAndSortedData)
  }, [search.limit, search.offset, filteredAndSortedData])

  return {
    filters,
    setFilters,
    search,
    setSearch,
    data,
    onOrderBy,
    filteredData,
    filteredAndSortedData,
    filteredSortedAndPaginatedData,
  }
}