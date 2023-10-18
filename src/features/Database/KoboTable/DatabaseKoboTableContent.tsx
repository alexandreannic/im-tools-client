import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Sheet} from '@/shared/Sheet/Sheet'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import React, {useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {AaSelect} from '@/shared/Select/Select'
import {DatabaseKoboTableExportBtn} from '@/features/Database/KoboTable/DatabaseKoboTableExportBtn'
import {DatabaseKoboTableGroupModal} from '@/features/Database/KoboTable/DatabaseKoboTableGroupModal'
import {AAIconBtn} from '@/shared/IconBtn'
import {DatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {Switch, Theme} from '@mui/material'
import {usePersistentState} from '@/alexlib-labo/usePersistantState'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useCustomColumns} from '@/features/Database/KoboTable/useCustomColumns'
import {useCustomSelectedHeader} from '@/features/Database/KoboTable/useCustomSelectedHeader'
import {useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'

export const DatabaseKoboTableContent = () => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  const [repeatGroupsAsColumns, setRepeatGroupAsColumns] = usePersistentState<boolean>(false, `database-${ctx.form.id}-repeat-groups`)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const ctxSchema = useKoboSchemaContext()
  const [openModalAnswer, setOpenModalAnswer] = useState<KoboAnswer | undefined>()
  const [groupModalOpen, setOpenGroupModalAnswer] = useState<{
    columnId: string,
    group: KoboAnswer[],
    event: any
  } | undefined>()

  const extraColumns = useCustomColumns()
  const schemaColumns = useMemo(() => {
    return getColumnBySchema({
      data: ctx.data,
      schema: ctxSchema.schemaHelper.sanitizedSchema.content.survey,
      groupSchemas: ctxSchema.schemaHelper.groupSchemas,
      translateQuestion: ctxSchema.translate.question,
      translateChoice: ctxSchema.translate.choice,
      choicesIndex: ctxSchema.schemaHelper.choicesIndex,
      m,
      repeatGroupsAsColumn: repeatGroupsAsColumns,
      onOpenGroupModal: setOpenGroupModalAnswer,
    })
  }, [ctxSchema.schemaUnsanitized, ctxSchema.langIndex, repeatGroupsAsColumns])

  const columns = useMemo(() => {
    const c: SheetColumnProps<any> = {
      id: 'actions',
      head: 'Action',
      width: 0,
      tooltip: null,
      render: _ => (
        <>
          <TableIconBtn tooltip={m.view} children="visibility" onClick={() => setOpenModalAnswer(_)}/>
          <TableIconBtn disabled={!ctx.canEdit} tooltip={m.edit} target="_blank" href={ctx.asyncEdit(_.id)} children="edit"/>
        </>
      )
    }
    return [...extraColumns, c, ...schemaColumns]
  }, [schemaColumns])

  const selectedHeader = useCustomSelectedHeader(selectedIds)

  return (
    <>
      <Sheet
        select={selectedHeader ? {
          onSelect: setSelectedIds,
          selectActions: selectedHeader,
          getId: _ => _.id,
        } : undefined}
        id={ctx.form.id}
        getRenderRowKey={_ => _.id}
        columns={columns}
        data={ctx.data}
        header={params =>
          <>
            <AaSelect<number>
              sx={{maxWidth: 128, mr: 1}}
              defaultValue={ctxSchema.langIndex}
              onChange={ctxSchema.setLangIndex}
              options={[
                {children: 'XML', value: -1},
                ...ctxSchema.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
              ]}
            />
            {ctxSchema.schemaHelper.groupsCount > 0 && (
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
              href={ctxSchema.schemaUnsanitized.deployment__links.url}
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
        }
      />
      {openModalAnswer && (
        <DatabaseKoboAnswerView
          open={!!openModalAnswer}
          onClose={() => setOpenModalAnswer(undefined)}
          answer={openModalAnswer}
        />
      )}
      {groupModalOpen && (
        <DatabaseKoboTableGroupModal
          name={groupModalOpen.columnId}
          anchorEl={groupModalOpen.event.target}
          groupData={groupModalOpen.group}
          onClose={() => setOpenGroupModalAnswer(undefined)}
        />
      )}
    </>
  )
}

export const getKoboLabel = (q: {
  name: string,
  label?: string[]
}, langIndex?: number): string => {
  return q.label !== undefined ? (q.label as any)[langIndex as any] ?? q.name : q.name
}

