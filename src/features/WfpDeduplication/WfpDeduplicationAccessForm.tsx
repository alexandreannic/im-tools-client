import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement, useCallback, useMemo} from 'react'
import {Modal, Txt} from 'mui-extension'
import {Autocomplete, Box, Chip, createFilterOptions} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {Controller, useForm} from 'react-hook-form'
import {KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {useAsync} from '@/features/useAsync'
import {useAaToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {DrcOffice} from '@/core/drcJobTitle'
import {AaSelect} from '@/shared/Select/Select'

interface Form extends IAccessForm {
  drcOfficesDataFilter: DrcOffice[]
}

export const WfpDeduplicationAccessForm = ({
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

  useEffectFn(_addAccess.getError(), toastHttpError)
  useEffectFn(_access.getError(), toastHttpError)

  const accessForm = useForm<Form>()

  const submit = (f: Form) => {
    _addAccess.call({
      level: f.level,
      drcJob: f.drcJob,
      drcOffice: f.drcOffice,
      email: f.email,
      featureId: AppFeatureId.wfp_deduplication,
      params: {filters: {office: f.drcOfficesDataFilter}},
    }).then(onAdded)
  }

  return (
    <Modal
      loading={_addAccess.getLoading()}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) => accessForm.handleSubmit(_ => {
        submit(_)
        close()
      })()}
      content={
        <Box sx={{width: 400}}>
          <AccessForm form={accessForm}/>
          <Controller
            name="drcOfficesDataFilter"
            rules={{required: {value: true, message: m.required}}}
            control={accessForm.control}
            render={({field: {onChange, ...field}}) => (
              <AaSelect<DrcOffice>
                {...field}
                defaultValue={[]}
                multiple={true}
                label={m._wfpDeduplication.filterByDrcOffice}
                onChange={_ => onChange(_)}
                options={Enum.values(DrcOffice)}
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
