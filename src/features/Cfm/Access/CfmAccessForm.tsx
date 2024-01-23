import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement} from 'react'
import {Modal} from 'mui-extension'
import {Box} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
import {Enum} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useAsync} from '@/shared/hook/useAsync'
import {useIpToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {DrcOffice} from '@/core/type/drc'
import {AaSelect} from '@/shared/Select/Select'
import {CfmDataProgram} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {useCfmContext} from '@/features/Cfm/CfmContext'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {Utils} from '@/utils/utils'
import {useFetcher} from '@/shared/hook/useFetcher'

interface Form extends IAccessForm {
  office: DrcOffice[]
  program: CfmDataProgram[]
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
  const {toastHttpError} = useIpToast()
  const {api} = useAppSettings()
  const ctx = useCfmContext()

  const _addAccess = useAsync(api.access.create)
  const requestInConstToFixTsInference = (databaseId: KoboId) => api.access.search({featureId: AppFeatureId.kobo_database})
    .then(_ => _.filter(_ => _.params?.koboFormId === databaseId))
  const _access = useFetcher(requestInConstToFixTsInference)

  useEffectFn(_addAccess.error, _ => _ > 1 && toastHttpError)
  useEffectFn(_access.error, toastHttpError)

  const accessForm = useForm<Form>()

  const submit = ({selectBy, office, program, ...f}: Form) => {
    _addAccess.call({
      ...Utils.nullValuesToUndefined(f),
      featureId: AppFeatureId.cfm,
      params: {office, program},
    }).then(onAdded)
  }

  return (
    <Modal
      loading={_addAccess.loading}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) => accessForm.handleSubmit(_ => {
        submit(_)
        close()
      })()}
      content={
        <Box sx={{width: 400}}>
          <AccessForm form={accessForm as any}/>
          <AccessFormSection icon="filter_alt" label={m.filter}>
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
                />
              )}
            />
          </AccessFormSection>
        </Box>
      }
    >
      {children}
    </Modal>
  )
}
