import React, {useCallback} from 'react'
import {useModal} from '@/shared/Modal/useModal'
import {SheetColumnConfigPopoverParams, SheetOptions} from '@/shared/Sheet/sheetType'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import {SheetContext} from '@/shared/Sheet/context/SheetContext'
import {SheetColumnProps, SheetFilterValue, SheetRow} from '@/shared/Sheet/Sheet'
import {DatesPopover, MultipleChoicesPopover, NumberChoicesPopover} from '@/shared/Sheet/SheetPopover'
import {useMap2} from '@/alexlib-labo/useMap'

export const useSheetModal = <T extends SheetRow>({
  data,
}: {
  data: SheetContext<T>['data']
}) => {
  const optionsRef = useMap2<string, SheetOptions[]>()

  const getOption = useCallback((columnId: string, options?: () => SheetOptions[]) => {
    if (!options) return
    if (!optionsRef.has(columnId))
      optionsRef.set(columnId, options())
    return optionsRef.get(columnId)
  }, [optionsRef.keys])

  const [filterPopoverOpen, filterPopoverClose] = useModal((c: SheetColumnConfigPopoverParams) => {
    return (
      <SheetFilterDialog
        data={data.filteredData ?? []}
        title={c.title}
        anchorEl={c.anchorEl}
        columnId={c.columnId}
        options={c.options}
        type={c.type!}
        orderBy={data.search.orderBy}
        sortBy={data.search.sortBy}
        onOrderByChange={_ => data.onOrderBy(c.columnId, _)}
        value={data.filters[c.columnId] as any}
        onClose={filterPopoverClose}
        onClear={() => data.setFilters(prev => {
          if (prev) {
            delete prev[c.columnId!]
          }
          // setFilteringProperty(undefined)
          return {...prev}
        })}
        onChange={(p: string, v: SheetFilterValue) => {
          data.setFilters(_ => ({..._, [p]: v}))
          data.setSearch(prev => ({...prev, offset: 0}))
          filterPopoverClose()
        }}
      />
    )
  }, [data.search, data.filters])

  const [statsPopoverOpen, statsPopoverClose] = useModal((c: SheetColumnConfigPopoverParams & {renderValue?: SheetColumnProps<T>['renderValue']}) => {
    const getValue = c.renderValue ?? (_ => _[c.columnId])
    switch (c.type) {
      case 'number':
        return <NumberChoicesPopover
          anchorEl={c.anchorEl}
          question={c.columnId}
          mapValues={getValue}
          data={data.filteredData ?? []}
          onClose={statsPopoverClose}
        />
      case 'date':
        return (
          <DatesPopover
            anchorEl={c.anchorEl}
            title={c.title}
            getValue={getValue}
            data={data.filteredData as T[] ?? []}
            onClose={statsPopoverClose}
          />
        )
      default: {
        if (c.options)
          return <MultipleChoicesPopover
            translations={c.options}
            anchorEl={c.anchorEl}
            multiple={c.type === 'select_multiple'}
            getValue={getValue}
            title={c.title}
            data={data.filteredData as T[] ?? []}
            onClose={statsPopoverClose}
          />
        return undefined
      }
    }
  }, [data.filteredData])


  const _filterPopoverOpen = useCallback((a: SheetColumnProps<T>, e: any) => filterPopoverOpen({
    type: a.type!,
    columnId: a.id,
    title: a.head ?? a.id,
    anchorEl: e.currentTarget,
    options: getOption(a.id, a.options),
  }), [])

  const _statsPopoverOpen = useCallback((a: SheetColumnProps<T>, e: any) => statsPopoverOpen({
    type: a.type!,
    columnId: a.id,
    renderValue: a.renderValue,
    title: a.head ?? a.id,
    anchorEl: e.currentTarget,
    options: getOption(a.id, a.options),
  }), [])

  return {
    statsPopover: {
      open: _statsPopoverOpen,
      close: statsPopoverClose,
    },
    filterPopover: {
      open: _filterPopoverOpen,
      close: filterPopoverClose,
    }
  }
}