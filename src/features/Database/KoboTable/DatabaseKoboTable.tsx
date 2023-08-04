import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
import React, {useEffect} from 'react'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useParams} from 'react-router'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {map} from '@alexandreannic/ts-utils'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {useAaToast} from '@/core/useToast'
import {DatabaseKoboTableContent} from '@/features/Database/KoboTable/DatabaseKoboTableContent'

export const DatabaseTableRoute = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()

  const _formSchemas = useDatabaseContext().formSchemas
  const _answers = useFetcher((id: KoboId) => api.kobo.answer.searchByAccess({
    formId: id,
  }))
  const _refresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(serverId, formId)
    await _answers.fetch({force: true, clean: false}, formId)
  })

  const data = _answers.entity

  useEffect(() => {
    _formSchemas.fetch({}, serverId, formId)
    _answers.fetch({}, formId)
  }, [serverId, formId])

  // useEffectFn(_formSchemas.error, toastHttpError)
  useEffectFn(_answers.error, toastHttpError)

  return (
    <Page loading={_formSchemas.getLoading(formId)} width="full">
      <Panel>
        {data && map(_formSchemas.get(formId), schema => (
          <DatabaseKoboTableContent data={data.data} schema={schema} _refresh={_refresh}/>
        ))}
      </Panel>
    </Page>
  )
}