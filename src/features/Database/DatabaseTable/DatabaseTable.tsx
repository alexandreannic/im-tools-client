import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
import {KoboDatabase} from '@/features/Database/DatabaseTable/KoboDatabase'
import {KoboDatabaseBtn} from '@/features/Database/DatabaseTable/koboDatabaseShared'
import React, {useEffect} from 'react'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useParams} from 'react-router'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {map} from '@alexandreannic/ts-utils'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {KoboDatabaseProvider} from '@/features/Database/DatabaseTable/KoboDatabaseContext'
import {useAaToast} from '@/core/useToast'

export const DatabaseTableRoute = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()

  const _formSchemas = useDatabaseContext().formSchemas
  const _refresh = useAsync(() => api.koboApi.synchronizeAnswers(serverId, formId))
  const _answers = useFetcher((id: KoboId) => api.kobo.answer.searchByAccess({
    formId: id,
  }))

  const data = _answers.entity

  const refresh = async () => {
    await _refresh.call()
    await _answers.fetch({force: true, clean: false}, formId)
  }

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
          <KoboDatabaseProvider form={schema}>
            <KoboDatabase data={data.data} header={
              <KoboDatabaseBtn loading={_refresh.getLoading()} color="primary" icon="refresh" tooltip={m.refresh} onClick={refresh}/>
            }/>
          </KoboDatabaseProvider>
        ))}
      </Panel>
    </Page>
  )
}
