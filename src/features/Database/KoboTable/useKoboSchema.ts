import {useMemo} from 'react'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {ignoredColType} from '@/features/Database/Database'
import {Utils} from '@/utils/utils'
import {useI18n} from '@/core/i18n'

export type UseKoboSchema = ReturnType<typeof useKoboSchema>

export const useKoboSchema = ({
  schema
}: {
  schema: KoboApiForm
}) => {
  const {m} = useI18n()
  return useMemo(() => {
    const idSchema = {
      name: 'id',
      label: mapFor(schema.content.translations.length, () => 'ID'),
      type: 'text' as const,
      $kuid: 'id',
      $autoname: 'id',
      $qpath: 'id',
      $xpath: 'id',
    }
    const sanitizedForm: KoboApiForm = {
      ...schema,
      content: {
        ...schema.content,
        survey: [
          idSchema,
          {
            name: 'submission_time',
            label: mapFor(schema.content.translations.length, () => m.submissionTime),
            type: 'date' as const,
            $kuid: 'submission_time',
            $autoname: 'submission_time',
            $qpath: 'submission_time',
            $xpath: 'submission_time',
          },
          ...schema.content.survey.map(_ => ({
            ..._,
            label: _.label?.map(_ => Utils.removeHtml(_))
          })),
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
    const formGroups = schema.content.survey.reduce<Record<string, KoboQuestionSchema[]>>((acc, _, i, arr) => {
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

    return {
      formGroups,
      sanitizedSchema: sanitizedForm,
      choicesIndex,
      questionIndex,
    }
  }, [schema])
}