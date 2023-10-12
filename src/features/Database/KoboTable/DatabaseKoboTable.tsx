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
import {UUID} from '@/core/type'
import {KoboForm, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {kobo} from '@/koboDrcUaFormId'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {KoboSchemaProvider} from '@/features/Kobo/KoboSchemaContext'

export const DatabaseTableRoute = () => {
  const ctx = useDatabaseContext()
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  return (
    <>
      {map(ctx.getForm(formId), form =>
        <DatabaseTablePage
          serverId={serverId}
          form={form}
          formId={formId}
        />
      )}
    </>
  )
}

export const DatabaseTablePage = ({
  serverId = kobo.drcUa.server.prod,
  form,
  schema,
  formId,
}: {
  form?: KoboForm
  schema?: KoboApiForm
  serverId?: UUID
  formId: KoboId
}) => {
  const {api} = useAppSettings()
  const {accesses, session} = useSession()
  const {toastHttpError, toastLoading} = useAaToast()

  const _formSchema = useFetcher(() => schema ? Promise.resolve(schema) : api.koboApi.getForm(serverId, formId))
  const _form = useFetcher(() => form ? Promise.resolve(form) : api.kobo.form.get(formId))
  const _answers = useFetcher(() => api.kobo.answer.searchByAccess({
    formId,
  }))

  const access = useMemo(() => {
    const list = accesses.filter(Access.filterByFeature(AppFeatureId.kobo_database)).filter(_ => _.params?.koboFormId === formId)
    const admin = session.admin || !!list.find(_ => _.level === AccessLevel.Admin)
    const write = admin || !!list.find(_ => _.level === AccessLevel.Write)
    const read = write || list.length > 0
    return {admin, write, read}
  }, [accesses])


  useEffect(() => {
    _formSchema.fetch({})
    _answers.fetch({})
    _form.fetch()
  }, [serverId, formId])

  useEffectFn(_formSchema.error, toastHttpError)
  useEffectFn(_answers.error, toastHttpError)

  return (
    <Page loading={_formSchema.loading || _answers.loading} width="full">
      <Panel>
        {map(_answers.entity, _formSchema.entity, _form.entity, (data, schema, form) => (
          <KoboSchemaProvider schema={schema}>
            <DatabaseKoboTableProvider
              canEdit={access.write}
              serverId={serverId}
              fetcherAnswers={_answers}
              data={data.data}
              form={form}
            >
              <DatabaseKoboTableContent/>
            </DatabaseKoboTableProvider>
          </KoboSchemaProvider>
        ))}
      </Panel>
    </Page>
  )
}
