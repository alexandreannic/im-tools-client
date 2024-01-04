import {Controller, UseFormReturn} from 'react-hook-form'
import {DrcJob, DrcOffice} from '@/core/drcUa'
import {AccessLevel, accessLevelIcon} from '@/core/sdk/server/access/Access'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Autocomplete, autocompleteClasses, Box, Chip} from '@mui/material'
import {Enum, fnSwitch, map, seq} from '@alexandreannic/ts-utils'
import {AaInput} from '@/shared/ItInput/AaInput'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UUID} from '@/core/type'
import {Sheet} from '@/shared/Sheet/Sheet'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'

export interface IAccessForm {
  selectBy?: 'email' | 'job' | 'group'
  email?: string
  groupId?: UUID
  drcOffice?: DrcOffice
  drcJob?: DrcJob[]
  level: AccessLevel
}

export const AccessForm = ({
  form,
}: {
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  const watchSelectBy = form.watch('selectBy')

  useEffect(() => {
    if (form.watch('selectBy') !== 'group')
      form.setValue('groupId', undefined)
  }, [watchSelectBy])

  return (
    <>
      <AccessFormSection icon="person" label={m.Access.giveAccessBy}>
        <Controller
          name="selectBy"
          rules={{required: {value: true, message: m.required}}}
          control={form.control}
          render={({field}) => (
            <ScRadioGroup
              sx={{mb: 2.5}}
              dense
              error={!!form.formState.errors.selectBy}
              {...field}
              onChange={e => {
                form.setValue('drcJob', undefined)
                form.setValue('drcOffice', undefined)
                form.setValue('email', undefined)
                field.onChange(e)
              }}
            >
              <ScRadioGroupItem value="email" title={m.email}/>
              <ScRadioGroupItem value="job" title={m.Access.jobAndOffice}/>
              <ScRadioGroupItem value="group" title={m.group}/>
            </ScRadioGroup>
          )}
        />
        {fnSwitch(watchSelectBy!, {
          'group': (
            <>
              <AccessFormInputGroup form={form}/>
            </>
          ),
          'job': (
            <>
              <AccessFormInputDrcJob form={form}/>
              <AccessFormInputDrcOffice form={form}/>
            </>
          ),
          'email': (
            <AccessFormInputEmail form={form}/>
          )
        }, () => <></>)}
      </AccessFormSection>
      {watchSelectBy !== 'group' && (
        <AccessFormSection icon="lock" label={m.accessLevel}>
          <AccessFormInputAccessLevel form={form}/>
        </AccessFormSection>
      )}
    </>
  )
}

export const AccessFormInputEmail = ({
  form,
}: {
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  return (
    <AaInput
      sx={{mb: 2.5}}
      label={m.drcEmail}
      error={!!form.formState.errors.email}
      helperText={form.formState.errors.email?.message as string}
      {...form.register('email', {required: false, pattern: {value: /(@drc.ngo$|\s)/, message: m.invalidEmail}})}
    />
  )
}

export const AccessFormInputDrcOffice = ({
  form,
}: {
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  return (
    <Controller
      name="drcOffice"
      control={form.control}
      render={({field: {onChange, ...field}}) => (
        <AaSelectSingle<DrcOffice>
          {...field}
          label={m.drcOffice}
          onChange={_ => onChange(_)}
          options={Enum.values(DrcOffice)}
          sx={{mb: 2.5}}
        />
      )}
    />
  )
}

export const AccessFormInputAccessLevel = ({
  form,
}: {
  form: UseFormReturn<IAccessForm>
}) => {
  return (
    <Controller
      name="level"
      defaultValue={AccessLevel.Read}
      control={form.control}
      render={({field}) => (
        <ScRadioGroup<AccessLevel>
          sx={{mb: 2.5}}
          error={!!form.formState.errors.level}
          dense
          {...field}
          // onChange={_ => field.onChange({target: {value: _}} as any)}
        >
          {Enum.values(AccessLevel).map(level =>
            <ScRadioGroupItem icon={accessLevelIcon[level]} value={level} key={level} title={level}/>
          )}
        </ScRadioGroup>
      )}
    />
  )
}

export const AccessFormInputDrcJob = ({
  form,
}: {
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  return (
    <Controller
      control={form.control}
      name="drcJob"
      rules={{required: {value: true, message: m.required}}}
      render={({field: {onChange, ...field}}) => (
        <Autocomplete
          {...field}
          multiple
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                size="small"
                variant="outlined"
                label={option}
                {...getTagProps({index})}
              />
            ))
          }
          onChange={(e: any, _) => _ && onChange(_)}
          sx={{mb: 2.5}}
          options={Enum.values(DrcJob) ?? []}
          // renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
          renderInput={({InputProps, ...props}) => <AaInput helperText={null} label={m.drcJob} {...InputProps} {...props}/>}
        />
      )}
    />
  )
}

export const AccessFormInputGroup = ({
  form,
}: {
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const fetcherGroups = useFetcher(api.group.getAllWithItems)
  const groupIndex = useMemo(() => {
    return seq(fetcherGroups.entity).groupByFirst(_ => _.id)
  }, [fetcherGroups.entity])

  useEffect(() => {
    fetcherGroups.fetch()
  }, [])

  return (
    <>
      <Controller
        name="groupId"
        rules={{required: {value: true, message: m.required}}}
        control={form.control}
        render={({field: {onChange, ...field}}) => (
          <Autocomplete
            {...field}
            value={groupIndex[field.value!]}
            onChange={(e: any, _) => _ && onChange(_.id ?? undefined)}
            loading={fetcherGroups.loading}
            sx={{mb: 2.5}}
            getOptionLabel={_ => _.name}
            // renderTags={_ => }
            options={fetcherGroups.entity ?? []}
            renderOption={(props, option, state, ownerState) => (
              <Box
                sx={{
                  borderRadius: '8px',
                  margin: '5px',
                  [`&.${autocompleteClasses.option}`]: {
                    padding: '8px',
                  },
                }}
                component="li"
                {...props}
              >
                {option.name}
              </Box>
            )}
            renderInput={({InputProps, ...props}) =>
              <AaInput
                helperText={null}
                label={m.group}
                {...InputProps}
                {...props}
              />
            }
          />
        )}
      />
      {map(form.watch('groupId'), groupId => (
        <>
          <Sheet
            sx={{border: t => `1px solid ${t.palette.divider}`, overflow: 'hidden', borderRadius: t => t.shape.borderRadius + 'px'}}
            id="access"
            defaultLimit={5}
            data={groupIndex[groupId]?.items}
            columns={[
              {type: 'string', id: 'email', head: m.email, render: _ => _.email},
              {type: 'select_one', id: 'drcJob', head: m.drcJob, render: _ => _.drcJob},
              {type: 'select_one', id: 'drcOffice', head: m.drcOffice, render: _ => _.drcOffice},
              {type: 'select_one', id: 'level', head: m.accessLevel, render: _ => _.level},
            ]}
          />
        </>
      ))}
    </>
  )
}