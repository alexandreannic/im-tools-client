import {CfmDataPriority, CfmDataProgram, CfmDataSource, KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {Enum, seq} from '@alexandreannic/ts-utils'
import {SelectDrcProject} from '@/shared/SelectDrcProject'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Utils} from '@/utils/utils'
import {Autocomplete} from '@mui/material'
import {IpInput} from '@/shared/Input/Input'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {Meal_CfmInternalOptions} from '@/core/generatedKoboInterface/Meal_CfmInternal/Meal_CfmInternalOptions'
import {AaSelect} from '@/shared/Select/Select'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {Modal} from 'mui-extension/lib/Modal'
import {CfmData, cfmMakeEditRequestKey, useCfmContext} from '@/features/Cfm/CfmContext'
import {NavLink} from 'react-router-dom'
import {cfmIndex} from '@/features/Cfm/Cfm'
import React, {ReactNode, useCallback, useMemo} from 'react'
import {CfmPriorityLogo} from '@/features/Cfm/Data/CfmTable'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {DrcOffice} from '@/core/type/drc'

const makeColumn = (_: SheetColumnProps<CfmData>) => _

export const useCfmColumns = () => {
  const {formatDate, formatLargeNumber, m} = useI18n()
  const {api} = useAppSettings()
  const {session} = useSession()
  const ctx = useCfmContext()

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

  return useMemo(() => {
    return {
      status: buildTagEnumColumn({
        head: m.status,
        width: 0,
        typeIcon: null,
        style: () => ({padding: 0}),
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
      }),
      priority: makeColumn({
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
      }),
      id: makeColumn({
        type: 'string',
        head: m.id,
        id: 'id',
        width: 78,
        render: _ => _.id,
      }),
      submission_time: makeColumn({
        type: 'date',
        head: m.koboSubmissionTime,
        id: 'submission_time',
        width: 78,
        renderValue: _ => _.submissionTime,
        render: _ => formatDate(_.submissionTime),
      }),
      date: makeColumn({
        type: 'date',
        head: m.date,
        id: 'date',
        width: 78,
        renderValue: _ => _.date,
        render: _ => formatDate(_.date),
      }),
      form: makeColumn({
        type: 'select_one',
        head: m.form,
        id: 'form',
        width: 80,
        options: () => Enum.keys(CfmDataSource).map(_ => ({value: _, label: m._cfm.form[_]})),
        render: _ => m._cfm.form[_.form]
      }),
      project: makeColumn({
        type: 'select_one',
        head: m.project,
        id: 'project',
        width: 180,
        // options: () => Enum.keys(Meal_CfmInternalOptions.feedback_type).map(k => ({value: k, label: ctx.schemaExternal.translate('feedback_type', k)})),
        renderValue: _ => _.project,
        renderOption: _ => _.project,
        render: row => row.form === CfmDataSource.Internal
          ? row.project
          : <SelectDrcProject
            label={null}
            value={row.project}
            onChange={newValue => {
              ctx.updateTag.call({formId: row.formId, answerId: row.id, key: 'project', value: newValue})
            }}
          />
      }),
      focalPoint: makeColumn({
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
                options={ctx.users.get?.map((option) => option.email) ?? []}
                // renderInput={(params) => <TextField {...params} label="freeSolo" />}
                renderInput={({InputProps, ...props}) => <IpInput
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
      }),
      feedbackType: makeColumn({
        type: 'select_one',
        head: m._cfm.feedbackType,
        id: 'feedbackType',
        width: 120,
        options: () => Enum.keys(Meal_CfmInternalOptions.feedback_type).map(k => ({value: k, label: ctx.schemaExternal.translate.choice('feedback_type', k)})),
        renderValue: _ => _.category,
        render: row => row.form === CfmDataSource.Internal
          ? ctx.schemaExternal.translate.choice('feedback_type', row.category)
          : <AaSelect
            defaultValue={row.category}
            onChange={newValue => {
              ctx.updateTag.call({formId: row.formId, answerId: row.id, key: 'feedbackTypeOverride', value: newValue})
            }}
            options={Enum.entries(Meal_CfmInternalOptions.feedback_type).map(([k, v]) => ({value: k, children: v}))}
          />
      }),
      feedbackTypeExternal: makeColumn({
        type: 'select_one',
        head: m._cfm.feedbackTypeExternal,
        id: 'feedbackTypeExternal',
        options: () => Enum.entries(m._cfm._feedbackType).map(([k, v]) => ({value: k, label: v})),
        renderValue: _ => _.external_feedback_type,
        render: _ => m._cfm._feedbackType[_.external_feedback_type!],
      }),
      feedback: makeColumn({
        type: 'string',
        head: m._cfm.feedback,
        id: 'feedback',
        render: _ => _.feedback,
      }),
      comments: makeColumn({
        type: 'string',
        head: m.comments,
        id: 'comments',
        render: _ => _.comments,
      }),
      name: makeColumn({
        type: 'string',
        head: m.name,
        id: 'name',
        render: _ => _.name,
      }),
      gender: makeColumn({
        type: 'select_one',
        head: m.gender,
        width: 80,
        id: 'gender',
        options: () => Enum.keys(Meal_CfmInternalOptions.gender).map(value => ({value, label: ctx.schemaExternal.translate.choice('gender', value)})),
        renderValue: _ => _.gender,
        render: _ => ctx.schemaExternal.translate.choice('gender', _.gender)
      }),
      email: makeColumn({
        type: 'string',
        head: m.email,
        id: 'email',
        render: _ => _.email,
      }),
      phone: makeColumn({
        type: 'string',
        head: m.phone,
        id: 'phone',
        render: _ => _.phone,
      }),
      oblast: makeColumn({
        type: 'select_one',
        head: m.oblast,
        options: () => OblastIndex.names.map(value => ({value, label: value})),
        id: 'oblast',
        render: _ => _.oblast,
      }),
      raion: makeColumn({
        type: 'select_one',
        head: m.raion,
        id: 'raion',
        render: _ => ctx.schemaExternal.translate.choice('ben_det_raion', _.ben_det_raion),
      }),
      hromada: makeColumn({
        type: 'select_one',
        head: m.hromada,
        id: 'hromada',
        render: _ => ctx.schemaExternal.translate.choice('ben_det_hromada', _.ben_det_hromada),
      }),
      note: makeColumn({
        type: 'string',
        head: m.note,
        id: 'note',
        render: _ => _.tags?.notes
      }),
    }
  }, [ctx.mappedData])
}
