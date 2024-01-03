import {Controller, UseFormReturn} from 'react-hook-form'
import {DrcJob, DrcOffice} from '@/core/drcUa'
import {AccessLevel, accessLevelIcon} from '@/core/sdk/server/access/Access'
import {Txt, TxtProps} from 'mui-extension'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Autocomplete, autocompleteClasses, Box, Chip} from '@mui/material'
import {Enum, map, seq} from '@alexandreannic/ts-utils'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaSelect} from '@/shared/Select/Select'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UUID} from '@/core/type'
import {Group} from '@/core/sdk/server/group/GroupItem'
import {Sheet} from '@/shared/Sheet/Sheet'

export interface IAccessForm {
  selectBy?: 'email' | 'job' | 'group'
  email?: string
  groupId?: UUID
  drcOffice?: DrcOffice
  drcJob?: DrcJob[]
  level?: AccessLevel
}

export const AccessFormSection = ({children, ...props}: TxtProps) => {
  return <Txt block uppercase bold color="hint" fontSize="small" sx={{mb: 1}} {...props}>{children}</Txt>
}

export const AccessForm = ({
  form,
  hideOffice,
  hideGroup,
}: {
  hideOffice?: boolean
  hideGroup?: boolean
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const fetcherGroups = useFetcher(api.group.getAllWithItems)
  const groupIndex = useMemo(() => {
    return seq(fetcherGroups.entity).groupByFirst(_ => _.id)
  }, [fetcherGroups.entity])

  useEffect(() => {
    if (!hideGroup) fetcherGroups.fetch()
  }, [])

  useEffect(() => {
    if (form.watch('selectBy') !== 'group')
      form.setValue('groupId', undefined)
  }, [form.watch('selectBy')])

  return (
    <>
      {JSON.stringify(form.watch('groupId'))}
      <AccessFormSection>{m.Access.giveAccessBy}</AccessFormSection>
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
            {!hideGroup && (
              <ScRadioGroupItem value="group" title={m.group}/>
            )}
          </ScRadioGroup>
        )}
      />
      {form.watch('selectBy') === 'group' && (
        <>
          <Controller
            name="groupId"
            rules={{required: {value: true, message: m.required}}}
            control={form.control}
            render={({field: {onChange, ...field}}) => (
              <Autocomplete
                {...field}
                loading={fetcherGroups.loading}
                onChange={(e: any, _) => _ && onChange(_.id ?? undefined)}
                sx={{mb: 2.5}}
                // renderTags={_ => }
                options={fetcherGroups.entity?.map(_ => ({label: _.name, id: _.id})) ?? []}
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
                    {option.label}
                  </Box>
                )}
                renderInput={({InputProps, ...props}) =>
                  <AaInput helperText={null} label={m.group} {...InputProps} {...props}/>
                }
              />
            )}
          />
          {map(form.watch('groupId'), groupId => (
            <>
              <Sheet header={null} id="access" defaultLimit={5} data={groupIndex[groupId]?.items} columns={[
                {type: 'string', id: 'email', head: m.email, render: _ => _.email},
                {type: 'select_one', id: 'drcJob', head: m.drcJob, render: _ => _.drcJob},
                {type: 'select_one', id: 'level', head: m.accessLevel, render: _ => _.level},
              ]}/>
            </>
          ))}
        </>
      )}
      {form.watch('selectBy') === 'job' && (
        <Controller
          name="drcJob"
          rules={{required: {value: true, message: m.required}}}
          control={form.control}
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
      )}
      {!hideOffice && (form.watch('selectBy') === 'job' || form.watch('selectBy') === 'group') && (
        <Controller
          name="drcOffice"
          control={form.control}
          render={({field: {onChange, ...field}}) => (
            <AaSelect<DrcOffice>
              {...field}
              showUndefinedOption
              label={m.drcOffice}
              onChange={_ => onChange(_)}
              options={Enum.values(DrcOffice)}
              sx={{mb: 2.5}}
            />
          )}
        />
      )}
      {form.watch('selectBy') === 'email' && (
        <AaInput
          sx={{mb: 2.5}}
          label={m.drcEmail}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message as string}
          {...form.register('email', {required: false, pattern: {value: /(@drc.ngo$|\s)/, message: m.invalidEmail}})}
        />
      )}
      {form.watch('selectBy') === 'group' && (
        <>
          <AccessFormSection>{m.accessLevel}</AccessFormSection>
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
        </>
      )}
    </>
  )
}