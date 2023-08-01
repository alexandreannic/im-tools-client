import {useAsync} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray, GenerateXlsFromArrayParams} from '@/shared/Sheet/generateXLSFile'
import {KeyOf, Utils} from '@/utils/utils'
import {Arr, Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {getKoboPath, getUnsecureKoboImgUrl} from '@/shared/TableImg/KoboAttachedImg'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {KoboDatabaseBtn} from '@/features/Database/DatabaseTable/koboDatabaseShared'
import React, {useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {KoboDatabaseContext, useKoboDatabaseContext} from '@/features/Database/DatabaseTable/KoboDatabaseContext'
import {z} from 'zod'
import {render} from 'react-dom'

const renderExportSchema = <T extends KoboMappedAnswer>({
  schema,
  translateOption,
  langIndex,
}: {
  translateOption: KoboDatabaseContext['translateOption']
  schema: KoboQuestionSchema[],
  langIndex?: number
}) => {
  return schema.map(q => {
    return {
      name: getKoboLabel(q, langIndex),
      render: (row: T) => {
        switch (q.type) {
          case 'start':
            return row.start
          case 'end':
            return row.start
          case 'date':
            return row.end
          case 'image':
            return map(getKoboPath(row.attachments, row[q.name] as string), getUnsecureKoboImgUrl)
          case 'select_one': {
            return translateOption({questionName: q.name, choiceName: row[q.name] as string, langIndex})
          }
          case 'select_multiple':
            return map(row[q.name] as any, (v: string[]) => {
              return v.map(choiceName => translateOption({questionName: q.name, choiceName, langIndex})).join(' | ')
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
      const id = form.content.survey.find(_ => _.name === 'id')!
      const groups = form.content.survey.reduce<Record<string, KoboQuestionSchema[]>>((acc, _, i, arr) => {
        if (_.type === 'begin_repeat') {
          const groupQuestion = [id]
          for (let j = i + 1; arr[j].$xpath?.includes(_.name + '/') && j <= arr.length; j++) {
            groupQuestion.push(arr[j])
          }
          acc[_.name] = groupQuestion
        }
        return acc
      }, {} as any)
      _generateXLSFromArray.call(Utils.slugify(form.name), [
        {
          sheetName: Utils.slugify(form.name),
          data: data,
          schema: renderExportSchema({
            schema: form.content.survey,
            langIndex,
            translateOption,
          })
        },
        ...Enum.entries(groups).map(([groupName, questions]) => {
          const _: GenerateXlsFromArrayParams<any> = {
            sheetName: groupName as string,
            data: Arr(data).flatMap(d => (d[groupName] as any[])?.map(_ => ({..._, id: d.id}))).compact(),
            schema: renderExportSchema({
              schema: questions,
              langIndex,
              translateOption,
            })
          }
          return _
        })
      ])
    }
  }
  return (
    <KoboDatabaseBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
  )
}