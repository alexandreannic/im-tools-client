import {useKoboDatabasePopover} from '@/features/Database/DatabaseTable/Popover/useKoboDatabasePopover'
import {map} from '@alexandreannic/ts-utils'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import React from 'react'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {KoboRepeatGroupDetailsPopover} from '@/features/Database/DatabaseTable/Popover/KoboRepeatGroupDetailsPopover'
import {DatesPopover, MultipleChoicesPopover, NumberChoicesPopover} from '@/shared/Sheet/SheetPopover'
import {useKoboDatabaseContext} from '@/features/Database/DatabaseTable/Context/KoboDatabaseContext'

export const KoboDatabasePopover = ({
  openStatsPopover,
  openBeginRepeat,
  openFilterPopover,
}: ReturnType<typeof useKoboDatabasePopover>) => {
  const ctx = useKoboDatabaseContext()
  return (
    <>
      {map(openStatsPopover, c => {
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
              translations={choicesIndex[questionIndex[c.columnId].select_from_list_name!].map(_ => ({name: _.name, label: getKoboLabel(_, langIndex)}))}
              anchorEl={c.anchorEl}
              multiple={c.type === 'select_multiple'}
              property={c.columnId}
              data={filteredData ?? []}
              onClose={() => setOpenStatsPopover(undefined)}
            />
          default:
            return undefined
        }
      })}
      {map(openBeginRepeat, c =>
        <KoboRepeatGroupDetailsPopover
          anchorEl={c.anchorEl}
          group={c.group}
          form={form}
          onClose={() => setOpenBeginRepeat(undefined)}
        />
      )}
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
    </>
  )
}