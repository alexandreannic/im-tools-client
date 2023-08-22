import {HashRouter as Router, Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useEffect, useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {AppFeatureId, appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {ShelterTable} from '@/features/Shelter/Data/ShelterTable'
import {ShelterProvider} from '@/features/Shelter/ShelterContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAaToast} from '@/core/useToast'
import {ShelterAccess} from '@/features/Shelter/Access/ShelterAccess'
import Link from 'next/link'
import {databaseModule} from '@/features/Database/databaseModule'

export const shelterModule = {
  basePath: '/shelter',
  siteMap: {
    data: '/data',
    access: '/access',
  }
}

const ShelterSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const {conf} = useAppSettings()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(shelterModule.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
        <Link href={conf.linkToFeature(AppFeatureId.kobo_database, databaseModule.siteMap.access.absolute(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA))}>
          <SidebarItem icon="person_add">{m.accesses}</SidebarItem>
        </Link>
      </SidebarBody>
    </Sidebar>
  )
}

export const Shelter = () => {
  const {m} = useI18n()
  const {session, accesses} = useSession()
  const access = useMemo(() => !!appFeaturesIndex.shelter.showIf?.(session, accesses), [accesses])
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()

  const _schemas = useFetcher(async () => {
    if (!access) return
    const [ta, nta] = await Promise.all([
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelterTA),
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA),
    ])
    return {ta, nta}
  })
  useEffectFn(_schemas.error, toastHttpError)

  useEffect(() => {
    _schemas.fetch()
  }, [])

  if (!access) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <Router>
      <Layout
        title={appFeaturesIndex.shelter.name}
        sidebar={<ShelterSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        {_schemas.entity && (
          <ShelterProvider
            schemaNta={_schemas.entity.nta}
            schemaTa={_schemas.entity.ta}
          >
            <Routes>
              <Route index element={<Navigate to={shelterModule.siteMap.data}/>}/>
              <Route path={shelterModule.siteMap.data} element={<ShelterTable/>}/>
              <Route path={shelterModule.siteMap.access} element={<ShelterAccess/>}/>
            </Routes>
          </ShelterProvider>
        )}
      </Layout>
    </Router>
  )
}

