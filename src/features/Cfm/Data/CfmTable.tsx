import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import React, {ReactNode, useCallback, useMemo} from 'react'
import {Page} from '@/shared/Page'
import {Sheet, SheetColumnProps} from '@/shared/Sheet/Sheet'
import {Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {MealCfmInternalOptions} from '@/core/koboModel/MealCfmInternal/MealCfmInternalOptions'
import {AaInput} from '@/shared/ItInput/AaInput'
import {CfmDataPriority, CfmDataProgram, CfmDataSource, KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Utils} from '@/utils/utils'
import {TableIcon, TableIconBtn, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'
import {AaSelect} from '@/shared/Select/Select'
import {DrcOffice} from '@/core/drcJobTitle'
import {CfmData, useCfmContext} from '@/features/Cfm/CfmContext'
import {NavLink} from 'react-router-dom'
import {cfmModule} from '@/features/Cfm/CfmModule'
import {AAIconBtn} from '@/shared/IconBtn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {kobo} from '@/koboDrcUaFormId'
import {MealCfmExternalOptions} from '@/core/koboModel/MealCfmExternal/MealCfmExternalOptions'
import {Tooltip} from '@mui/material'

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

  const {api} = useAppSettings()

  const _refresh = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.cfmInternal),
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.cfmExternal),
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
    defaultValue,
    ...sheetProps
  }: Pick<SheetColumnProps<any>, 'typeIcon' | 'style' | 'styleHead' | 'width'> & {
    head: string
    defaultValue?: KoboMealCfmTag[T]
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
      renderValue: row => (row?.tags?.[tag] ?? defaultValue) as string,
      render: row => (
        <AaSelect
          showUndefinedOption
          defaultValue={(row.tags as any)?.[tag] ?? defaultValue ?? ''}
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
        defaultValue: KoboMealCfmStatus.Open,
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
          header={
            <>
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
              head: m.date,
              id: 'date',
              width: 78,
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
            column.office,
            column.program,
            {
              type: 'string',
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
                    <AaInput
                      helperText={null}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      placeholder="@drc.ngo"
                      endAdornment={value && !Utils.regexp.drcEmail.test(value) && <TableIcon tooltip={m.invalidEmail} color="error">error</TableIcon>}
                    />
                  )}
                </DebouncedInput>
              ),
            },
            {
              type: 'select_one',
              head: m._cfm.feedbackType,
              id: 'category',
              width: 120,
              options: () => Enum.entries(MealCfmInternalOptions.feedback_type).map(([k, v]) => ({value: k, label: v})),
              render: row => row.form === CfmDataSource.Internal
                ? ctx.translateInternal.translateChoice('feedback_type', row.category)
                : <AaSelect
                  defaultValue={row.category}
                  onChange={newValue => {
                    ctx.updateTag.call({formId: row.formId, answerId: row.id, key: 'feedbackTypeOverride', value: newValue})
                  }}
                  options={Enum.entries(MealCfmInternalOptions.feedback_type).map(([k, v]) => ({value: k, children: v}))}
                />
            },
            {
              type: 'select_one',
              head: m._cfm.feedbackTypeExternal,
              id: 'category',
              options: () => Enum.entries(MealCfmExternalOptions.feedback_type).map(([k, v]) => ({value: k, label: v})),
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
              head: m.name,
              id: 'name',
              render: _ => _.name,
            },
            {
              type: 'select_one',
              head: m.gender,
              width: 80,
              id: 'gender',
              options: () => Enum.entries(MealCfmInternalOptions.gender).map(([value, label]) => ({value, label})),
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
              options: () => Enum.entries(MealCfmInternalOptions.ben_det_oblast).map(([value, label]) => ({value, label})),
              id: 'oblast',
              render: _ => ctx.translateExternal.translateChoice('ben_det_oblast', _.ben_det_oblast),
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
              width: 0,
              stickyEnd: true,
              align: 'center',
              render: row => (
                <NavLink to={cfmModule.siteMap.entry(row.formId, '' + row.id)}>
                  <TableIconBtn children="keyboard_arrow_right"/>
                </NavLink>
              )
            }
          ]}
        />
      </Panel>
    </Page>
  )
}
