import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import React, {ReactNode, useContext, useMemo} from 'react'
import {Arr, mapFor} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {ignoredColType} from '@/features/Database/Database'
import {Utils} from '@/utils/utils'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'

export interface KoboDatabaseContext {
  sanitizedForm: KoboApiForm
  choicesIndex: Record<string, KoboQuestionChoice[]>
  questionIndex: Record<string, KoboQuestionSchema>
  translateOption: (_: {questionName: string, choiceName?: string, langIndex?: number}) => string | ''
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
    const sanitizedForm: KoboApiForm = {
      ...form,
      content: {
        ...form.content,
        survey: [
          {
            name: 'id',
            label: mapFor(form.content.translations.length, () => 'ID'),
            type: 'text' as const,
            $kuid: 'id',
            $autoname: 'id',
            $qpath: 'id',
            $xpath: 'id',
          },
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
    const choicesIndex = Arr(sanitizedForm.content.choices).groupBy(_ => _.list_name)
    const questionIndex = Arr(sanitizedForm.content.survey).reduceObject<Record<string, KoboQuestionSchema>>(_ => [_.name, _])
    return {
      sanitizedForm,
      choicesIndex,
      questionIndex,
    }
  }, [form])

  const optionsTranslations = useMemo(() => {
    const res: Record<string, Record<string, KoboQuestionChoice>> = {}
    form.content.choices.forEach(choice => {
      if (!res[choice.list_name]) res[choice.list_name] = {}
      res[choice.list_name][choice.name] = choice
    })
    return res
  }, [form])

  return (
    <_KoboDatabaseContext.Provider value={{
      ...helper,
      translateOption: ({questionName, choiceName, langIndex}) => {
        const listName = helper.questionIndex[questionName].select_from_list_name
        try {
          if (choiceName)
            return getKoboLabel(optionsTranslations[listName!][choiceName], langIndex)
        } catch (e) {
          console.warn(
            'Cannot translate this options. Maybe the question type has changed?',
            {question: helper.questionIndex[questionName], listName, choiceName, optionsTranslations}
          )
        }
        return ''
      }
    }}>
      {children}
    </_KoboDatabaseContext.Provider>
  )
}
