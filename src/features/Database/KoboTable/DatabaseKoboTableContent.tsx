import {KoboApiForm, KoboQuestionChoice, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Kobo, KoboAnswer, KoboAnswerId, KoboForm, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Sheet, SheetColumnProps} from '@/shared/Sheet/Sheet'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Arr, map, mapFor} from '@alexandreannic/ts-utils'
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
import {AAIconBtn} from '@/shared/IconBtn'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {ignoredColType} from '@/features/Database/Database'
import {Switch, Theme} from '@mui/material'
import {usePersistentState} from 'react-persistent-state'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const DatabaseKoboTableContent = ({
  form,
  schema,
  data,
  canEdit,
  _refresh,
  _edit,
}: {
  canEdit?: boolean
  _refresh: UseAsync<() => Promise<void>>
  _edit: UseAsync<(answerId: KoboAnswerId) => Promise<void>>
  schema: KoboApiForm,
  form: KoboForm
  data: KoboAnswer<any>[]
}) => {
  const {m} = useI18n()
  const _schema = useKoboSchema({schema: schema})
  const [langIndex, setLangIndex] = useState<number>(0)
  const [repeatGroupsAsColumns, setRepeatGroupAsColumns] = usePersistentState<boolean>(false, `database-${form.id}-repeat-groups`)

  const mappedData = useMemo(() => data.map(_ => Kobo.mapAnswerBySchema(_schema.questionIndex, _)), [data])

  const {translateQuestion, translateChoice} = useMemo(() => getKoboTranslations({
    schema,
    langIndex,
    questionIndex: _schema.questionIndex,
  }), [schema, langIndex])

  const [openModalAnswer] = useDatabaseKoboAnswerView({
    translateQuestion: translateQuestion,
    translateChoice: translateChoice,
    schema: schema,
    langIndex: langIndex,
  })

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

  const schemaColumns = useMemo(() => {
    return getColumnBySchema({
      data: mappedData,
      schema: _schema.sanitizedSchema.content.survey,
      groupSchemas: _schema.groupSchemas,
      translateQuestion,
      translateChoice,
      choicesIndex: _schema.choicesIndex,
      m,
      repeatGroupsAsColumn: repeatGroupsAsColumns,
      onOpenGroupModal: groupModalOpen,
    })
  }, [schema, langIndex, repeatGroupsAsColumns])

  const columns = useMemo(() => {
    const c: SheetColumnProps<any> = {
      id: 'actions',
      head: '',
      tooltip: null,
      render: _ => (
        <>
          <TableIconBtn tooltip={m.view} children="visibility" onClick={() => openModalAnswer(_)}/>
          <TableIconBtn disabled={!canEdit} tooltip={m.edit} loading={_edit.loading.has(_.id)} onClick={() => _edit.call(_.id)} children="edit"/>
        </>
      )
    }
    return [c, ...schemaColumns,]
  }, [schemaColumns, _edit.loading.values])


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
        {_schema.groupsCount > 0 && (
          <AaBtn icon="repartition" variant="outlined" iconSx={{color: (t: Theme) => t.palette.text.disabled}} onClick={() => setRepeatGroupAsColumns(_ => !_)}>
            <Switch size="small" sx={{mr: -1}} checked={repeatGroupsAsColumns}/>
          </AaBtn>
        )}

        <AAIconBtn
          href={schema.deployment__links.url}
          target="_blank"
          children="open_in_new"
          tooltip={m._koboDatabase.openKoboForm}
          sx={{marginLeft: 'auto'}}
        />
        <DatabaseKoboTableExportBtn
          translateQuestion={translateQuestion}
          translateChoice={translateChoice}
          data={mappedData}
          groupSchemas={_schema.groupSchemas}
          form={_schema.sanitizedSchema}
          repeatGroupsAsColumns={repeatGroupsAsColumns}
        />
        <AaBtn
          variant="outlined"
          loading={_refresh.loading.size > 0}
          icon="cloud_sync"
          tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.pullDataAt(form.updatedAt)}}/>}
          onClick={_refresh.call}
        >{m.sync}</AaBtn>
      </>
    }/>
  )
}

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
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

