import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {useCallback, useEffect, useMemo} from 'react'
import {Txt} from 'mui-extension'
import {Autocomplete, Box, Chip, createFilterOptions} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaSelect} from '@/shared/Select/Select'
import {Controller, useForm} from 'react-hook-form'
import {Access, AccessLevel, KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Page} from '@/shared/Page'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {DrcJob, DrcOffice} from '@/core/drcJobTitle'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAsync} from '@/features/useAsync'
import {Sheet} from '@/shared/Sheet/Sheet'
import {DatabaseAccessForm} from '@/features/Database/DatabaseAccess/DatabaseAccessForm'
import {Panel, PanelHead} from '@/shared/Panel'
import {AAIconBtn} from '@/shared/IconBtn'
import {useSession} from '@/core/Session/SessionContext'
import {AccessTable} from '@/features/Access/AccessTable'

interface Form {
  selectBy?: 'email' | 'job'
  email?: string
  drcOffice?: DrcOffice
  drcJob?: DrcJob
  accessLevel: AccessLevel
  question: string
  questionAnswer: string[]
  // filters: Record<string, string[]>
}


export const DatabaseAccessRoute = () => {
  const _formSchemas = useDatabaseContext().formSchemas
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const form = _formSchemas.get(formId)

  useEffect(() => {
    _formSchemas.fetch({force: true}, serverId, formId)
  }, [serverId, formId])

  return (
    <Page width="lg" loading={_formSchemas.getLoading(formId)}>
      {form && (
        <DatabaseAccess formId={formId} form={form}/>
      )}
    </Page>
  )

}

export const DatabaseAccess = ({
  formId,
  form,
}: {
  formId: KoboId,
  form: KoboApiForm
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const {session} = useSession()

  const requestInConstToFixTsInference = () => api.access.search({featureId: AppFeatureId.kobo_database})
    .then(_ => _.filter(_ => _.params?.koboFormId === formId))
  const _get = useFetchers(requestInConstToFixTsInference)
  const _remove = useAsync(api.access.remove)

  const refresh = () => {
    _get.fetch({force: true, clean: false})
  }

  useEffect(() => {
    _get.fetch({})
  }, [formId])

  return (
    <Box>
      <Panel>
        <AccessTable
          _remove={_remove}
          _data={_get}
          renderParams={(_: KoboDatabaseAccessParams) => JSON.stringify(_.filters)}
          onRemoved={refresh}
          header={
            session.admin && (
              <DatabaseAccessForm formId={formId} form={form} onAdded={refresh}>
                <AaBtn sx={{mr: 1}} variant="contained" icon="person_add">{m.grantAccess}</AaBtn>
              </DatabaseAccessForm>
            )
          }/>
      </Panel>
    </Box>
  )
}
