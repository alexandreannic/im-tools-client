import React, {memo} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Box} from '@mui/material'
import {AAIconBtnProps} from '@/shared/IconBtn'
import {SheetIcon} from '@/features/Database/DatabaseTable/DatabaseSubHeader'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'

export const KoboDatabaseHead = memo(({
  form,
  sheetSearch,
  filters,
  onOpenColumnConfig,
  onOpenStats,
  // setOpenIntegerChartDialog,
  // setOpenSelectChartDialog,
  langIndex,
  // setOpenCalculate,
}: {
  sheetSearch: any
  filters: any
  onOpenColumnConfig: (_: KoboQuestionSchema, event: any) => void
  onOpenStats: (_: KoboQuestionSchema, event: any) => void
  // setOpenColumnConfig: Dispatch<SetStateAction<KoboDatabase.ColumnConfigPopoverParams | undefined>>
  // setOpenIntegerChartDialog: any
  // setOpenCalculate: any
  // setOpenSelectChartDialog: any
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
        const commonProps: Partial<AAIconBtnProps> = {
          disabled: true,
          sx: {marginRight: 'auto'},
          tooltip: q.type
        }
        return (
          <td key={q.name} className="td-right">
            <span style={{display: 'flex', justifyContent: 'flex-end'}}>
            {(() => {
              switch (q.type) {
                case 'start':
                case 'end':
                case 'date':
                  return <SheetIcon icon="event" {...commonProps}/>

                case 'select_multiple': {
                  return <SheetIcon icon="check_box" {...commonProps}/>
                }
                case 'select_one': {
                  return <SheetIcon icon="radio_button_checked" {...commonProps}/>
                }
                case 'decimal':
                case 'integer': {
                  return <SheetIcon icon="tag" {...commonProps}/>
                }
                case 'calculate': {
                  return <SheetIcon icon="functions" {...commonProps}/>
                }
                case 'begin_repeat': {
                  return <SheetIcon icon="repeat" {...commonProps}/>
                }
                case 'select_one_from_file': {
                  return <SheetIcon icon="attach_file" {...commonProps}/>
                }
                case 'image': {
                  return <SheetIcon icon="image" {...commonProps}/>
                }
                case 'text': {
                  return <SheetIcon icon="short_text" {...commonProps}/>
                }
                case 'note': {
                  return <SheetIcon icon="info" {...commonProps}/>
                }
                default: {
                  return q.type
                }
              }
            })()}
              {['calculate', 'integer', 'decimal', 'select_multiple', 'select_one', 'start', 'end', 'date',].includes(q.type) && (
                <SheetIcon icon="bar_chart" onClick={e => onOpenStats(q, e)}/>
              )}
              <SheetIcon
                color={active ? 'primary' : undefined}
                icon="filter_alt"
                onClick={e => onOpenColumnConfig(q, e)}
              />
            </span>
          </td>
        )
      })}
    </tr>
    </thead>
  )
})