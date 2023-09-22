import {useMemo} from 'react'
import {Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {ignoredColType} from '@/features/Database/Database'
import {Utils} from '@/utils/utils'
import {useI18n} from '@/core/i18n'
import {Messages} from '@/core/i18n/localization/en'
import {group} from 'd3-array'

export type KoboSchemaHelper = ReturnType<typeof buildKoboSchemaHelper>

const isolateGroups = (survey: KoboApiForm['content']['survey']) => {
  const surveyCleaned: KoboQuestionSchema[] = []
  const groupSchemas: Record<string, KoboQuestionSchema[]> = {}
  for (let i = 0; i < survey.length; i++) {
    surveyCleaned.push(survey[i])
    if (survey[i].type === 'begin_repeat') {
      const groupname = survey[i].name
      groupSchemas[groupname] = []
      while (survey[i].type !== 'end_repeat') {
        i++
        groupSchemas[groupname].push(survey[i])
      }
      i++
    }
  }
  return {
    surveyCleaned,
    groupSchemas,
  }
}

export const buildKoboSchemaHelper = ({
  schema,
  // repeatAsColumns,
  // repeatAsRows,
  m
}: {
  // repeatAsColumns?: string[]
  // repeatAsRows?: string
  schema: KoboApiForm,
  m: Messages
}) => {
  // const repeatAsColumnsIndex = new Set(repeatAsColumns)
  const idSchema = {
    name: 'id',
    label: mapFor(schema.content.translations.length, () => 'ID'),
    type: 'text' as const,
    $kuid: 'id',
    $autoname: 'id',
    $qpath: 'id',
    $xpath: 'id',
  }

  const submissionTimeSchema = {
    name: 'submissionTime',
    label: mapFor(schema.content.translations.length, () => m.submissionTime),
    type: 'date' as const,
    $kuid: 'submissionTime',
    $autoname: 'submissionTime',
    $qpath: 'submissionTime',
    $xpath: 'submissionTime',
  }

  const {groupSchemas, surveyCleaned} = isolateGroups(schema.content.survey)

  // const groupSchemas = schema.content.survey.reduce<Record<string, KoboQuestionSchema[]>>((acc, _, i, arr) => {
  //   if (_.type === 'begin_repeat') {
  //     const groupQuestion: KoboQuestionSchema[] = [
  //       idSchema,
  //       submissionTimeSchema,
  //     ]
  //     // map(schema.content.survey.find(_ => _.name === 'start'), startSchema => {
  //     //   groupQuestion.push(startSchema)
  //     // })
  //     // map(schema.content.survey.find(_ => _.name === 'end'), endSchema => {
  //     //   groupQuestion.push(endSchema)
  //     // })
  //     for (let j = i + 1; arr[j].$xpath?.includes(_.name + '/') && j <= arr.length; j++) {
  //       groupQuestion.push(arr[j])
  //     }
  //     acc[_.name] = groupQuestion
  //   }
  //   return acc
  // }, {} as any)
  // console.log('schema', isolateGroups(schema.content.survey))

  const sanitizedForm: KoboApiForm = {
    ...schema,
    content: {
      ...schema.content,
      survey: [
        idSchema,
        submissionTimeSchema,
        ...surveyCleaned.map(_ => {
          return {
            ..._,
            label: _.label?.map(_ => Utils.removeHtml(_))
          }
        }),
        {
          name: 'submitted_by',
          label: mapFor(schema.content.translations.length, () => m.submittedBy),
          type: 'text' as const,
          $kuid: 'submitted_by',
          $autoname: 'submitted_by',
          $qpath: 'submitted_by',
          $xpath: 'submitted_by',
        },
      ]
    }
  }

  const choicesIndex = Arr(schema.content.choices).groupBy(_ => _.list_name)
  const questionIndex = Arr(schema.content.survey).reduceObject<Record<string, KoboQuestionSchema>>(_ => [_.name, _])


  return {
    groupsCount: Object.keys(groupSchemas).length,
    groupSchemas,
    sanitizedSchema: sanitizedForm,
    choicesIndex,
    questionIndex,
  }
}

export type UseKoboSchema = ReturnType<typeof useKoboSchema>

export const useKoboSchema = ({
  schema
}: {
  schema: KoboApiForm
}) => {
  const {m} = useI18n()
  return useMemo(() => buildKoboSchemaHelper({schema, m}), [schema])
}