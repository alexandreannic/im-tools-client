import {HashRouter as Router, Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {KoboFormName, KoboIndex} from '@/KoboIndex'
import {DatabaseTable} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {SafetyIncidentDashboard} from '@/features/Safety/IncidentsDashboard/SafetyIncidentDashboard'
import {Panel} from '@/shared/Panel'
import {Page} from '@/shared/Page'
import {SidebarKoboLink} from '@/features/SidebarKoboLink'

const relatedKoboForms: (KoboFormName)[] = [
  'safety_incident',
]

export const safetyIndex = {
  basePath: '/safety',
  siteMap: {
    incidentDashboard: '/incident-dashboard',
    form: (id = ':id') => '/form/' + id,
  }
}

const MpcaSidebar = () => {
  const path = (page: string) => '' + page
  const {m, formatLargeNumber} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(safetyIndex.siteMap.incidentDashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="equalizer" active={isActive}>{m.safety.incidentTrackerTitle}</SidebarItem>
          )}
        </NavLink>
        <SidebarHr/>
        <SidebarSection title={m.koboForms}>
          {relatedKoboForms.map(_ =>
            <SidebarKoboLink key={_} path={path(safetyIndex.siteMap.form(_))} name={_}/>
          )}
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  )
}

export const Safety = () => {
  const {session, accesses} = useSession()
  const access = useMemo(() => !!appFeaturesIndex.safety.showIf?.(session, accesses), [accesses])
  if (!access) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <Router>
      <Layout
        sidebar={<MpcaSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        <Routes>
          <Route index element={<Navigate to={safetyIndex.siteMap.incidentDashboard}/>}/>
          <Route index path={safetyIndex.siteMap.incidentDashboard} element={<SafetyIncidentDashboard/>}/>
          {relatedKoboForms.map(_ =>
            <Route key={_} path={safetyIndex.siteMap.form(_)} element={
              <Page width="full">
                <Panel>
                  <DatabaseTable formId={KoboIndex.byName(_).id}/>
                </Panel>
              </Page>
            }/>
          )}
        </Routes>
      </Layout>
    </Router>
  )
}

