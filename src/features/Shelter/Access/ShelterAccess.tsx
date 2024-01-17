import {useAppSettings} from '@/core/context/ConfigContext'
import {AppFeatureId} from '@/features/appFeatureId'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {useAsync} from '@/alexlib-labo/useAsync'
import {AccessTable} from '@/features/Access/AccessTable'
import {IpBtn} from '@/shared/Btn'
import {Panel} from '@/shared/Panel'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Page} from '@/shared/Page'
import {ShelterAccessForm} from '@/features/Shelter/Access/ShelterAccessForm'
import {useShelterContext} from '@/features/Shelter/ShelterContext'

/** @deprecated Not used*/
export const ShelterAccess = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const ctx = useShelterContext()

  const _get = useFetchers(() => api.access.search({featureId: AppFeatureId.shelter}))
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
          isAdmin={ctx.access.admin}
          // renderParams={(_: WfpDeduplicationAccessParams) => JSON.stringify(_.filters)}
          onRemoved={refresh}
          header={
            ctx.access.admin && (
              <ShelterAccessForm onAdded={refresh}>
                <IpBtn sx={{mr: 1}} variant="contained" icon="person_add">{m.grantAccess}</IpBtn>
              </ShelterAccessForm>
            )
          }/>
      </Panel>
    </Page>
  )
}