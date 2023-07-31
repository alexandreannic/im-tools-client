import {useMemo} from 'react'
import {orderBy} from 'lodash'
import {KeyOf, multipleFilters, paginateData} from '@/utils/utils'
import {Enum} from '@alexandreannic/ts-utils'
import {SheetColumnProps, SheetFilter, SheetRow} from '@/shared/Sheet/Sheet'
import {SheetSearch} from '@/shared/Sheet/sheetType'

export type UseSheetData = ReturnType<typeof useSheetData>

export const useSheetData = <T extends SheetRow>({
  data,
  filters,
  search,
  columnsIndex,
  loading,
}: {
  loading?: boolean
  search: SheetSearch<T>
  filters: Record<KeyOf<T>, SheetFilter>
  data?: T[]
  columnsIndex: Record<KeyOf<T>, SheetColumnProps<T>>
}) => {
  const filteredData = useMemo(() => {
    if (!data) return
    return multipleFilters(data, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (filter === undefined) return
      const type = columnsIndex[k].type
      switch (type) {
        case 'date': {
          return row => {
            const v = row[k] as Date | undefined
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
    loading,
    columnsIndex,
    data,
    filteredData,
    filteredAndSortedData,
    filteredSortedAndPaginatedData
  }
}