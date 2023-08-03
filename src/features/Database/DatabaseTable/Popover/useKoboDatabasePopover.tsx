import React, {ReactNode, useCallback, useMemo, useState} from 'react'
import {SheetColumnConfigPopoverParams, SheetPopoverParams} from '@/shared/Sheet/sheetType'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {_Arr} from '@alexandreannic/ts-utils'
import {createPortal} from 'react-dom'
import {SheetFilterDialog} from '@/shared/Sheet/SheetFilterDialog'
import {KoboDatabaseContext} from '@/features/Database/DatabaseTable/Context/KoboDatabaseContext'

// const usePopover = <T, O extends Array<any>>({
//   popoverComponent,
//   handeOpen,
//   deps = [],
// }: {
//   popoverComponent: (t: T, onClose: () => void) => ReactNode
//   // onOpen: (...o: O) => T
//   handeOpen: (...o: O) => T
//   deps?: any[]
// }) => {
//   const [open, setOpen] = useState<O | undefined>()
//   console.log('open', open)
//   const {setPopover} = usePopoverContext()
//   useMemo(() => open && setPopover(popoverComponent(handeOpen(...open), () => setOpen(undefined))), [open])
//   return {
//     open,
//     onOpen: (...o: O) => setOpen(o),
//   }
// }
export const useKoboDatabasePopover = ({
  choicesIndex,
  langIndex,
  form,
  data,
  schema,
}: {
  form: KoboApiForm
  langIndex: number
  choicesIndex: Record<string, _Arr<KoboQuestionChoice>>
  data: KoboDatabaseContext['data']
  schema: KoboDatabaseContext['schema']
}) => {
  const [openFilterPopover, setOpenFilterPopover] = useState<SheetColumnConfigPopoverParams<KoboAnswer, KoboQuestionType> | undefined>()
  const [openStatsPopover, setOpenStatsPopover] = useState<SheetColumnConfigPopoverParams<KoboAnswer, KoboQuestionType> | undefined>()
  const [openBeginRepeat, setOpenBeginRepeat] = useState<SheetPopoverParams & {group: Record<string, any>[]} | undefined>()

  // const onOpenBeginRepeat = useCallback((questionName: string, group: Record<string, any>[], event: any) => {
  //   setOpenBeginRepeat({
  //     anchorEl: event.currentTarget,
  //     columnId: questionName,
  //     group,
  //   })
  // }, [choicesIndex])
  //
  // const onOpenStatsConfig = useCallback((q: KoboQuestionSchema, event: any) => {
  //   setOpenStatsPopover({
  //     anchorEl: event.currentTarget,
  //     columnId: q.name,
  //     type: q.type,
  //     // options: choicesIndex[q.select_from_list_name!]?.map(_ => ({value: _.name, label: getKoboLabel(_, langIndex)})),
  //   })
  // }, [choicesIndex])

  // const onOpenFilterConfig = useCallback((q: KoboQuestionSchema, event: any) => {
  //   setOpenFilterPopover({
  //     anchorEl: event.currentTarget,
  //     columnId: q.name,
  //     type: q.type,
  //     options: choicesIndex[q.select_from_list_name!]?.map(_ => ({value: _.name, label: getKoboLabel(_, langIndex)})),
  //   })
  // }, [choicesIndex])

  return {
    beginRepeat: {
      isOpen: openBeginRepeat,
      onOpen: onOpenBeginRepeat,
      onClose: () => setOpenBeginRepeat(undefined)
    },
    stats: {
      isOpen: openStatsPopover,
      onOpen: onOpenStatsConfig,
      onClose: () => setOpenStatsPopover(undefined)
    },
    filter: {
      isOpen: openFilterPopover,
      onOpen: onOpenFilterConfig,
      onClose: () => setOpenFilterPopover(undefined)
    },
  }
}


// const filter = usePopover({
//   handeOpen: (q: KoboQuestionSchema, event: any) => ({
//     anchorEl: event.currentTarget,
//     columnId: q.name,
//     type: q.type,
//     options: choicesIndex[q.select_from_list_name!]?.map(_ => ({name: _.name, label: getKoboLabel(_, langIndex)})),
//   }),
//   popoverComponent: (c, onClose) => <SheetFilterDialog
//     title={getKoboLabel(schema.questionIndex[c.columnId], langIndex)}
//     anchorEl={c.anchorEl}
//     columnId={c.columnId}
//     options={c.options}
//     type={c.type}
//     orderBy={data.sheetSearch.orderBy}
//     sortBy={data.sheetSearch.sortBy}
//     onOrderByChange={_ => data.onOrderBy(c.columnId, _)}
//     value={data.filters[c.columnId] as any}
//     onClose={onClose}
//     onClear={() => data.setFilters(prev => {
//       if (prev) {
//         delete prev[c.columnId!]
//       }
//       // setFilteringProperty(undefined)
//       return {...prev}
//     })}
//     onChange={(p: string, v: string | string[] | [Date, Date]) => {
//       data.setFilters(_ => ({..._, [p]: v}))
//       data.setSheetSearch(prev => ({...prev, offset: 0}))
//       setOpenFilterPopover(undefined)
//     }}
//   />,
// })
// const filter = usePopover({
//   popoverComponent: SheetFilterDialog,
//   onOpen: (q: KoboQuestionSchema, event: any) => ({
//     anchorEl: event.currentTarget,
//     columnId: q.name,
//     options: choicesIndex[q.select_from_list_name!]?.map(_ => ({name: _.name, label: getKoboLabel(_, langIndex)})),
//     fz: 1
//   })
// })
// const repeatGroup = usePopover({
//   popoverComponent: KoboRepeatGroupDetailsPopover,
//   onOpen: (questionName: string, group: Record<string, any>[], event: any) => ({
//     anchorEl: event.currentTarget,
//     columnId: questionName,
//     group,
//     form,
//     title: questionName,
//   })
// })