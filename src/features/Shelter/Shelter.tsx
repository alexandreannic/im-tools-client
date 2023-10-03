import {HashRouter as Router, Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
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
import Link from 'next/link'
import {databaseModule} from '@/features/Database/databaseModule'
import {ShelterDashboard} from '@/features/Shelter/Dasbhoard/ShelterDashboard'
import {DatabaseTablePage} from '@/features/Database/KoboTable/DatabaseKoboTable'

export const shelterModule = {
  basePath: '/shelter',
  siteMap: {
    data: '/data',
    access: '/access',
    dashboard: '/dashboard',
    ta: '/ta',
    nta: '/nta',
  }
}

const ShelterSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const {conf} = useAppSettings()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(shelterModule.siteMap.dashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="insights" active={isActive}>{m.dashboard}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(shelterModule.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
        <Link href={conf.linkToFeature(AppFeatureId.kobo_database, databaseModule.siteMap.access.absolute(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA))}>
          <SidebarItem icon="person_add" iconEnd="open_in_new">{m.accesses}</SidebarItem>
        </Link>
        <SidebarHr/>
        <NavLink to={path(shelterModule.siteMap.nta)}>
          {({isActive, isPending}) => (
            <SidebarItem active={isActive} icon="view_compact_alt">NTA</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(shelterModule.siteMap.ta)}>
          {({isActive, isPending}) => (
            <SidebarItem active={isActive} icon="view_compact_alt">TA</SidebarItem>
          )}
        </NavLink>
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
              <Route index element={<Navigate to={shelterModule.siteMap.dashboard}/>}/>
              <Route path={shelterModule.siteMap.dashboard} element={<ShelterDashboard/>}/>
              <Route path={shelterModule.siteMap.data} element={<ShelterTable/>}/>
              <Route path={shelterModule.siteMap.nta} element={<DatabaseTablePage formId={kobo.drcUa.form.shelterNTA} schema={_schemas.entity.nta}/>}/>
              <Route path={shelterModule.siteMap.ta} element={<DatabaseTablePage formId={kobo.drcUa.form.shelterTA} schema={_schemas.entity.ta}/>}/>
            </Routes>
          </ShelterProvider>
        )}
      </Layout>
    </Router>
  )
}

