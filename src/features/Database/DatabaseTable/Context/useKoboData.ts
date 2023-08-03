import {useMemo, useState} from 'react'
import {orderBy} from 'lodash'
import {multipleFilters, paginateData} from '@/utils/utils'
import {Kobo, KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Enum, map} from '@alexandreannic/ts-utils'
import {endOfDay, startOfDay} from 'date-fns'
import {KoboDatabaseContext} from '@/features/Database/DatabaseTable/Context/KoboDatabaseContext'
import {SheetFilter, SheetSearch} from '@/shared/Sheet/sheetType'
import {OrderBy} from '@alexandreannic/react-hooks-lib'

export const useKoboData = ({
  data,
  questionIndex,
}: {
  data: KoboAnswer<any>[]
  questionIndex: KoboDatabaseContext['schema']['questionIndex']
}) => {
  const [filters, setFilters] = useState<Record<string, SheetFilter>>({} as any)
  const [sheetSearch, setSheetSearch] = useState<SheetSearch<KoboAnswer>>({
    limit: 20,
    offset: 0,
    sortBy: 'end',
    orderBy: 'desc',
  })

  const onOrderBy = (columnId: string, orderBy?: OrderBy) => {
    setSheetSearch(prev => ({...prev, orderBy: orderBy ?? prev.orderBy, sortBy: columnId}))
  }

  const mapped = useMemo(() => {
    return data.map(_ => Kobo.mapAnswerBySchema(questionIndex, _))
  }, [data])


  const filtered = useMemo(() => {
    if (!mapped) return
    return multipleFilters(mapped, Enum.keys(filters).map(k => {
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
            const min = map(_min, startOfDay)
            const max = map(_max, endOfDay)
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
  }, [mapped, filters])


  const filteredAndSorted = useMemo(() => {
    if (!filtered) return
    return orderBy(filtered, sheetSearch.sortBy, sheetSearch.orderBy)
  }, [filtered, sheetSearch.sortBy, sheetSearch.orderBy])

  const filteredSortedAndPaginated = useMemo(() => {
    if (!filteredAndSorted) return
    return paginateData<KoboMappedAnswer>(sheetSearch.limit, sheetSearch.offset)(filteredAndSorted)
  }, [sheetSearch.limit, sheetSearch.offset, filteredAndSorted])


  return {
    onOrderBy,
    filters,//: Record<string, SheetFilter>
    setFilters,//: Dispatch<SetStateAction<Record<string, SheetFilter>>>
    sheetSearch,//:  SheetSearch<KoboAnswer>
    setSheetSearch,//: Dispatch<SetStateAction<UserSession | undefined>>
    mapped,
    filtered,
    filteredSortedAndPaginated,
    filteredAndSorted,
  }
}