import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Sheet, SheetColumnProps} from '@/shared/Sheet/Sheet'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import React, {useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {AaSelect} from '@/shared/Select/Select'
import {DatabaseKoboTableExportBtn} from '@/features/Database/KoboTable/DatabaseKoboTableExportBtn'
import {useModal} from '@/shared/Modal/useModal'
import {DatabaseKoboTableGroupModal} from '@/features/Database/KoboTable/DatabaseKoboTableGroupModal'
import {AAIconBtn} from '@/shared/IconBtn'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {Switch, Theme} from '@mui/material'
import {usePersistentState} from '@/alexlib-labo/usePersistantState'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useExtraColumns} from '@/features/Database/KoboTable/useColumnsExtra'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const DatabaseKoboTableContent = () => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  const [repeatGroupsAsColumns, setRepeatGroupAsColumns] = usePersistentState<boolean>(false, `database-${ctx.form.id}-repeat-groups`)

  const [openModalAnswer] = useDatabaseKoboAnswerView({
    translateQuestion: ctx.translate.question,
    translateChoice: ctx.translate.choice,
    schema: ctx.schema,
    langIndex: ctx.langIndex,
  })

  const [groupModalOpen, groupModalClose] = useModal(({
    columnId,
    group,
    event,
  }: {
    columnId: string
    group: KoboAnswer[]
    event: any
  }) => (
    <DatabaseKoboTableGroupModal
      formId={ctx.form.id}
      translateQuestion={ctx.translate.question}
      schema={ctx.schemaHelper.groupSchemas[columnId]}
      translateChoice={ctx.translate.choice}
      choicesIndex={ctx.schemaHelper.choicesIndex}
      groupSchemas={ctx.schemaHelper.groupSchemas}
      name={columnId}
      anchorEl={event.target}
      groupData={group}
      onClose={groupModalClose}
    />
  ), [ctx.schema])

  const extraColumns = useExtraColumns()
  const schemaColumns = useMemo(() => {
    return getColumnBySchema({
      data: ctx.data,
      schema: ctx.schemaHelper.sanitizedSchema.content.survey,
      groupSchemas: ctx.schemaHelper.groupSchemas,
      translateQuestion: ctx.translate.question,
      translateChoice: ctx.translate.choice,
      choicesIndex: ctx.schemaHelper.choicesIndex,
      m,
      repeatGroupsAsColumn: repeatGroupsAsColumns,
      onOpenGroupModal: groupModalOpen,
    })
  }, [ctx.schema, ctx.langIndex, repeatGroupsAsColumns])

  const columns = useMemo(() => {
    const c: SheetColumnProps<any> = {
      id: 'actions',
      head: '',
      tooltip: null,
      render: _ => (
        <>
          <TableIconBtn tooltip={m.view} children="visibility" onClick={() => openModalAnswer(_)}/>
          <TableIconBtn disabled={!ctx.canEdit} tooltip={m.edit} loading={ctx.asyncEdit.loading.has(_.id)} onClick={() => ctx.asyncEdit.call(_.id)} children="edit"/>
        </>
      )
    }
    return [c, ...extraColumns, ...schemaColumns]
  }, [schemaColumns, ctx.asyncEdit.loading.values])


  return (
    <Sheet id={ctx.form.id} getRenderRowKey={_ => _.id} columns={columns} data={ctx.data} header={params =>
      <>
        <AaSelect<number>
          sx={{maxWidth: 128, mr: 1}}
          defaultValue={ctx.langIndex}
          onChange={ctx.setLangIndex}
          options={[
            {children: 'XML', value: -1},
            ...ctx.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
          ]}
        />
        {ctx.schemaHelper.groupsCount > 0 && (
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
          href={ctx.schema.deployment__links.url}
          target="_blank"
          children="open_in_new"
          tooltip={m._koboDatabase.openKoboForm}
          sx={{marginLeft: 'auto'}}
        />
        <DatabaseKoboTableExportBtn
          data={params.filteredAndSortedData}
          repeatGroupsAsColumns={repeatGroupsAsColumns}
          tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.downloadAsXLS}}/>}
        />
        <AaBtn
          variant="outlined"
          loading={ctx.asyncRefresh.loading.size > 0}
          icon="cloud_sync"
          tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.pullDataAt(ctx.form.updatedAt)}}/>}
          onClick={ctx.asyncRefresh.call}
        >{m.sync}</AaBtn>
      </>
    }/>
  )
}

export const getKoboLabel = (q: {name: string, label?: string[]}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

