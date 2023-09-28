import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement} from 'react'
import {Modal} from 'mui-extension'
import {Box} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
import {Enum} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useAaToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, AccessFormSection, IAccessForm} from '@/features/Access/AccessForm'
import {DrcOffice} from '@/core/drcUa'
import {AaSelect} from '@/shared/Select/Select'

interface Form extends IAccessForm {
  office?: DrcOffice[]
}

/** @deprecated Not used*/
export const ShelterAccessForm = ({
  children,
  onAdded,
}: {
  onAdded?: () => void,
  children: ReactElement,
}) => {
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()
  const {api} = useAppSettings()
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
      featureId: AppFeatureId.shelter,
      params: {
        office: f.office,
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
            render={({field: {onChange, ...field}}) => (
              <AaSelect<DrcOffice>
                {...field}
                defaultValue={[]}
                multiple={true}
                label={m.drcOffice}
                onChange={_ => onChange(_)}
                options={Enum.keys(DrcOffice)}
                sx={{mb: 2.5}}
              />
            )}
          />
        </Box>
      }
    >
      {children}
    </Modal>
  )
}
