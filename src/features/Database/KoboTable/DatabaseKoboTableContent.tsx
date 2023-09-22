import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Kobo, KoboAnswer, KoboAnswerId, KoboForm} from '@/core/sdk/server/kobo/Kobo'
import {Sheet, SheetColumnProps} from '@/shared/Sheet/Sheet'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import React, {useMemo, useState} from 'react'
import {getKoboTranslations, useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {UseAsync} from '@/alexlib-labo/useAsync'
import {useI18n} from '@/core/i18n'
import {AaSelect} from '@/shared/Select/Select'
import {DatabaseKoboTableExportBtn} from '@/features/Database/KoboTable/DatabaseKoboTableExportBtn'
import {useModal} from '@/shared/Modal/useModal'
import {DatabaseKoboTableGroupModal} from '@/features/Database/KoboTable/DatabaseKoboTableGroupModal'
import {AAIconBtn} from '@/shared/IconBtn'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {Switch, Theme} from '@mui/material'
import {usePersistentState} from 'react-persistent-state'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const ignoredColType: KoboApiColType[] = [
  'begin_group',
  'end_group',
  'deviceid',
  'end_repeat',
  // 'begin_repeat',
  // 'note',
]

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
      groupData={group}
      schema={_schema.groupSchemas[columnId]}
      onClose={groupModalClose}
      translateQuestion={translateQuestion}
      translateChoice={translateChoice}
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
          <AaBtn
            icon="move_up"
            variant="outlined"
            iconSx={{color: (t: Theme) => t.palette.text.disabled, transform: 'rotate(90deg)'}}
            onClick={() => setRepeatGroupAsColumns(_ => !_)}
            tooltip={m._koboDatabase.repeatGroupsAsColumns}
          >
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

