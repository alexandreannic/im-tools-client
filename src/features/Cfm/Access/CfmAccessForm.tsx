import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement} from 'react'
import {Modal} from 'mui-extension'
import {Box, Switch} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
import {Enum} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useAaToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, AccessFormSection, IAccessForm} from '@/features/Access/AccessForm'
import {DrcOffice} from '@/core/drcJobTitle'
import {AaSelect} from '@/shared/Select/Select'
import {CfmDataProgram} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {useCfmContext} from '@/features/Cfm/CfmContext'

interface Form extends IAccessForm {
  office?: DrcOffice[]
  program?: CfmDataProgram[]
  // seeHisOwn?: boolean
}

export const CfmAccessForm = ({
  children,
  onAdded,
}: {
  onAdded?: () => void,
  children: ReactElement,
}) => {
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()
  const {api} = useAppSettings()
  const ctx = useCfmContext()

  const _addAccess = useAsync(api.access.add)
  const requestInConstToFixTsInference = (databaseId: KoboId) => api.access.search({featureId: AppFeatureId.kobo_database})
    .then(_ => _.filter(_ => _.params?.koboFormId === databaseId))
  const _access = useFetchers(requestInConstToFixTsInference)

  useEffectFn(_addAccess.errors.size, _ => _ > 1 && toastHttpError)
  useEffectFn(_access.getError(), toastHttpError)

  const accessForm = useForm<Form>()

  const submit = (f: Form) => {
    _addAccess.call({
      level: f.level,
      drcJob: f.drcJob,
      drcOffice: f.drcOffice,
      email: f.email,
      featureId: AppFeatureId.cfm,
      params: {
        office: f.office,
        program: f.program,
        // seeHisOwn: f.seeHisOwn,
      }
    }).then(onAdded)
  }

  return (
    <Modal
      loading={_addAccess.loading.size > 0}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) => accessForm.handleSubmit(_ => {
        submit(_)
        close()
      })()}
      content={
        <Box sx={{width: 400}}>
          <AccessForm form={accessForm}/>
          <AccessFormSection>{m.filter}</AccessFormSection>
          <Controller
            name="office"
            control={accessForm.control}
            rules={{
              required: !!ctx.authorizations.accessibleOffices
            }}
            render={({field: {onChange, ...field}}) => (
              <AaSelect<DrcOffice>
                {...field}
                defaultValue={[]}
                multiple={true}
                label={m.drcOffice}
                onChange={_ => onChange(_)}
                options={ctx.authorizations.accessibleOffices ?? Enum.keys(DrcOffice)}
                sx={{mb: 2.5}}
              />
            )}
          />
          <Controller
            rules={{
              required: !!ctx.authorizations.accessiblePrograms
            }}
            name="program"
            control={accessForm.control}
            render={({field: {onChange, ...field}}) => (
              <AaSelect<CfmDataProgram>
                {...field}
                defaultValue={[]}
                multiple={true}
                label={m.program}
                onChange={_ => onChange(_)}
                options={ctx.authorizations.accessiblePrograms ?? Enum.keys(CfmDataProgram)}
                sx={{mb: 2.5}}
              />
            )}
          />
          {/*<Controller*/}
          {/*  name="seeHisOwn"*/}
          {/*  control={accessForm.control}*/}
          {/*  render={({field: {onChange, ...field}}) => (*/}
          {/*    <Switch*/}
          {/*      {...field}*/}
          {/*      onChange={_ => onChange(_.target.checked)}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
        </Box>
      }
    >
      {children}
    </Modal>
  )
}