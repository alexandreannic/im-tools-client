import React, {Dispatch, memo, SetStateAction, useMemo} from 'react'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {map} from '@alexandreannic/ts-utils'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'

export const KoboDatabaseBody = memo(({
  form,
  data,
  langIndex,
  onOpenBeginRepeat,
}: {
  onOpenBeginRepeat: (questionName: string, group: Record<string, any>[], event: any) => void
  langIndex?: number
  form: KoboApiForm['content']
  data: KoboAnswer<Record<string, any>>[],
}) => {
  const {formatDateTime, formatDate} = useI18n()
  const optionsTranslations = useMemo(() => {
    const res: Record<string, Record<string, string>> = {}
    form.choices.forEach(choice => {
      if (!res[choice.list_name]) res[choice.list_name] = {}
      res[choice.list_name][choice.name] = getKoboLabel(choice, langIndex)
    })
    return res
  }, [form, langIndex])

  return (
    <tbody>
    {data.map(row =>
      <tr key={row.id}>
        {form.survey.map(q =>
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
                case 'text':
                case 'integer': {
                  return <span title={row[q.name]}>{row[q.name]}</span>
                }
                case 'date':
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
                    const render = optionsTranslations[q.select_from_list_name!][v]
                    return <span title={render}>{render}</span>
                  })
                }
                case 'select_multiple': {
                  return map(row[q.name], (v: string[]) => {
                    const render = v.map(_ => optionsTranslations[q.select_from_list_name!][_]).join(' | ')
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