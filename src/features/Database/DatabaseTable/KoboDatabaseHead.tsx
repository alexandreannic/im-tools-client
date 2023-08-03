import React, {memo} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Box} from '@mui/material'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {SheetHeadContent} from '@/shared/Sheet/SheetHead'
import {KoboDatabaseContext, useKoboDatabaseContext} from '@/features/Database/DatabaseTable/Context/KoboDatabaseContext'

export const KoboDatabaseHead = memo(({
  form,
  sheetSearch,
  filters,
  onOpenColumnConfig,
  onOpenStats,
  langIndex,
}: {
  langIndex: number
  sheetSearch: KoboDatabaseContext['data']['sheetSearch']
  filters: KoboDatabaseContext['data']['filters']
  onOpenColumnConfig: (_: KoboQuestionSchema, event: any) => void
  onOpenStats: (_: KoboQuestionSchema, event: any) => void
  form: KoboApiForm
}) => {
  const ctx = useKoboDatabaseContext()
  return (
    <thead>
    <tr className="tr trh">
      {form.content.survey.map(q =>
        <th key={q.name} title={getKoboLabel(q, langIndex)}>
          <Box className="th-resize">
            {getKoboLabel(q, langIndex)}
          </Box>
        </th>
      )}
    </tr>
    <tr>
      {form.content.survey.map(q => {
        const sortedByThis = sheetSearch.sortBy === q.name ?? false
        const active = sortedByThis || !!filters[q.name]
        return (
          <td key={q.name} className="td-right">
            <SheetHeadContent
              type={q.type}
              active={active}
              onOpenStats={e => {
                ctx.popover.filter.onOpen(q, e)
              }}
              onOpenFilter={e => {
                ctx.popover.filter.onOpen(q, e)
              }}
            />
          </td>
        )
      })}
      <td className="td-sticky-end"></td>
    </tr>
    </thead>
  )
})