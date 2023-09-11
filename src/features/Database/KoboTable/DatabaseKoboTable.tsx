import {KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
import React, {useEffect} from 'react'
import {useDatabaseContext} from '@/features/Database/DatabasesContext'
import {useParams} from 'react-router'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {map} from '@alexandreannic/ts-utils'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {databaseUrlParamsValidation} from '@/features/Database/Databases'
import {useAaToast} from '@/core/useToast'
import {DatabaseKoboTableContent} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useSession} from '@/core/Session/SessionContext'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboTableContext'

export const DatabaseTableRoute = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {api} = useAppSettings()
  const {accesses, session} = useSession()
  const {toastHttpError, toastLoading} = useAaToast()
  const ctx = useDatabaseKoboTableContext()

  const _refresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(serverId, formId)
    await ctx.fetcherAnswers.fetch({force: true, clean: false})
  })

  const _edit = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(serverId, formId, answerId).then(_ => {
      if (_.url) {
        window.open(_.url, '_blank')
      }
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const data = ctx.fetcherAnswers.entity

  // useEffectFn(_formSchemas.error, toastHttpError)

  return (
    <Page loading={ctx.fetcherAnswers.loading} width="full">
      <Panel>
        {data && ctx.schemaHelper.sanitizedSchemamap(_formSchemas.get(formId), schema => (
          <DatabaseKoboTableContent
            _edit={_edit}
            data={data.data}
            schema={schema}
            _refresh={_refresh}
            canEdit={access.write}
          />
        ))}
      </Panel>
    </Page>
  )
}
