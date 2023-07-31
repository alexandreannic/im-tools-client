import React, {memo} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Box} from '@mui/material'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {SheetHeadContent} from '@/shared/Sheet/SheetHead'

export const KoboDatabaseHead = memo(({
  form,
  sheetSearch,
  filters,
  onOpenColumnConfig,
  onOpenStats,
  langIndex,
}: {
  sheetSearch: any
  filters: any
  onOpenColumnConfig: (_: KoboQuestionSchema, event: any) => void
  onOpenStats: (_: KoboQuestionSchema, event: any) => void
  form: KoboApiForm
  langIndex?: number
}) => {
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
        const active = sortedByThis || filters[q.name]
        return (
          <td key={q.name} className="td-right">
            <SheetHeadContent
              type={q.type}
              active={active}
              onOpenStats={e => onOpenStats(q, e)}
              onOpenConfig={e => onOpenColumnConfig(q, e)}
            />
          </td>
        )
      })}
    </tr>
    </thead>
  )
})