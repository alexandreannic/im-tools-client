import {useAppSettings} from '@/core/context/ConfigContext'
import {AppFeatureId} from '@/features/appFeatureId'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {AccessTable} from '@/features/Access/AccessTable'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {Panel} from '@/shared/Panel'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Page} from '@/shared/Page'
import {CfmAccessForm} from '@/features/Cfm/Access/CfmAccessForm'
import {useCfmContext} from '@/features/Cfm/CfmContext'

export const CfmAccess = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const ctx = useCfmContext()

  const _get = useFetchers(() => api.access.search({featureId: AppFeatureId.cfm}))
  const _remove = useAsync(api.access.remove)


  const refresh = () => {
    _get.fetch({force: true, clean: false})
  }

  useEffect(() => {
    _get.fetch({})
  }, [])

  return (
    <Page width="lg">
      <Panel>
        <AccessTable
          asyncRemove={_remove}
          fetcherData={_get}
          isAdmin={ctx.authorizations.sum.admin}
          // renderParams={(_: WfpDeduplicationAccessParams) => JSON.stringify(_.filters)}
          onRemoved={refresh}
          header={
            ctx.authorizations.sum.admin && (
              <CfmAccessForm onAdded={refresh}>
                <AaBtn sx={{mr: 1}} variant="contained" icon="person_add">{m.grantAccess}</AaBtn>
              </CfmAccessForm>
            )
          }/>
      </Panel>
    </Page>
  )
}