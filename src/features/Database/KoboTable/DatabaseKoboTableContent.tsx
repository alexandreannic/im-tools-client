import {KoboApiForm, KoboQuestionChoice} from '@/core/sdk/server/kobo/KoboApi'
import {Kobo, KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Sheet, SheetColumnProps} from '@/shared/Sheet/Sheet'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Arr, map} from '@alexandreannic/ts-utils'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import React, {useMemo, useState} from 'react'
import {formatDate, formatDateTime} from '@/core/i18n/localization/en'
import {useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {UseAsync} from '@/alexlib-labo/useAsync'
import {useI18n} from '@/core/i18n'
import {I18nContextProps} from '@/core/i18n/I18n'
import {AaSelect} from '@/shared/Select/Select'
import {DatabaseKoboTableExportBtn} from '@/features/Database/KoboTable/DatabaseKoboTableExportBtn'
import {useModal} from '@/shared/Modal/useModal'
import {DatabaseKoboTableGroupModal} from '@/features/Database/KoboTable/DatabaseKoboTableGroupModal'
import {SheetHeadTypeIcon} from '@/shared/Sheet/SheetHead'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const DatabaseKoboTableContent = ({
  schema,
  data,
  _refresh,
}: {
  _refresh: UseAsync<() => Promise<void>>
  schema: KoboApiForm,
  data: KoboAnswer<any>[]
}) => {
  const {m} = useI18n()
  const _schema = useKoboSchema({form: schema})
  const [langIndex, setLangIndex] = useState<number>(0)
  const mappedData = useMemo(() => data.map(_ => Kobo.mapAnswerBySchema(_schema.questionIndex, _)), [data])

  const {translateQuestion, translateChoice} = useMemo(() => getKoboTranslations({
    schema,
    langIndex,
    questionIndex: _schema.questionIndex,
  }), [schema, langIndex])

  const [groupModalOpen, groupModalClose] = useModal(({
    columnId,
    group,
    event,
  }: {
    columnId: string,
    group: KoboAnswer[],
    event: any
  }) => (
    <DatabaseKoboTableGroupModal
      title={translateQuestion(columnId)}
      anchorEl={event.target}
      group={group}
      form={_schema.sanitizedSchema}
      onClose={groupModalClose}
    />
  ), [translateQuestion])

  const columns = useMemo(() => {
    return getColumnBySchema({
      data: mappedData,
      schema: _schema.sanitizedSchema,
      translateQuestion,
      translateChoice,
      choicesIndex: _schema.choicesIndex,
      m,
      onOpenGroupModal: groupModalOpen,
    })
  }, [schema, langIndex])

  return (
    <Sheet columns={columns} data={mappedData} header={
      <>
        <AaSelect<number>
          sx={{maxWidth: 128, mr: 1}}
          defaultValue={langIndex}
          onChange={setLangIndex}
          options={[
            {children: 'XML', value: -1},
            ..._schema.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
          ]}
        />
        <DatabaseKoboTableExportBtn
          translateQuestion={translateQuestion}
          translateChoice={translateChoice}
          data={mappedData}
          formGroups={_schema.formGroups}
          form={_schema.sanitizedSchema}
        />
        <TableIconBtn
          loading={_refresh.getLoading()}
          color="primary"
          icon="refresh"
          tooltip={m._koboDatabase.pullData} onClick={_refresh.call}
        />
      </>
    }/>
  )
}

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

const getKoboTranslations = ({
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
        console.error('translate', questionName)
        return 'error ' + questionName
      }
    },
    translateChoice: (questionName: string, choiceName?: string) => {
      const listName = questionIndex[questionName].select_from_list_name
      try {
        if (choiceName)
          return getKoboLabel(choicesTranslation[listName!][choiceName], langIndex)
      } catch (e) {
        console.warn(
          'Cannot translate this options. Maybe the question type has changed?',
          {question: questionIndex[questionName], listName, choiceName, choicesTranslation}
        )
      }
      return ''
    },
  }
}
const getColumnBySchema = ({
  data,
  m,
  schema,
  translateQuestion,
  translateChoice,
  onOpenGroupModal,
  choicesIndex,
}: {
  data: any[]
  choicesIndex: ReturnType<typeof useKoboSchema>['choicesIndex']
  onOpenGroupModal: (_: {columnId: string, group: KoboAnswer[], event: any}) => void,
  m: I18nContextProps['m']
  translateChoice: KoboTranslateChoice
  translateQuestion: KoboTranslateQuestion
  schema: KoboApiForm
}): SheetColumnProps<KoboMappedAnswer>[] => {
  return schema.content.survey.map(q => {
    switch (q.type) {
      case 'image': {
        return {
          type: 'string',
          id: q.name,
          head: translateQuestion(q.name),
          render: row => <KoboAttachedImg attachments={row.attachments} fileName={row[q.name] as string}/>
        }
      }
      case 'calculate': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="functions" tooltip="calculate"/>,
          id: q.name,
          head: translateQuestion(q.name),
          render: row => <span title={row[q.name] as string}>{row[q.name] as string}</span>,
          options: () => Arr(data).map(_ => _[q.name] as string | undefined).distinct(_ => _).map(_ => ({label: _, value: _})),
        }
      }
      case 'select_one_from_file': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="attach_file" tooltip="select_one_from_file"/>,
          id: q.name,
          head: translateQuestion(q.name),
          render: row => <span title={row[q.name] as string}>{row[q.name] as string}</span>
        }
      }
      case 'username':
      case 'text': {
        return {
          type: 'string',
          id: q.name,
          head: translateQuestion(q.name),
          render: row => <span title={row[q.name] as string}>{row[q.name] as string}</span>
        }
      }
      case 'decimal':
      case 'integer': {
        return {
          type: 'number',
          id: q.name,
          head: translateQuestion(q.name),
          render: row => <span title={row[q.name] as string}>{row[q.name] as number}</span>
        }
      }
      case 'note': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="info" tooltip="note"/>,
          id: q.name,
          head: translateQuestion(q.name),
          render: row => <span title={row[q.name] as string}>{row[q.name] as string}</span>
        }
      }
      case 'date':
      case 'today':
      case 'start':
      case 'end': {
        return {
          type: 'date',
          id: q.name,
          head: translateQuestion(q.name),
          render: row => map(row[q.name] as Date | undefined, _ => (
            <span title={formatDateTime(_)}>{formatDate(_)}</span>
          ))
        }
      }
      case 'begin_repeat': {
        return {
          type: 'number',
          typeIcon: <SheetHeadTypeIcon children="repeat" tooltip="begin_repeat"/>,
          id: q.name,
          head: translateQuestion(q.name),
          renderValue: row => map(row[q.name] as KoboAnswer[] | undefined, _ => _.length),
          render: row => map(row[q.name] as KoboAnswer[] | undefined, group =>
            <AaBtn onClick={(event) => onOpenGroupModal({columnId: q.name, group, event})}>{group.length}</AaBtn>
          ) ?? <></>
        }
      }
      case 'select_one': {
        return {
          type: 'select_one',
          id: q.name,
          head: translateQuestion(q.name),
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          render: row => map(row[q.name] as string | undefined, v => {
            const render = translateChoice(q.name, v)
            if (render)
              return <span title={render}>{render}</span>
            return (
              <span title={v}>
                  <TableIcon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} children="error"/>
                {v}
                </span>
            )
          })
        }
      }
      case 'select_multiple': {
        return {
          type: 'select_multiple',
          id: q.name,
          head: translateQuestion(q.name),
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          render: row => map(row[q.name] as string[] | undefined, v => {
            try {
              const render = v.map(_ => translateChoice(q.name, _,)).join(' | ')
              return <span title={render}>{render}</span>
            } catch (e: any) {
              console.error(v)
              return JSON.stringify(v)
            }
          })
        }
      }
      case 'geopoint': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="location_on" tooltip="geopoint"/>,
          id: q.name,
          head: translateQuestion(q.name),
          render: row => map(row[q.name], (x: any) => {
            const render = JSON.stringify(x)
            return <span title={render}>{render}</span>
          })
        }
      }
      default: {
        return {
          type: 'string',
          id: q.name,
          head: translateQuestion(q.name),
          render: row => {
            const render = JSON.stringify(row[q.name])
            return <span title={render}>{render}</span>
          }
        }
      }
    }
  })
}
