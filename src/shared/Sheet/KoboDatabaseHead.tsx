import React, {memo} from 'react'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Box} from '@mui/material'
import {AAIconBtnProps} from '@/shared/IconBtn'
import {SheetIcon} from '@/features/Database/DatabaseSubHeader'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {getKoboLabel} from '@/shared/Sheet/KoboDatabase'

export const KoboDatabaseHead = memo(({
  form,
  sheetSearch,
  filters,
  onOpenColumnConfig,
  setOpenIntegerChartDialog,
  setOpenSelectChartDialog,
  langIndex,
  setOpenCalculate,
}: {
  sheetSearch: any
  filters: any
  onOpenColumnConfig: (_: KoboQuestionSchema, event: any) => void
  // setOpenColumnConfig: Dispatch<SetStateAction<KoboDatabase.ColumnConfigPopoverParams | undefined>>
  setOpenIntegerChartDialog: any
  setOpenCalculate: any
  setOpenSelectChartDialog: any
  form: KoboApiForm['content'],
  langIndex?: number
}) => {
  return (
    <thead>
    <tr className="tr trh">
      {form.survey.map(q =>
        <th key={q.name} title={getKoboLabel(q, langIndex)}>
          <Box className="th-resize">
            {getKoboLabel(q, langIndex)}
          </Box>
        </th>
      )}
    </tr>
    <tr>
      {form.survey.map(q => {
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
                case 'date': {
                  return (
                    <SheetIcon icon="event" {...commonProps}/>
                  )
                }
                case 'select_multiple': {
                  return (
                    <>
                      <SheetIcon icon="check_box" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenSelectChartDialog({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                          multiple: true,
                        })
                      }}/>
                    </>
                  )
                }
                case 'select_one': {
                  return (
                    <>
                      <SheetIcon icon="radio_button_checked" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenSelectChartDialog({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                          multiple: false,
                        })
                      }}/>
                    </>
                  )
                }
                case 'integer': {
                  return (
                    <>
                      <SheetIcon icon="tag" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenIntegerChartDialog({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                        })
                      }}/>
                    </>
                  )
                }
                case 'calculate': {
                  return (
                    <>
                      <SheetIcon icon="functions" {...commonProps}/>
                      <SheetIcon icon="bar_chart" onClick={e => {
                        setOpenCalculate({
                          anchorEl: e.currentTarget,
                          columnId: q.name,
                        })
                      }}/>
                    </>
                  )
                }
                case 'begin_repeat': {
                  return (
                    <SheetIcon icon="repeat" {...commonProps}/>
                  )
                }
                case 'select_one_from_file': {
                  return (
                    <SheetIcon icon="attach_file" {...commonProps}/>
                  )
                }
                case 'image': {
                  return (
                    <SheetIcon icon="image" {...commonProps}/>
                  )
                }
                case 'text': {
                  return (
                    <SheetIcon icon="short_text" {...commonProps}/>
                  )
                }
                case 'note': {
                  return (
                    <SheetIcon icon="info" {...commonProps}/>
                  )
                }
                default: {
                  return (
                    q.type
                  )
                }
              }
            })()}
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