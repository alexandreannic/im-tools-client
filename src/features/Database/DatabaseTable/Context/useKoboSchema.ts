import {useCallback, useMemo} from 'react'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {ignoredColType} from '@/features/Database/Database'
import {Utils} from '@/utils/utils'
import {useI18n} from '@/core/i18n'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'

export type UseKoboSchema = ReturnType<typeof useKoboSchema>

export const useKoboSchema = ({
  form
}: {
  form: KoboApiForm
}) => {
  const {m} = useI18n()
  return useMemo(() => {
    const idSchema = {
      name: 'id',
      label: mapFor(form.content.translations.length, () => 'ID'),
      type: 'text' as const,
      $kuid: 'id',
      $autoname: 'id',
      $qpath: 'id',
      $xpath: 'id',
    }
    const sanitizedForm: KoboApiForm = {
      ...form,
      content: {
        ...form.content,
        survey: [
          idSchema,
          {
            name: 'submission_time',
            label: mapFor(form.content.translations.length, () => m.submissionTime),
            type: 'date' as const,
            $kuid: 'submission_time',
            $autoname: 'submission_time',
            $qpath: 'submission_time',
            $xpath: 'submission_time',
          },
          ...form.content.survey.filter(_ => !ignoredColType.includes(_.type)).map(_ => ({
            ..._,
            label: _.label?.map(_ => Utils.removeHtml(_))
          })),
          {
            name: 'submitted_by',
            label: mapFor(form.content.translations.length, () => m.submittedBy),
            type: 'text' as const,
            $kuid: 'submitted_by',
            $autoname: 'submitted_by',
            $qpath: 'submitted_by',
            $xpath: 'submitted_by',
          },
        ]
      }
    }
    const formGroups = form.content.survey.reduce<Record<string, KoboQuestionSchema[]>>((acc, _, i, arr) => {
      if (_.type === 'begin_repeat') {
        const groupQuestion: KoboQuestionSchema[] = [idSchema]
        for (let j = i + 1; arr[j].$xpath?.includes(_.name + '/') && j <= arr.length; j++) {
          groupQuestion.push(arr[j])
        }
        acc[_.name] = groupQuestion
      }
      return acc
    }, {} as any)

    const choicesIndex = Arr(sanitizedForm.content.choices).groupBy(_ => _.list_name)
    const questionIndex = Arr(sanitizedForm.content.survey).reduceObject<Record<string, KoboQuestionSchema>>(_ => [_.name, _])

    // const choicesTranslation: Record<string, Record<string, KoboQuestionChoice>> = {}
    // form.content.choices.forEach(choice => {
    //   if (!choicesTranslation[choice.list_name]) choicesTranslation[choice.list_name] = {}
    //   choicesTranslation[choice.list_name][choice.name] = choice
    // })

    // const translateOption = ({questionName, choiceName, langIndex}: {questionName: string, choiceName?: string, langIndex?: number}) => {
    //   const listName = questionIndex[questionName].select_from_list_name
    //   try {
    //     if (choiceName)
    //       return getKoboLabel(choicesTranslation[listName!][choiceName], langIndex)
    //   } catch (e) {
    //     console.warn(
    //       'Cannot translate this options. Maybe the question type has changed?',
    //       {question: questionIndex[questionName], listName, choiceName, choicesTranslation}
    //     )
    //   }
    //   return ''
    // }

    return {
      formGroups,
      sanitizedSchema: sanitizedForm,
      choicesIndex,
      questionIndex,
      // translateOption,
    }
  }, [form])
}