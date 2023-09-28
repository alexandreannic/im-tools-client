import {useCallback, useMemo, useState} from 'react'
import {orderBy} from 'lodash'
import {KeyOf, multipleFilters, paginateData, Utils} from '@/utils/utils'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {
  SheetColumnProps,
  SheetFilterValue,
  SheetFilterValueDate,
  SheetFilterValueNumber,
  SheetFilterValueSelect,
  SheetFilterValueString,
  SheetRow,
  SheetUtils
} from '@/shared/Sheet/Sheet'
import {SheetSearch} from '@/shared/Sheet/sheetType'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import safeNumber = Utils.safeNumber

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

  const getValueGetter = (colName: string) => {
    return SheetUtils.getValueGetter(columnsIndex[colName], colName)
  }

  const filteredData = useMemo(() => {
    if (!data) return
    return multipleFilters(data, Enum.keys(filters).map(k => {
      const filter = filters[k]
      if (filter === undefined) return
      const type = columnsIndex[k].type
      const getValue = getValueGetter(k)
      switch (type) {
        case 'date': {
          return row => {
            const typedFilter = filter as SheetFilterValueDate
            const v = getValue(row) as Date | undefined
            if (v === undefined) return false
            if (!((v as any) instanceof Date)) {
              console.warn(`Value of ${String(k)} is`, v, `but Date expected.`)
              throw new Error(`Value of ${String(k)} is ${v} but Date expected.`)
            }
            const [min, max] = typedFilter
            return (!min || v.getTime() >= min.getTime()) && (!max || v.getTime() <= max.getTime())
          }
        }
        case 'select_one': {
          return row => {
            const typedFilter = filter as SheetFilterValueSelect
            const v = getValue(row) as string
            if (v === undefined) return false
            return (typedFilter).includes(v)
          }
        }
        case 'select_multiple': {
          return row => {
            const typedFilter = filter as SheetFilterValueSelect
            const v = row[k] as string[]
            const vArray = Array.isArray(v) ? v : [v]
            return !!vArray.find(_ => (typedFilter).includes(_))
          }
        }
        case 'number': {
          return row => {
            const typedFilter = filter as SheetFilterValueNumber
            const v = row[k] as number | undefined
            const min = typedFilter[0] as number | undefined
            const max = typedFilter[1] as number | undefined
            return !!v && (!max || v <= max) && (!min || v >= min)
          }
        }
        default: {
          return row => {
            const typedFilter = filter as SheetFilterValueString
            const v = getValue(row)
            if (v === undefined && typedFilter?.filterBlank !== false) return false
            if (typedFilter?.value === undefined) return true
            if (typeof v !== 'string' && typeof v !== 'number') {
              console.warn('Value of ${String(k)} is', v)
              throw new Error(`Value of ${String(k)} is ${v} but expected string.`)
            }
            return ('' + v).includes(typedFilter.value)
          }
        }
      }
    }))
  }, [data, filters])

  const filteredAndSortedData = useMemo(() => {
    return map(filteredData, search.sortBy, (d, sortBy) => {
      const columnInfo = columnsIndex[sortBy]
      const sorted = d.sort(fnSwitch(columnInfo.type!, {
        number: () => (a: T, b: T) => {
          const av = safeNumber(getValueGetter(sortBy)(a), Number.MIN_SAFE_INTEGER)
          const bv = safeNumber(getValueGetter(sortBy)(b), Number.MIN_SAFE_INTEGER)
          return (av - bv) * (search.orderBy === 'asc' ? -1 : 1)
        },
        date: () => (a: T, b: T) => {
          try {
            const av = getValueGetter(sortBy)(a)?.getTime() ?? 0
            const bv = getValueGetter(sortBy)(b)?.getTime() ?? 0
            return (av - bv) * (search.orderBy === 'asc' ? -1 : 1)
          } catch (e) {
            console.warn('Invalid date', getValueGetter(sortBy)(a))
            return -1
          }
        },
      }, () => (a: T, b: T) => {
        const av = ('' + getValueGetter(sortBy)(a)) ?? ''
        const bv = ('' + getValueGetter(sortBy)(b)) ?? ''
        return av.localeCompare(bv) * (search.orderBy === 'asc' ? -1 : 1)
      }))
      return [...sorted]
    }) ?? filteredData
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