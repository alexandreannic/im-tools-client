import React from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {AaSelect} from '@/shared/Select/Select'
import {cfmMakeEditRequestKey, useCfmContext} from '@/features/Cfm/CfmContext'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {useCfmColumns} from '@/features/Cfm/Data/useCfmColumns'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {Modal} from 'mui-extension/lib/Modal'
import {NavLink} from 'react-router-dom'
import {cfmIndex} from '@/features/Cfm/Cfm'
import {useSession} from '@/core/Session/SessionContext'
import {seq} from '@alexandreannic/ts-utils'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'

export const CfmTableArchived = ({}: any) => {
  const ctx = useCfmContext()
  const {langIndex, setLangIndex} = useKoboSchemaContext()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {session} = useSession()

  const column = useCfmColumns()
  return (
    <Page width="full">
      <Panel>
        <Sheet
          id="cfm"
          header={
            <>
              <AaSelect<number>
                sx={{maxWidth: 128, mr: 1}}
                defaultValue={langIndex}
                onChange={setLangIndex}
                options={[
                  {children: 'XML', value: -1},
                  ...ctx.schemaExternal.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
            </>
          }
          data={ctx.mappedDataArchived}
          loading={ctx.data.loading}
          getRenderRowKey={_ => _.form + _.id}
          columns={[
            {
              width: 0,
              head:'',
              id: 'archived',
              render: () => <TableIcon color="disabled">archived</TableIcon>
            },
            column.status,
            column.priority,
            column.id,
            column.submission_time,
            column.date,
            column.form,
            column.project,
            // {
            //   type: 'select_one',
            //   head: m.project,
            //   id: 'project',
            //   width: 170,
            //   // options: () => Enum.keys(Meal_CfmInternalOptions.feedback_type).map(k => ({value: k, label: ctx.schemaExternal.translate('feedback_type', k)})),
            //   renderValue: _ => _.project,
            //   renderOption: _ => _.project,
            //   render: row => row.project,
            // },
            column.office,
            column.program,
            column.focalPoint,
            // {
            //   width: 170,
            //   type: 'select_one',
            //   options: () => seq(ctx.mappedData).map(_ => _.tags?.focalPointEmail).compact().distinct(_ => _).map(SheetUtils.buildOption),
            //   renderValue: _ => _.tags?.focalPointEmail,
            //   render: _ => _.tags?.focalPointEmail,
            //   head: m.focalPoint,
            //   id: 'focalPoint',
            // },
            column.feedbackType,
            column.feedbackTypeExternal,
            column.feedback,
            column.comments,
            column.name,
            column.gender,
            column.email,
            column.phone,
            column.oblast,
            column.raion,
            column.hromada,
            column.note,
            {
              id: 'actions',
              width: 115,
              align: 'center',
              stickyEnd: true,
              render: row => (
                <>
                  {(ctx.authorizations.sum.write || session.email === row.tags?.focalPointEmail) && (
                    <>
                      <TableIconBtn
                        tooltip={m.unarchive}
                        onClick={() => {
                          ctx.updateTag.call({
                            formId: row.formId,
                            answerId: row.id,
                            key: 'archivedBy',
                            value: null
                          })
                        }}
                        children="unarchive"
                      />
                      <Modal
                        loading={ctx.asyncRemove.loading[cfmMakeEditRequestKey(row.formId, row.id)]}
                        content={m._cfm.deleteWarning}
                        onConfirm={(e, close) => ctx.asyncRemove.call({formId: row.formId, answerId: row.id}).then(close)}
                        title={m.shouldDelete}
                      >
                        <TableIconBtn children="delete"/>
                      </Modal>
                    </>
                  )}
                  <NavLink to={cfmIndex.siteMap.entry(row.formId, '' + row.id)}>
                    <TableIconBtn children="keyboard_arrow_right"/>
                  </NavLink>
                </>
              )
            },
          ]}
        />
      </Panel>
    </Page>
  )
}
