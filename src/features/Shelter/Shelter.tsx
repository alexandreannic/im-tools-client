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
import {useShelterData} from '@/features/Shelter/useShelterData'
import {seq} from '@alexandreannic/ts-utils'
import {Access} from '@/core/sdk/server/access/Access'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {Skeleton} from '@mui/material'
import {PagePlaceholder} from '@/shared/Page'

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
        <Link href={conf.linkToFeature(AppFeatureId.kobo_database, databaseModule.siteMap.access.absolute(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_nta))}>
          <SidebarItem icon="person_add" iconEnd="open_in_new">{m.accesses}</SidebarItem>
        </Link>
        <SidebarHr/>
        <NavLink to={path(shelterModule.siteMap.nta)}>
          {({isActive, isPending}) => (
            <SidebarItem active={isActive} icon="calendar_view_month">NTA</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(shelterModule.siteMap.ta)}>
          {({isActive, isPending}) => (
            <SidebarItem active={isActive} icon="calendar_view_month">TA</SidebarItem>
          )}
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const Shelter = () => {
  const {session, accesses} = useSession()
  const canOpen = useMemo(() => !!appFeaturesIndex.shelter.showIf?.(session, accesses), [accesses])
  return canOpen ? <ShelterWithAccess/> : <NoFeatureAccessPage/>
}

export const ShelterWithAccess = () => {
  const {session, accesses} = useSession()
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()

  const {access, allowedOffices} = useMemo(() => {
    const cfmAccesses = seq(accesses).filter(Access.filterByFeature(AppFeatureId.kobo_database))
    const allowedOffices = cfmAccesses.flatMap(_ => {
      return _.params?.filters?.back_office as Shelter_NTA['back_office'][] | undefined
    }).compact()
    return {
      access: Access.toSum(cfmAccesses, session.admin),
      allowedOffices,
    }
  }, [session, accesses])

  const fetcherSchema = useFetcher(async () => {
    if (!access) return
    const [ta, nta] = await Promise.all([
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_ta),
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_nta),
    ])
    return {ta, nta}
  })

  const fetcherData = useShelterData(allowedOffices)

  useEffectFn(fetcherSchema.error, toastHttpError)


  useEffect(() => {
    fetcherData.fetchAll()
    fetcherSchema.fetch()
  }, [])

  return (
    <Router>
      <Layout
        title={appFeaturesIndex.shelter.name}
        sidebar={<ShelterSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        {fetcherSchema.loading ? (
          <PagePlaceholder width="full"/>
        ) : fetcherSchema.entity && (
          <ShelterProvider
            access={access}
            data={fetcherData}
            schemaNta={fetcherSchema.entity.nta}
            schemaTa={fetcherSchema.entity.ta}
          >
            <Routes>
              <Route index element={<Navigate to={shelterModule.siteMap.data}/>}/>
              <Route path={shelterModule.siteMap.dashboard} element={<ShelterDashboard/>}/>
              <Route path={shelterModule.siteMap.data} element={<ShelterTable/>}/>
              <Route path={shelterModule.siteMap.nta} element={<DatabaseTablePage formId={kobo.drcUa.form.shelter_nta} schema={fetcherSchema.entity.nta}/>}/>
              <Route path={shelterModule.siteMap.ta} element={<DatabaseTablePage formId={kobo.drcUa.form.shelter_ta} schema={fetcherSchema.entity.ta}/>}/>
            </Routes>
          </ShelterProvider>
        )}
      </Layout>
    </Router>
  )
}



