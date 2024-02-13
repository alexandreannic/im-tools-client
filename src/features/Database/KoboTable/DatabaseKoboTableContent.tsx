import {KoboAnswer, KoboValidation} from '@/core/sdk/server/kobo/Kobo'
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
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useCustomColumns} from '@/features/Database/KoboTable/customization/useCustomColumns'
import {useCustomSelectedHeader} from '@/features/Database/KoboTable/customization/useCustomSelectedHeader'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {DatabaseTableProps} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {DatabaseKoboSyncBtn} from '@/features/Database/KoboTable/DatabaseKoboSyncBtn'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'

export const DatabaseKoboTableContent = ({
  onFiltersChange,
  onDataChange,
}: Pick<DatabaseTableProps, 'onFiltersChange' | 'onDataChange'>) => {
  const ctx = useDatabaseKoboTableContext()
  const {langIndex, setLangIndex} = useKoboSchemaContext()
  const {m} = useI18n()
  const theme = useTheme()
  const [repeatGroupsAsColumns, setRepeatGroupAsColumns] = usePersistentState<boolean>(false, {storageKey: `database-${ctx.form.id}-repeat-groups`})
  const [selectedIds, setSelectedIds] = useState<string[]>([])
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
      schema: ctx.schema.schemaHelper.sanitizedSchema.content.survey,
      groupSchemas: ctx.schema.schemaHelper.groupSchemas,
      translateQuestion: ctx.schema.translate.question,
      translateChoice: ctx.schema.translate.choice,
      choicesIndex: ctx.schema.schemaHelper.choicesIndex,
      m,
      repeatGroupsAsColumn: repeatGroupsAsColumns,
      onOpenGroupModal: setOpenGroupModalAnswer,
    })
  }, [ctx.schema.schemaUnsanitized, langIndex, repeatGroupsAsColumns])

  const columns = useMemo(() => {
    const action: DatatableColumn.Props<any> = {
      id: 'actions',
      head: '',
      width: 0,
      renderQuick: _ => (
        <>
          <TableIconBtn tooltip={m.view} children="visibility" onClick={() => setOpenModalAnswer(_)}/>
          <TableIconBtn disabled={!ctx.canEdit} tooltip={m.edit} target="_blank" href={ctx.asyncEdit(_.id)} children="edit"/>
        </>
      )
    }
    const validation: DatatableColumn.Props<any> = {
      id: 'validation',
      head: m.validation,
      width: 0,
      type: 'select_one',
      render: (row: KoboAnswer) => {
        const value = row.tags?._validation
        return {
          value: value ?? DatatableUtils.blank,
          option: value ? m[value] : DatatableUtils.blank,
          label: (
            <IpSelectSingle
              disabled={!ctx.canEdit || ctx.fetcherAnswers.loading}
              value={value}
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
          )
        }
      }
    }
    return [action, validation, ...extraColumns, ...schemaColumns]
  }, [schemaColumns])

  const selectedHeader = useCustomSelectedHeader(selectedIds)

  return (
    <>
      <Datatable
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
              defaultValue={langIndex}
              onChange={setLangIndex}
              options={[
                {children: 'XML', value: -1},
                ...ctx.schema.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
              ]}
            />
            {ctx.schema.schemaHelper.groupsCount > 0 && (
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
              href={ctx.schema.schemaUnsanitized.deployment__links.url}
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
              loading={ctx.asyncRefresh.loading}
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

