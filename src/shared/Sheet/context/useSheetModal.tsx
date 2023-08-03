import React, {useCallback} from 'react'
import {useModal} from '@/shared/Modal/useModal'
import {SheetColumnConfigPopoverParams} from '@/shared/Sheet/sheetType'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import {SheetContext} from '@/shared/Sheet/context/SheetContext'
import {SheetColumnProps, SheetRow} from '@/shared/Sheet/Sheet'
import {DatesPopover, MultipleChoicesPopover, NumberChoicesPopover} from '@/shared/Sheet/SheetPopover'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'

export const useSheetModal = <T extends SheetRow>({
  data,
}: {
  data: SheetContext<T>['data']
}) => {
  const [filterPopoverOpen, filterPopoverClose] = useModal((c: SheetColumnConfigPopoverParams<KoboAnswer, KoboQuestionType>) => {
    return (
      <SheetFilterDialog
        title={c.title}
        anchorEl={c.anchorEl}
        columnId={c.columnId}
        options={c.options}
        type={c.type}
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
        onChange={(p: string, v: string | string[] | [Date, Date]) => {
          data.setFilters(_ => ({..._, [p]: v}))
          data.setSearch(prev => ({...prev, offset: 0}))
          filterPopoverClose()
        }}
      />
    )
  })

  const [statsPopoverOpen, statsPopoverClose] = useModal((c: SheetColumnConfigPopoverParams<KoboAnswer, KoboQuestionType>) => {
    switch (c.type) {
      case 'decimal':
      case 'integer':
        return <NumberChoicesPopover
          anchorEl={c.anchorEl}
          question={c.columnId}
          data={data.filteredData ?? []}
          onClose={statsPopoverClose}
        />
      case 'date':
      case 'start':
      case 'end':
        return (
          <DatesPopover
            anchorEl={c.anchorEl}
            question={c.columnId}
            data={data.filteredData ?? []}
            onClose={statsPopoverClose}
          />
        )
      case 'select_one':
      case 'select_multiple':
      case 'calculate':
        return <MultipleChoicesPopover
          translations={c.options}
          anchorEl={c.anchorEl}
          multiple={c.type === 'select_multiple'}
          property={c.columnId}
          data={data.filteredData ?? []}
          onClose={statsPopoverClose}
        />
      default:
        return undefined
    }
  })


  const _filterPopoverOpen = useCallback((a: SheetColumnProps<T>, e: any) => filterPopoverOpen({
    type: a.type!,
    columnId: a.id,
    title: a.head,
    anchorEl: e.currentTarget,
    options: a.options,
  }), [])

  const _statsPopoverOpen = useCallback((a: SheetColumnProps<T>, e: any) => statsPopoverOpen({
    type: a.type!,
    columnId: a.id,
    title: a.head,
    anchorEl: e.currentTarget,
    options: a.options,
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