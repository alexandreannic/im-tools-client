import {KoboAnswer, KoboValidation} from '@/core/sdk/server/kobo/Kobo'
import {Sheet} from '@/shared/Sheet/Sheet'
import {IpBtn} from '@/shared/Btn'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import React, {useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {AaSelect} from '@/shared/Select/Select'
import {DatabaseKoboTableExportBtn} from '@/features/Database/KoboTable/DatabaseKoboTableExportBtn'
import {DatabaseKoboTableGroupModal} from '@/features/Database/KoboTable/DatabaseKoboTableGroupModal'
import {IpIconBtn} from '@/shared/IconBtn'
import {DatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {Icon, Switch, Theme, useTheme} from '@mui/material'
import {usePersistentState} from '@/alexlib-labo/usePersistantState'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useCustomColumns} from '@/features/Database/KoboTable/useCustomColumns'
import {useCustomSelectedHeader} from '@/features/Database/KoboTable/useCustomSelectedHeader'
import {useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {DatabaseTableProps} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {DatabaseKoboSyncBtn} from '@/features/Database/KoboTable/DatabaseKoboSyncBtn'

export const DatabaseKoboTableContent = ({
  onFiltersChange,
  onDataChange,
}: Pick<DatabaseTableProps, 'onFiltersChange' | 'onDataChange'>) => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  const theme = useTheme()
  const [repeatGroupsAsColumns, setRepeatGroupAsColumns] = usePersistentState<boolean>(false, {storageKey: `database-${ctx.form.id}-repeat-groups`})
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
    const action: SheetColumnProps<any> = {
      id: 'actions',
      head: '',
      width: 0,
      tooltip: null,
      render: _ => (
        <>
          <TableIconBtn tooltip={m.view} children="visibility" onClick={() => setOpenModalAnswer(_)}/>
          <TableIconBtn disabled={!ctx.canEdit} tooltip={m.edit} target="_blank" href={ctx.asyncEdit(_.id)} children="edit"/>
        </>
      )
    }
    const validation: SheetColumnProps<any> = {
      id: 'validation',
      head: m.validation,
      width: 0,
      type: 'select_one',
      tooltip: null,
      renderValue: (row: KoboAnswer) => row.tags?._validation ?? SheetUtils.blank,
      renderOption: (row: KoboAnswer) => row.tags?._validation ? m[row.tags?._validation!] : SheetUtils.blank,
      render: (row: KoboAnswer) => (
        <>
          <IpSelectSingle
            disabled={!ctx.canEdit || ctx.fetcherAnswers.loading}
            value={row.tags?._validation}
            options={[
              {children: <Icon sx={{color: theme.palette.success.main}} title={m.Approved}>check_circle</Icon>, value: KoboValidation.Approved},
              {children: <Icon sx={{color: theme.palette.error.main}} title={m.Rejected}>error</Icon>, value: KoboValidation.Rejected},
              {children: <Icon sx={{color: theme.palette.warning.main}} title={m.Pending}>schedule</Icon>, value: KoboValidation.Pending},
            ]}
            onChange={(e) => {
              ctx.updateTag({
                formId: ctx.form.id,
                answerIds: [row.id],
                tags: {_validation: e},
              })
            }}
          />
        </>
      )
    }
    return [...extraColumns, action, validation, ...schemaColumns]
  }, [schemaColumns])

  const selectedHeader = useCustomSelectedHeader(selectedIds)

  return (
    <>
      <Sheet
        onFiltersChange={onFiltersChange}
        onDataChange={onDataChange}
        select={ctx.canEdit && selectedHeader ? {
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
              <IpBtn
                icon="move_up"
                variant="outlined"
                iconSx={{color: (t: Theme) => t.palette.text.disabled, transform: 'rotate(90deg)'}}
                onClick={() => setRepeatGroupAsColumns(_ => !_)}
                tooltip={m._koboDatabase.repeatGroupsAsColumns}
              >
                <Switch size="small" sx={{mr: -1}} checked={repeatGroupsAsColumns}/>
              </IpBtn>
            )}

            <IpIconBtn
              href={ctxSchema.schemaUnsanitized.deployment__links.url}
              target="_blank"
              children="file_open"
              tooltip={m._koboDatabase.openKoboForm}
              sx={{marginLeft: 'auto'}}
            />
            <DatabaseKoboTableExportBtn
              data={params.filteredAndSortedData}
              repeatGroupsAsColumns={repeatGroupsAsColumns}
              tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.downloadAsXLS}}/>}
            />
            <DatabaseKoboSyncBtn
              loading={ctx.asyncRefresh.loading.size > 0}
              tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.pullDataAt(ctx.form.updatedAt)}}/>}
              onClick={ctx.asyncRefresh.call}
            />
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

