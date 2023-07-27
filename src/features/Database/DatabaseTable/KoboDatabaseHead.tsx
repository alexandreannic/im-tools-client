import React, {memo} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Box} from '@mui/material'
import {AAIconBtnProps} from '@/shared/IconBtn'
import {SheetIconBtn} from '@/features/Database/DatabaseTable/DatabaseSubHeader'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'

import {TableIcon, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'

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
        const commonProps: Partial<TableIconProps> = {
          color: 'disabled',
          sx: {marginRight: 'auto'},
          tooltip: q.type
        }
        return (
          <td key={q.name} className="td-right">
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
            {(() => {
              switch (q.type) {
                case 'start':
                case 'end':
                case 'today':
                case 'date':
                  return <TableIcon children="event" {...commonProps}/>
                case 'geopoint':
                  return <TableIcon children="location_on" {...commonProps}/>
                case 'username':
                  return <TableIcon children="person" {...commonProps}/>
                case 'select_multiple': {
                  return <TableIcon children="check_box" {...commonProps}/>
                }
                case 'select_one': {
                  return <TableIcon children="radio_button_checked" {...commonProps}/>
                }
                case 'decimal':
                case 'integer': {
                  return <TableIcon children="tag" {...commonProps}/>
                }
                case 'calculate': {
                  return <TableIcon children="functions" {...commonProps}/>
                }
                case 'begin_repeat': {
                  return <TableIcon children="repeat" {...commonProps}/>
                }
                case 'select_one_from_file': {
                  return <TableIcon children="attach_file" {...commonProps}/>
                }
                case 'image': {
                  return <TableIcon children="image" {...commonProps}/>
                }
                case 'text': {
                  return <TableIcon children="short_text" {...commonProps}/>
                }
                case 'note': {
                  return <TableIcon children="info" {...commonProps}/>
                }
                default: {
                  return q.type
                }
              }
            })()}
              {['calculate', 'integer', 'decimal', 'select_multiple', 'select_one', 'start', 'end', 'date',].includes(q.type) && (
                <SheetIconBtn icon="bar_chart" onClick={e => onOpenStats(q, e)}/>
              )}
              <SheetIconBtn
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