import {useAppSettings} from '@/core/context/ConfigContext'
import {AppFeatureId} from '@/features/appFeatureId'
import {useFetchers} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useAsync} from '@/features/useAsync'
import {AccessTable} from '@/features/Access/AccessTable'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {Panel} from '@/shared/Panel'
import React, {useEffect} from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {WfpDeduplicationAccessForm} from '@/features/WfpDeduplication/WfpDeduplicationAccessForm'
import {useI18n} from '@/core/i18n'
import {Page} from '@/shared/Page'

export const WfpDeduplicationAccess = () => {
  const {api} = useAppSettings()
  const {session} = useSession()
  const {m} = useI18n()

  const _get = useFetchers(() => api.access.search({featureId: AppFeatureId.wfp_deduplication}))
  const _remove = useAsync(api.access.remove)

  const refresh = () => {
    _get.fetch({force: true, clean: false})
  }

  useEffect(() => {
    _get.fetch({})
  }, [])

  return (
    <Page>
      <Panel>
        <AccessTable
          _remove={_remove}
          _data={_get}
          onRemoved={refresh}
          header={
            session.admin && (
              <WfpDeduplicationAccessForm onAdded={refresh}>
                <AaBtn sx={{mr: 1}} variant="contained" icon="person_add">{m.grantAccess}</AaBtn>
              </WfpDeduplicationAccessForm>
            )
          }/>
      </Panel>
    </Page>
  )
}