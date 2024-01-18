import {useMemo} from 'react'
import {mapFor, seq} from '@alexandreannic/ts-utils'
import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Utils} from '@/utils/utils'
import {useI18n} from '@/core/i18n'
import {Messages} from '@/core/i18n/localization/en'
import {getKoboLabel} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/KoboSchema/KoboSchemaContext'

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
    }
  }
  return {
    surveyCleaned,
    groupSchemas,
  }
}

export const buildKoboSchemaHelper = ({
  schema,
  m
}: {
  schema: KoboApiForm,
  m: Messages
}) => {
  const customSchema = {
    id: {
      name: 'id',
      label: mapFor(schema.content.translations.length, () => 'ID'),
      type: 'text' as const,
      $kuid: 'id',
      $autoname: 'id',
      $qpath: 'id',
      $xpath: 'id',
    },
    submissionTime: {
      name: 'submissionTime',
      label: mapFor(schema.content.translations.length, () => m.submissionTime),
      type: 'date' as const,
      $kuid: 'submissionTime',
      $autoname: 'submissionTime',
      $qpath: 'submissionTime',
      $xpath: 'submissionTime',
    },
    submittedBy: {
      name: 'submitted_by',
      label: mapFor(schema.content.translations.length, () => m.submittedBy),
      type: 'text' as const,
      $kuid: 'submitted_by',
      $autoname: 'submitted_by',
      $qpath: 'submitted_by',
      $xpath: 'submitted_by',
    },
  }
  const {groupSchemas, surveyCleaned} = isolateGroups(schema.content.survey)

  const sanitizedForm: KoboApiForm = {
    ...schema,
    content: {
      ...schema.content,
      survey: [
        customSchema.id,
        customSchema.submissionTime,
        ...surveyCleaned.map(_ => {
          return {
            ..._,
            label: _.label?.map(_ => Utils.removeHtml(_))
          }
        }),
        customSchema.submittedBy,
      ]
    }
  }

  const choicesIndex = seq(schema.content.choices).groupBy(_ => _.list_name)
  const questionIndex = seq([
    customSchema.id,
    customSchema.submissionTime,
    ...schema.content.survey,
    customSchema.submittedBy,
  ]).reduceObject<Record<string, KoboQuestionSchema>>(_ => [_.name, _])

  const getOptionsByQuestionName = (qName: string) => {
    const listName = questionIndex[qName].select_from_list_name
    return choicesIndex[listName!]
  }

  return {
    groupsCount: Object.keys(groupSchemas).length,
    groupSchemas,
    schema: schema,
    sanitizedSchema: sanitizedForm,
    choicesIndex,
    questionIndex,
    getOptionsByQuestionName,
  }
}

export const getKoboTranslations = ({
  schema,
  langIndex,
  questionIndex,
}: {
  schema: KoboApiForm,
  langIndex: number
  questionIndex: ReturnType<typeof useKoboSchema>['questionIndex']
}): {
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice,
} => {
  const choicesTranslation: Record<string, Record<string, KoboQuestionChoice>> = {}
  schema.content.choices.forEach(choice => {
    if (!choicesTranslation[choice.list_name]) choicesTranslation[choice.list_name] = {}
    choicesTranslation[choice.list_name][choice.name] = choice
  })

  return {
    translateQuestion: (questionName: string) => {
      try {
        return getKoboLabel(questionIndex[questionName], langIndex)
      } catch (e) {
        return questionName
      }
    },
    translateChoice: (questionName: string, choiceName?: string) => {
      const listName = questionIndex[questionName]?.select_from_list_name
      try {
        if (choiceName) return getKoboLabel(choicesTranslation[listName!][choiceName], langIndex)
      } catch (e) {
        // console.warn(
        //   'Cannot translate this options. Maybe the question type has changed?',
        //   {question: questionIndex[questionName], listName, choiceName, choicesTranslation}
        // )
      }
      return ''
    },
  }
}

export type KoboSchemaBundle = ReturnType<typeof buildSchemaBundle>

export const buildSchemaBundle = ({m, schema, langIndex = 0}: {m: Messages, schema: KoboApiForm, langIndex?: number}) => {
  const schemaHelper = buildKoboSchemaHelper({schema: schema, m})
  const {translateQuestion, translateChoice} = getKoboTranslations({
    schema: schema,
    langIndex,
    questionIndex: schemaHelper.questionIndex,
  })
  return {
    schemaUnsanitized: schema,
    schemaHelper: schemaHelper,
    translate: {
      choice: translateChoice,
      question: translateQuestion,
    },
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
