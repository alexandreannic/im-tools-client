import React, {useEffect, useMemo} from 'react'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useParams} from 'react-router'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {map} from '@alexandreannic/ts-utils'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {useAaToast} from '@/core/useToast'
import {DatabaseKoboTableContent} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {useSession} from '@/core/Session/SessionContext'
import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {DatabaseKoboTableProvider} from '@/features/Database/KoboTable/DatabaseKoboContext'

export const DatabaseTableRoute = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {api} = useAppSettings()
  const {accesses, session} = useSession()
  const {toastHttpError, toastLoading} = useAaToast()
  const ctx = useDatabaseContext()

  const access = useMemo(() => {
    const list = accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).filter(_ => _.params?.koboFormId === formId)
    const admin = session.admin || !!list.find(_ => _.level === AccessLevel.Admin)
    const write = admin || !!list.find(_ => _.level === AccessLevel.Write)
    const read = write || list.length > 0
    return {admin, write, read}
  }, [accesses])

  const _formSchemas = useDatabaseContext().formSchemas
  const _answers = useFetcher(() => api.kobo.answer.searchByAccess({
    formId,
  }))

  useEffect(() => {
    _formSchemas.fetch({}, serverId, formId)
    _answers.fetch({})
  }, [serverId, formId])

  // useEffectFn(_formSchemas.error, toastHttpError)
  useEffectFn(_answers.error, toastHttpError)

  return (
    <Page loading={_formSchemas.getLoading(formId) || _answers.loading} width="full">
      <Panel>
        {map(_answers.entity, _formSchemas.get(formId), ctx.getForm(formId), (data, schema, form) => (
          <DatabaseKoboTableProvider
            canEdit={access.write}
            formId={formId}
            serverId={serverId}
            fetcherAnswers={_answers}
            schema={schema}
            data={data.data}
            form={form}
          >
            <DatabaseKoboTableContent/>
          </DatabaseKoboTableProvider>
        ))}
      </Panel>
    </Page>
  )
}
