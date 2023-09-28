import {Controller, UseFormReturn} from 'react-hook-form'
import {DrcJob, DrcOffice} from '@/core/drcUa'
import {AccessLevel} from '@/core/sdk/server/access/Access'
import {Txt, TxtProps} from 'mui-extension'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Autocomplete, Chip} from '@mui/material'
import {Enum} from '@alexandreannic/ts-utils'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaSelect} from '@/shared/Select/Select'
import React from 'react'
import {useI18n} from '@/core/i18n'

export interface IAccessForm {
  selectBy?: 'email' | 'job'
  email?: string
  drcOffice?: DrcOffice
  drcJob?: DrcJob[]
  level: AccessLevel
}

export const AccessFormSection = ({children, ...props}: TxtProps) => {
  return <Txt block uppercase bold color="hint" fontSize="small" sx={{mb: 1}} {...props}>{children}</Txt>
}

export const AccessForm = ({
  form,
}: {
  form: UseFormReturn<IAccessForm & any>
}) => {
  const {m} = useI18n()
  return (
    <>
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
          </ScRadioGroup>
        )}
      />
      {form.watch('selectBy') === 'job' && (
        <>
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
        </>
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
              <ScRadioGroupItem value={level} key={level} title={level}/>
            )}
          </ScRadioGroup>
        )}
      />
    </>
  )
}