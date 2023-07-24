import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import React, {ReactNode, useContext, useMemo} from 'react'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {ignoredColType} from '@/features/Database/Database'
import {Utils} from '@/utils/utils'

export interface KoboDatabaseContext {
  sanitizedForm: KoboApiForm['content']
  choicesIndex: Record<string, KoboQuestionChoice[]>
  questionIndex: Record<string, KoboQuestionSchema>
}

const _KoboDatabaseContext = React.createContext({} as KoboDatabaseContext)

export const useKoboDatabaseContext = () => useContext<KoboDatabaseContext>(_KoboDatabaseContext)

export const KoboDatabaseProvider = ({
  children,
  form
}: {
  form: KoboApiForm
  children: ReactNode
}) => {
  const {m} = useI18n()
  const helper = useMemo(() => {
    const sanitizedForm = {
      ...form.content,
      survey: [
        {
          name: 'id',
          label: mapFor(form.content.translations.length, () => 'ID'),
          type: 'text' as KoboQuestionType,
          $kuid: 'id',
          $autoname: 'id',
          $qpath: 'id',
          $xpath: 'id',
        },
        {
          name: 'submission_time',
          label: mapFor(form.content.translations.length, () => m.submissionTime),
          type: 'date' as KoboQuestionType,
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
          type: 'text' as KoboQuestionType,
          $kuid: 'submitted_by',
          $autoname: 'submitted_by',
          $qpath: 'submitted_by',
          $xpath: 'submitted_by',
        },
      ]
    }
    const choicesIndex = Arr(sanitizedForm.choices).groupBy(_ => _.list_name)
    const questionIndex = Arr(sanitizedForm.survey).reduceObject<Record<string, KoboQuestionSchema>>(_ => [_.name, _])
    return {
      sanitizedForm,
      choicesIndex,
      questionIndex,
    }
  }, [form])

  return (
    <_KoboDatabaseContext.Provider value={helper}>
      {children}
    </_KoboDatabaseContext.Provider>
  )
}
