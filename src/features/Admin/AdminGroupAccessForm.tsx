import {useI18n} from '@/core/i18n'
import React, {useEffect} from 'react'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {Controller, UseFormReturn} from 'react-hook-form'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {AccessFormInputAccessLevel, AccessFormInputDrcJob, AccessFormInputDrcOffice, AccessFormInputEmail, AccessFormInputGroup, IAccessForm} from '@/features/Access/AccessForm'

export const AdminGroupAccessForm = ({
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
            </ScRadioGroup>
          )}
        />
        {fnSwitch(watchSelectBy!, {
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
      <AccessFormSection icon="lock" label={m.accessLevel}>
        <AccessFormInputAccessLevel form={form}/>
      </AccessFormSection>
    </>
  )
}