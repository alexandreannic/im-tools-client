import {KoboApiForm, KoboQuestionSchema, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {useMemo} from 'react'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {ignoredColType} from '@/features/Database/Database'
import {Utils} from '@/utils/utils'

export const useKoboDatabaseHelper = (_form: KoboApiForm) => {
  const {m} = useI18n()
  return useMemo(() => {
    const form = {
      ..._form.content,
      survey: [
        {
          name: 'id',
          label: mapFor(_form.content.translations.length, () => 'ID'),
          type: 'text' as KoboQuestionType,
          $kuid: 'id',
          $autoname: 'id',
          $qpath: 'id',
          $xpath: 'id',
        },
        {
          name: 'submitted_by',
          label: mapFor(_form.content.translations.length, () => m.submittedBy),
          type: 'text' as KoboQuestionType,
          $kuid: 'submitted_by',
          $autoname: 'submitted_by',
          $qpath: 'submitted_by',
          $xpath: 'submitted_by',
        },
        {
          name: 'submission_time',
          label: mapFor(_form.content.translations.length, () => m.submissionTime),
          type: 'date' as KoboQuestionType,
          $kuid: 'submission_time',
          $autoname: 'submission_time',
          $qpath: 'submission_time',
          $xpath: 'submission_time',
        },
        ..._form.content.survey.filter(_ => !ignoredColType.includes(_.type)).map(_ => ({
          ..._,
          label: _.label?.map(_ => Utils.removeHtml(_))
        })),
      ]
    }
    const choicesIndex = Arr(form.choices).groupBy(_ => _.list_name)
    const questionIndex = Arr(form.survey).reduceObject<Record<string, KoboQuestionSchema>>(_ => [_.name, _])
    return {
      form,
      choicesIndex,
      questionIndex,
    }
  }, [_form])
}