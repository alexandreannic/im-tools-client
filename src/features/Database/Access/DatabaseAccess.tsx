import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {useEffect, useMemo} from 'react'
import {Box} from '@mui/material'
import {Access, AccessLevel, KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Page} from '@/shared/Page'
import {DrcJob, DrcOffice} from '@/core/drcUa'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {DatabaseAccessForm} from '@/features/Database/Access/DatabaseAccessForm'
import {Panel} from '@/shared/Panel'
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
  const {session, accesses} = useSession()

  const accessSum = useMemo(() => {
    return Access.toSum(
      accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).filter(_ => _.params?.koboFormId === formId),
      session.admin
    )
  }, [session, accesses])

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
          isAdmin={accessSum.admin}
          _remove={_remove}
          _data={_get}
          renderParams={(_: KoboDatabaseAccessParams) => JSON.stringify(_.filters)}
          onRemoved={refresh}
          header={
            accessSum && (
              <DatabaseAccessForm formId={formId} form={form} onAdded={refresh}>
                <AaBtn sx={{mr: 1}} variant="contained" icon="person_add">{m.grantAccess}</AaBtn>
              </DatabaseAccessForm>
            )
          }/>
      </Panel>
    </Box>
  )
}
