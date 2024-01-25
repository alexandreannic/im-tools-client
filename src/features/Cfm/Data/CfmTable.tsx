import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import React, {ReactNode, useCallback, useMemo} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Enum, fnSwitch, seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {IpInput} from '@/shared/Input/Input'
import {CfmDataPriority, CfmDataProgram, CfmDataSource, KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Utils} from '@/utils/utils'
import {TableIcon, TableIconBtn, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'
import {AaSelect} from '@/shared/Select/Select'
import {DrcOffice} from '@/core/type/drc'
import {CfmData, cfmMakeEditRequestKey, useCfmContext} from '@/features/Cfm/CfmContext'
import {NavLink} from 'react-router-dom'
import {cfmIndex} from '@/features/Cfm/Cfm'
import {IpIconBtn} from '@/shared/IconBtn'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {kobo, KoboIndex} from '@/core/koboForms/KoboIndex'
import {Autocomplete} from '@mui/material'
import {useSession} from '@/core/Session/SessionContext'
import {Modal} from 'mui-extension/lib/Modal'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {Meal_CfmInternalOptions} from '@/core/generatedKoboInterface/Meal_CfmInternal/Meal_CfmInternalOptions'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {SelectDrcProject} from '@/shared/SelectDrcProject'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {useCfmColumns} from '@/features/Cfm/Data/useCfmColumns'

export interface CfmDataFilters extends KoboAnswerFilter {
}

export const CfmPriorityLogo = ({
  priority,
  fontSize,
  sx,
}: {
  sx?: TableIconProps['sx']
  fontSize?: TableIconProps['fontSize']
  priority?: CfmData['priority']
}) => {
  const {m} = useI18n()
  return fnSwitch(priority!, {
    Low: <TableIcon tooltip={m._cfm.priority + ': ' + priority} sx={sx} fontSize={fontSize} color="info">looks_3</TableIcon>,
    Medium: <TableIcon tooltip={m._cfm.priority + ': ' + priority} sx={sx} fontSize={fontSize} color="warning">looks_two</TableIcon>,
    High: <TableIcon tooltip={m._cfm.priority + ': ' + priority} sx={sx} fontSize={fontSize} color="error">looks_one</TableIcon>,
  }, () => undefined)
}

export const CfmTable = ({}: any) => {
  const ctx = useCfmContext()
  const {langIndex, setLangIndex} = useKoboSchemaContext()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {api} = useAppSettings()
  const {session} = useSession()

  const _refresh = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, KoboIndex.byName('meal_cfmInternal').id),
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, KoboIndex.byName('meal_cfmExternal').id),
    ])
    await ctx.data.fetch({force: true, clean: false})
  })
  // const {toastHttpError, toastLoading} = useAaToast()
  //
  // const _editExternal = useFetchers(async (answerId: KoboAnswerId) => {
  //   return api.koboApi.getEditUrl(kobo.drcUa.server.prod, KoboIndex.byName('cfmExternal').id, answerId).then(_ => {
  //     if (_.url) window.open(_.url, '_blank')
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})
  //
  // const _editInternal = useFetchers(async (answerId: KoboAnswerId) => {
  //   return api.koboApi.getEditUrl(kobo.drcUa.server.prod, KoboIndex.byName('cfmInternal').id, answerId).then(_ => {
  //     if (_.url) window.open(_.url, '_blank')
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})

  const column = useCfmColumns()
  return (
    <Page width="full">
      <Panel>
        <Sheet
          select={{
            onSelect: console.log,
            getId: _ => _.id,
            selectActions: (
              <></>
            )
          }}
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
              <IpIconBtn
                loading={_refresh.loading}
                children="cloud_sync"
                tooltip={m._koboDatabase.pullData}
                onClick={_refresh.call}
              />
            </>
          }
          data={ctx.mappedData}
          loading={ctx.data.loading}
          getRenderRowKey={_ => _.form + _.id}
          columns={[
            column.status,
            column.priority,
            column.id,
            column.submission_time,
            column.date,
            column.form,
            column.project,
            column.office,
            column.program,
            column.focalPoint,
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
                        tooltip={m.edit}
                        href={api.koboApi.getEditUrl({formId: row.formId, answerId: row.id})}
                        target="_blank"
                        children="edit"
                      />
                      <TableIconBtn
                        tooltip={m.archive}
                        onClick={() => {
                          ctx.updateTag.call({
                            formId: row.formId,
                            answerId: row.id,
                            key: 'archivedBy',
                            value: session.email
                          })
                        }}
                        children="archive"
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
