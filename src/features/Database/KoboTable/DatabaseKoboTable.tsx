import {KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
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
import {useAsync} from '@/alexlib-labo/useAsync'
import {useSession} from '@/core/Session/SessionContext'
import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'

export const DatabaseTableRoute = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m, formatDate, formatLargeNumber} = useI18n()
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
  const _answers = useFetcher((id: KoboId) => api.kobo.answer.searchByAccess({
    formId: id,
  }))

  const _refresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(serverId, formId)
    await _answers.fetch({force: true, clean: false}, formId)
  })

  const _edit = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(serverId, formId, answerId).then(_ => {
      if (_.url) {
        window.open(_.url, '_blank')
      }
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const data = _answers.entity

  useEffect(() => {
    _formSchemas.fetch({}, serverId, formId)
    _answers.fetch({}, formId)
  }, [serverId, formId])

  // useEffectFn(_formSchemas.error, toastHttpError)
  useEffectFn(_answers.error, toastHttpError)

  return (
    <Page loading={_formSchemas.getLoading(formId) || _answers.loading} width="full">
      <Panel>
        {data && map(_formSchemas.get(formId), ctx.getForm(formId), (schema, form) => (
          <DatabaseKoboTableContent
            _edit={_edit}
            data={data.data}
            form={form}
            schema={schema}
            _refresh={_refresh}
            canEdit={access.write}
          />
        ))}
      </Panel>
    </Page>
  )
}
