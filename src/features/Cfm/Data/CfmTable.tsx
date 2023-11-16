import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import React, {ReactNode, useCallback, useMemo} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Enum, fnSwitch, seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {AaInput} from '@/shared/ItInput/AaInput'
import {CfmDataPriority, CfmDataProgram, CfmDataSource, KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Utils} from '@/utils/utils'
import {TableIcon, TableIconBtn, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'
import {AaSelect} from '@/shared/Select/Select'
import {DrcOffice} from '@/core/drcUa'
import {CfmData, cfmMakeEditRequestKey, useCfmContext} from '@/features/Cfm/CfmContext'
import {NavLink} from 'react-router-dom'
import {cfmModule} from '@/features/Cfm/CfmModule'
import {AAIconBtn} from '@/shared/IconBtn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {kobo} from '@/koboDrcUaFormId'
import {Autocomplete} from '@mui/material'
import {useSession} from '@/core/Session/SessionContext'
import {Modal} from 'mui-extension/lib/Modal'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {Meal_CfmInternalOptions} from '@/core/koboModel/Meal_CfmInternal/Meal_CfmInternalOptions'

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
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {session} = useSession()
  const {api} = useAppSettings()

  const _refresh = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.meal_cfmInternal),
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.meal_cfmExternal),
    ])
    await ctx.data.fetch({force: true, clean: false})
  })
  // const {toastHttpError, toastLoading} = useAaToast()
  //
  // const _editExternal = useFetchers(async (answerId: KoboAnswerId) => {
  //   return api.koboApi.getEditUrl(kobo.drcUa.server.prod, kobo.drcUa.form.cfmExternal, answerId).then(_ => {
  //     if (_.url) window.open(_.url, '_blank')
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})
  //
  // const _editInternal = useFetchers(async (answerId: KoboAnswerId) => {
  //   return api.koboApi.getEditUrl(kobo.drcUa.server.prod, kobo.drcUa.form.cfmInternal, answerId).then(_ => {
  //     if (_.url) window.open(_.url, '_blank')
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})


  const buildTagEnumColumn = useCallback(<T extends keyof Partial<KoboMealCfmTag>, K extends string, >({
    head,
    tag,
    enumerator,
    translate,
    value,
    ...sheetProps
  }: Pick<SheetColumnProps<any>, 'typeIcon' | 'style' | 'styleHead' | 'width'> & {
    head: string
    value?: KoboMealCfmTag[T]
    enumerator: Record<K, string>
    translate?: Record<K, ReactNode>
    tag: T,
  }): SheetColumnProps<CfmData> => {
    const enumKeys = Enum.keys(enumerator)
    return {
      id: tag,
      head,
      type: 'select_one',
      options: () => enumKeys.map(_ => ({value: _, label: _})),
      renderValue: row => (row?.tags?.[tag] ?? value) as string,
      render: row => (
        <AaSelect
          showUndefinedOption
          value={(row.tags as any)?.[tag] ?? value ?? ''}
          onChange={(tagChange) => {
            ctx.updateTag.call({
              formId: row.formId,
              answerId: row.id,
              key: tag,
              value: tagChange,
            })
          }}
          options={enumKeys.map(_ => ({
            value: _, children: translate ? translate[_] : _,
          }))
          }
        />
      ),
      ...sheetProps,
    }
  }, [ctx.mappedData])

  const column = useMemo(() => {
    return {
      status: buildTagEnumColumn({
        head: m.status,
        width: 0,
        typeIcon: null,
        style: {padding: 0},
        tag: 'status',
        value: KoboMealCfmStatus.Open,
        enumerator: KoboMealCfmStatus,
        translate: {
          [KoboMealCfmStatus.Close]: <TableIcon tooltip={m._cfm.status.Close} color="success">check_circle</TableIcon>,
          [KoboMealCfmStatus.Open]: <TableIcon tooltip={m._cfm.status.Open} color="warning">new_releases</TableIcon>,
          [KoboMealCfmStatus.Processing]: <TableIcon tooltip={m._cfm.status.Processing} color="info">schedule</TableIcon>,
        }
      }),
      office: buildTagEnumColumn({
        head: m.office,
        tag: 'office',
        width: 100,
        enumerator: DrcOffice,
      }),
      program: buildTagEnumColumn({
        head: m.program,
        width: 140,
        tag: 'program',
        enumerator: CfmDataProgram,
      })
    }
  }, [ctx.mappedData])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          id="cfm"
          header={
            <>
              <AaSelect<number>
                sx={{maxWidth: 128, mr: 1}}
                defaultValue={ctx.langIndex}
                onChange={ctx.setLangIndex}
                options={[
                  {children: 'XML', value: -1},
                  ...ctx.schemaExternal.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
              <AAIconBtn
                loading={_refresh.loading.size > 0}
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
            {
              type: 'select_one',
              id: 'priority',
              width: 0,
              typeIcon: null,
              align: 'center',
              head: m._cfm.priority,
              tooltip: null,
              options: () => [
                {value: CfmDataPriority.Low, label: CfmDataPriority.Low},
                {value: CfmDataPriority.Medium, label: CfmDataPriority.Medium},
                {value: CfmDataPriority.High, label: CfmDataPriority.High},
              ],
              renderValue: _ => _.priority,
              render: _ => <CfmPriorityLogo priority={_.priority}/>,
            },
            {
              type: 'string',
              head: m.id,
              id: 'id',
              width: 78,
              render: _ => _.id,
            },
            {
              type: 'date',
              head: m.koboSubmissionTime,
              id: 'submission_time',
              width: 78,
              renderValue: _ => _.submissionTime,
              render: _ => formatDate(_.submissionTime),
            },
            {
              type: 'date',
              head: m.date,
              id: 'date',
              width: 78,
              renderValue: _ => _.date,
              render: _ => formatDate(_.date),
            },
            {
              type: 'select_one',
              head: m.form,
              id: 'form',
              width: 80,
              options: () => Enum.keys(CfmDataSource).map(_ => ({value: _, label: m._cfm.form[_]})),
              render: _ => m._cfm.form[_.form]
            },
            {
              type: 'select_one',
              head: m.project,
              id: 'project',
              render: _ => _.project,
            },
            column.office,
            column.program,
            {
              width: 170,
              type: 'select_one',
              options: () => seq(ctx.mappedData).map(_ => _.tags?.focalPointEmail).compact().distinct(_ => _).map(SheetUtils.buildOption),
              renderValue: _ => _.tags?.focalPointEmail,
              head: m.focalPoint,
              id: 'focalPoint',
              render: row => (
                <DebouncedInput<string>
                  debounce={1250}
                  value={row.tags?.focalPointEmail}
                  onChange={_ => {
                    if (_ === '' || Utils.regexp.drcEmail.test(_))
                      ctx.updateTag.call({formId: row.formId, answerId: row.id, key: 'focalPointEmail', value: _})
                  }}
                >
                  {(value, onChange) => (
                    <Autocomplete
                      freeSolo
                      loading={ctx.users.loading}
                      disableClearable
                      value={value}
                      onChange={(e, _) => onChange(_)}
                      options={ctx.users.entity?.map((option) => option.email) ?? []}
                      // renderInput={(params) => <TextField {...params} label="freeSolo" />}
                      renderInput={({InputProps, ...props}) => <AaInput
                        {...InputProps}
                        {...props}
                        helperText={null}
                        placeholder="@drc.ngo"
                        endAdornment={value && !Utils.regexp.drcEmail.test(value) && <TableIcon tooltip={m.invalidEmail} color="error">error</TableIcon>}
                      />
                      }
                    />
                  )}
                </DebouncedInput>
              ),
            },
            {
              type: 'select_one',
              head: m._cfm.feedbackType,
              id: 'feedbackType',
              width: 120,
              options: () => Enum.keys(Meal_CfmInternalOptions.feedback_type).map(k => ({value: k, label: ctx.translateInternal.translateChoice('feedback_type', k)})),
              renderValue: _ => _.category,
              render: row => row.form === CfmDataSource.Internal
                ? ctx.translateInternal.translateChoice('feedback_type', row.category)
                : <AaSelect
                  defaultValue={row.category}
                  onChange={newValue => {
                    ctx.updateTag.call({formId: row.formId, answerId: row.id, key: 'feedbackTypeOverride', value: newValue})
                  }}
                  options={Enum.entries(Meal_CfmInternalOptions.feedback_type).map(([k, v]) => ({value: k, children: v}))}
                />
            },
            {
              type: 'select_one',
              head: m._cfm.feedbackTypeExternal,
              id: 'feedbackTypeExternal',
              options: () => Enum.entries(m._cfm._feedbackType).map(([k, v]) => ({value: k, label: v})),
              renderValue: _ => _.external_feedback_type,
              render: _ => m._cfm._feedbackType[_.external_feedback_type!],
            },
            {
              type: 'string',
              head: m._cfm.feedback,
              id: 'feedback',
              render: _ => _.feedback,
            },
            {
              type: 'string',
              head: m.comments,
              id: 'comments',
              render: _ => _.comments,
            },
            {
              type: 'string',
              head: m.name,
              id: 'name',
              render: _ => _.name,
            },
            {
              type: 'select_one',
              head: m.gender,
              width: 80,
              id: 'gender',
              options: () => Enum.keys(Meal_CfmInternalOptions.gender).map(value => ({value, label: ctx.translateExternal.translateChoice('gender', value)})),
              renderValue: _ => _.gender,
              render: _ => ctx.translateExternal.translateChoice('gender', _.gender)
            },
            {
              type: 'string',
              head: m.email,
              id: 'email',
              render: _ => _.email,
            },
            {
              type: 'string',
              head: m.phone,
              id: 'phone',
              render: _ => _.phone,
            },
            {
              type: 'select_one',
              head: m.oblast,
              options: () => Enum.keys(Meal_CfmInternalOptions.ben_det_oblast).map(value => ({value, label: ctx.translateExternal.translateChoice('ben_det_oblast', value)})),
              id: 'oblast',
              render: _ => _.oblast,
            },
            {
              type: 'string',
              head: m.raion,
              id: 'raion',
              render: _ => ctx.translateExternal.translateChoice('ben_det_raion', _.ben_det_raion),
            },
            {
              type: 'string',
              head: m.hromada,
              id: 'hromada',
              render: _ => ctx.translateExternal.translateChoice('ben_det_hromada', _.ben_det_hromada),
            },
            {
              id: 'actions',
              width: 95,
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
                      <Modal
                        loading={ctx.asyncRemove.loading.get(cfmMakeEditRequestKey(row.formId, row.id))}
                        content={m._cfm.deleteWarning}
                        onConfirm={(e, close) => ctx.asyncRemove.call({formId: row.formId, answerId: row.id}).then(close)}
                        title={m.shouldDelete}
                      >
                        <TableIconBtn children="delete"/>
                      </Modal>
                    </>
                  )}
                  <NavLink to={cfmModule.siteMap.entry(row.formId, '' + row.id)}>
                    <TableIconBtn children="keyboard_arrow_right"/>
                  </NavLink>
                </>
              )
            }
          ]}
        />
      </Panel>
    </Page>
  )
}
