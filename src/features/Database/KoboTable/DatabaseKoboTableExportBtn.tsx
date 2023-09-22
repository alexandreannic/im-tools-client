import {useAsync} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray, GenerateXlsFromArrayParams} from '@/shared/Sheet/generateXLSFile'
import {Utils} from '@/utils/utils'
import {Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {getKoboPath, getUnsecureKoboImgUrl} from '@/shared/TableImg/KoboAttachedImg'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {UseKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'

const renderExportSchema = <T extends KoboMappedAnswer>({
  schema,
  translateQuestion,
  translateChoice,
  repeatGroupsAsColumns,
  groupSchemas,
  groupIndex,
  groupName,
}: {
  repeatGroupsAsColumns?: boolean
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  schema: KoboQuestionSchema[],
  groupSchemas: Record<string, KoboQuestionSchema[]>
  groupIndex?: number
  groupName?: string
}): GenerateXlsFromArrayParams['schema'] => {
  const getVal = (groupIndex && groupName)
    ? (row: KoboMappedAnswer, name: string) => (row as any)[groupName][groupIndex]?.[name]
    : (row: KoboMappedAnswer, name: string) => row[name]
  return schema.flatMap(q => {
    switch (q.type) {
      case 'start':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => row.start,
        }
      case 'end':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => row.start,
        }
      case 'date':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => getVal(row, q.name),
        }
      case 'image':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => {
            return map(getKoboPath(row.attachments, getVal(row, q.name) as string), getUnsecureKoboImgUrl)
          },
        }
      case 'select_one': {
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => {
            return translateChoice(q.name, getVal(row, q.name) as string)
          },
        }
      }
      case 'select_multiple':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => map(getVal(row, q.name) as any, (v: string[]) => {
            return v.map(choiceName => translateChoice(q.name, choiceName)).join(' | ')
          })
        }
      case 'calculate':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => map(getVal(row, q.name), (_: any) => isNaN(_) ? _ : +_)
        }
      case 'integer':
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => map(getVal(row, q.name), _ => +(_ as string))
        }
      case 'begin_repeat': {
        if (repeatGroupsAsColumns) {
          return mapFor(17, i => renderExportSchema({
            groupSchemas,
            schema: groupSchemas[q.name],
            translateQuestion,
            translateChoice,
            groupIndex: i,
            groupName: q.name,
          })).flat()
        }
        return []
      }
      default:
        return {
          head: groupIndex ? `[${groupIndex}] ${translateQuestion(q.name)}` : translateQuestion(q.name),
          render: (row: T) => getVal(row, q.name) as any,
        }
    }
  })
}

export const DatabaseKoboTableExportBtn = <T extends KoboMappedAnswer, >({
  data,
  form,
  groupSchemas,
  translateQuestion,
  translateChoice,
  repeatGroupsAsColumns,
  ...props
}: {
  repeatGroupsAsColumns?: boolean
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  groupSchemas: UseKoboSchema['groupSchemas']
  form: KoboApiForm
  data: T[] | undefined
} & Pick<AAIconBtnProps, 'sx'>) => {
  const {m} = useI18n()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)

  const exportToCSV = () => {
    if (data) {
      const questionToAddInGroups = form.content.survey.filter(_ => ['id', 'submissionTime', 'start', 'end'].includes(_.name))
      _generateXLSFromArray.call(Utils.slugify(form.name), [
        {
          sheetName: Utils.slugify(form.name),
          data: data,
          schema: renderExportSchema({
            schema: form.content.survey,
            groupSchemas,
            translateQuestion,
            translateChoice,
            repeatGroupsAsColumns,
          })
        },
        ...Enum.entries(groupSchemas).map(([groupName, questions]) => {
          const _: GenerateXlsFromArrayParams<any> = {
            sheetName: groupName as string,
            data: Arr(data).flatMap(d => (d[groupName] as any[])?.map(_ => ({
              ..._,
              id: d.id,
              start: d.start,
              end: d.end,
              submissionTime: d.submissionTime,
            }))).compact(),
            schema: renderExportSchema({
              schema: [...questionToAddInGroups, ...questions],
              groupSchemas,
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
    <AAIconBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} children="download" {...props}/>
  )
}
