import {useAsync} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {KeyOf, Utils} from '@/utils/utils'
import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {getKoboPath, getUnsecureKoboImgUrl} from '@/shared/TableImg/KoboAttachedImg'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {KoboDatabaseBtn} from '@/features/Database/DatabaseTable/koboDatabaseShared'
import React, {useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {useKoboDatabaseContext} from '@/features/Database/DatabaseTable/KoboDatabaseContext'
import {z} from 'zod'

export const KoboDatabaseExportBtn = <T extends KoboMappedAnswer, >({
  data,
  langIndex,
  form,
}: {
  langIndex?: number
  form: KoboApiForm
  data: T[] | undefined
}) => {
  const {m} = useI18n()
  const {translateOption} = useKoboDatabaseContext()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)

  const exportToCSV = () => {
    if (data) {
      _generateXLSFromArray.call({
        filename: Utils.slugify(form.name),
        data: data,
        schema: form.content.survey.map(q => {
          const name = q.name as KeyOf<T>
          return {
            name: q.name,
            render: (row: T) => {
              switch (q.type) {
                case 'start':
                  return row.start
                case 'end':
                  return row.start
                case 'date':
                  return row.end
                case 'image':
                  return map(getKoboPath(row.attachments, row[name] as string), getUnsecureKoboImgUrl)
                case 'select_one':
                  return translateOption({questionName: q.name, choiceName: row[q.name] as string, langIndex})
                case 'select_multiple':
                  return map(row[q.name] as any, (v: string[]) => {
                    return v.map(choiceName => translateOption({questionName: q.name, choiceName, langIndex})).join(' | ')
                  })
                case 'calculate':
                  return map(row[q.name], _ => isNaN(_ as any) ? _ : +_)
                case 'integer':
                  return map(row[q.name], _ => +(_ as string))
                default:
                  return row[q.name] as any
              }
            }
          }
        })
      })
    }
  }
  return (
    <KoboDatabaseBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
  )
}