const getColumnBySchema = ({
  data,
  m,
  schema,
  groupSchemas,
  translateQuestion,
  translateChoice,
  onOpenGroupModal,
  choicesIndex,
  groupIndex,
  groupName,
  repeatGroupsAsColumn,
}: {
  data: any[]
  choicesIndex: ReturnType<typeof useKoboSchema>['choicesIndex']
  onOpenGroupModal: (_: {columnId: string, group: KoboAnswer[], event: any}) => void,
  m: I18nContextProps['m']
  translateChoice: KoboTranslateChoice
  translateQuestion: KoboTranslateQuestion
  schema: KoboQuestionSchema[],
  groupSchemas: Record<string, KoboQuestionSchema[]>
  groupIndex?: number
  groupName?: string
  repeatGroupsAsColumn?: boolean
}): SheetColumnProps<KoboMappedAnswer>[] => {
  const {
    getId,
    getHead,
    getVal,
  } = (() => {
    if (groupIndex && groupName)
      return {
        getId: (id: string) => `${groupIndex}_${id}`,
        getHead: (name: string) => `[${groupIndex}] ${name}`,
        getVal: (row: KoboMappedAnswer, name: string) => (row as any)[groupName][groupIndex]?.[name]
      }
    return {
      getId: (id: string) => id,
      getHead: (name: string) => name,
      getVal: (row: KoboMappedAnswer, name: string) => row[name],
    }
  })()

  return schema.filter(_ => !ignoredColType.includes(_.type)).flatMap(q => {
    switch (q.type) {
      case 'image': {
        return {
          type: 'string',
          id: getId(q.name),
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => <KoboAttachedImg attachments={row.attachments} fileName={getVal(row, q.name) as string}/>
        }
      }
      case 'calculate': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="functions" tooltip="calculate"/>,
          id: getId(q.name),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>,
          options: () => Arr(data).map(_ => _[q.name] as string | undefined).distinct(_ => _).map(_ => ({label: _, value: _})),
        }
      }
      case 'select_one_from_file': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="attach_file" tooltip="select_one_from_file"/>,
          id: getId(q.name),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'username':
      case 'text': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          id: getId(q.name),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'decimal':
      case 'integer': {
        return {
          type: 'number',
          id: getId(q.name),
          typeIcon: <SheetHeadTypeIcon children="tag" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as number}</span>
        }
      }
      case 'note': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="info" tooltip="note"/>,
          id: getId(q.name),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'date':
      case 'today':
      case 'start':
      case 'end': {
        return {
          type: 'date',
          id: getId(q.name),
          typeIcon: <SheetHeadTypeIcon children="event" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => map(getVal(row, q.name) as Date | undefined, _ => (
            <span title={formatDateTime(_)}>{formatDate(_)}</span>
          ))
        }
      }
      case 'begin_repeat': {
        if (repeatGroupsAsColumn) {
          return mapFor(17, i => getColumnBySchema({
            data: data?.map(_ => _[q.name]),
            groupSchemas,
            schema: groupSchemas[q.name],
            translateQuestion,
            translateChoice,
            choicesIndex,
            m,
            onOpenGroupModal,
            groupIndex: i,
            groupName: q.name,
          })).flat()
        }
        return {
          type: 'number',
          typeIcon: <SheetHeadTypeIcon children="repeat" tooltip="begin_repeat"/>,
          id: getId(q.name),
          head: getHead(translateQuestion(q.name)),
          render: row => map(row[q.name] as KoboAnswer[] | undefined, group =>
            <AaBtn onClick={(event) => onOpenGroupModal({columnId: q.name, group, event})}>{group.length}</AaBtn>
          ) ?? <></>
        }
      }
      case 'select_one': {
        return {
          type: 'select_one',
          id: getId(q.name),
          typeIcon: <SheetHeadTypeIcon children="radio_button_checked" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          render: row => map(getVal(row, q.name) as string | undefined, v => {
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
          id: getId(q.name),
          typeIcon: <SheetHeadTypeIcon children="check_box" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          render: row => map(getVal(row, q.name) as string[] | undefined, v => {
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
          id: getId(q.name),
          head: getHead(translateQuestion(q.name)),
          render: row => map(getVal(row, q.name), (x: any) => {
            const render = JSON.stringify(x)
            return <span title={render}>{render}</span>
          })
        }
      }
      default: {
        return {
          type: 'string',
          id: getId(q.name),
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => {
            const render = JSON.stringify(getVal(row, q.name))
            return <span title={render}>{render}</span>
          }
        }
      }
    }
  })
}
