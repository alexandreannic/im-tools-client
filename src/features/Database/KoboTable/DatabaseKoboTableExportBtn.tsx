import {useAsync} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray, GenerateXlsFromArrayParams} from '@/shared/Sheet/generateXLSFile'
import {Utils} from '@/utils/utils'
import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {getKoboPath, getUnsecureKoboImgUrl} from '@/shared/TableImg/KoboAttachedImg'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {UseKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {AAIconBtn} from '@/shared/IconBtn'

const renderExportSchema = <T extends KoboMappedAnswer>({
  schema,
  translateQuestion,
  translateChoice,
}: {
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  schema: KoboQuestionSchema[],
}) => {
  return schema.map(q => {
    return {
      name: translateQuestion(q.name),
      render: (row: T) => {
        switch (q.type) {
          case 'start':
            return row.start
          case 'end':
            return row.start
          case 'date':
            return row[q.name]
          case 'image':
            return map(getKoboPath(row.attachments, row[q.name] as string), getUnsecureKoboImgUrl)
          case 'select_one': {
            return translateChoice(q.name, row[q.name] as string)
          }
          case 'select_multiple':
            return map(row[q.name] as any, (v: string[]) => {
              return v.map(choiceName => translateChoice(q.name, choiceName)).join(' | ')
            })
          case 'calculate':
            return map(row[q.name], (_: any) => isNaN(_) ? _ : +_)
          case 'integer':
            return map(row[q.name], _ => +(_ as string))
          default:
            return row[q.name] as any
        }
      }
    }
  })

}
export const DatabaseKoboTableExportBtn = <T extends KoboMappedAnswer, >({
  data,
  form,
  formGroups,
  translateQuestion,
  translateChoice,
}: {
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  formGroups: UseKoboSchema['formGroups']
  form: KoboApiForm
  data: T[] | undefined
}) => {
  const {m} = useI18n()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)

  const exportToCSV = () => {
    if (data) {
      _generateXLSFromArray.call(Utils.slugify(form.name), [
        {
          sheetName: Utils.slugify(form.name),
          data: data,
          schema: renderExportSchema({
            schema: form.content.survey,
            translateQuestion,
            translateChoice,
          })
        },
        ...Enum.entries(formGroups).map(([groupName, questions]) => {
          const _: GenerateXlsFromArrayParams<any> = {
            sheetName: groupName as string,
            data: Arr(data).flatMap(d => (d[groupName] as any[])?.map(_ => ({..._, id: d.id}))).compact(),
            schema: renderExportSchema({
              schema: questions,
              translateQuestion,
              translateChoice,
            })
          }
          return _
        })
      ])
    }
  }
  return (
    <AAIconBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} children="download"/>
  )
}