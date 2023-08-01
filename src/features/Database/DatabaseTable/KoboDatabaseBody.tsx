import React, {memo} from 'react'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {map} from '@alexandreannic/ts-utils'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {useKoboDatabaseContext} from '@/features/Database/DatabaseTable/KoboDatabaseContext'

export const KoboDatabaseBody = memo(({
  form,
  data,
  langIndex,
  onOpenBeginRepeat,
}: {
  onOpenBeginRepeat: (questionName: string, group: Record<string, any>[], event: any) => void
  langIndex?: number
  form: KoboApiForm
  data: KoboAnswer<Record<string, any>>[],
}) => {
  const {m} = useI18n()
  const {formatDateTime, formatDate} = useI18n()
  const {translateOption} = useKoboDatabaseContext()
  return (
    <tbody>
    {data.map(row =>
      <tr key={row.id}>
        {form.content.survey.map(q =>
          <td key={q.name}>
            {(() => {
              switch (q.type) {
                case 'image': {
                  return (
                    <KoboAttachedImg attachments={row.attachments} fileName={row[q.name]}/>
                  )
                }
                case 'calculate':
                case 'select_one_from_file':
                case 'username':
                case 'text':
                case 'decimal':
                case 'integer': {
                  return <span title={row[q.name]}>{row[q.name]}</span>
                }
                case 'date':
                case 'today':
                case 'start':
                case 'end': {
                  return map(row[q.name], (_: Date) => (
                    <span title={formatDateTime(_)}>{formatDate(_)}</span>
                  ))
                }
                case 'begin_repeat': {
                  return map(row[q.name], group =>
                    <AaBtn onClick={(e) => onOpenBeginRepeat(q.name, group, e)}>{group.length}</AaBtn>
                  ) ?? <></>
                }
                case 'select_one': {
                  return map(row[q.name], v => {
                    const render = translateOption({questionName: q.name, choiceName: row[q.name], langIndex})
                    if (render)
                      return <span title={render}>{render}</span>
                    return (
                      <span title={row[q.name]}>
                        <TableIcon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} icon="error"/>
                        {row[q.name]}
                      </span>
                    )
                  })
                }
                case 'select_multiple': {
                  return map(row[q.name], (v: string[]) => {
                    const render = v.map(_ => translateOption({questionName: q.name, choiceName: _, langIndex})).join(' | ')
                    return <span title={render}>{render}</span>
                  })
                }
                case 'geopoint': {
                  return map(row[q.name], (x: any) => {
                    const render = JSON.stringify(x)
                    return <span title={render}>{render}</span>
                  })
                }
                default: {
                  const render = JSON.stringify(row[q.name])
                  return <span title={render}>{render}</span>
                }
              }
            })()}
          </td>
        )}
      </tr>
    )}
    </tbody>
  )
})