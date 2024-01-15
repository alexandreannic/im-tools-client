import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {Tooltip} from '@mui/material'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {KoboFormName, KoboIndex} from '@/KoboIndex'
import {DatabaseTable} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {SafetyIncidentDashboard} from '@/features/Safety/IncidentsDashboard/SafetyIncidentDashboard'
import {Panel} from '@/shared/Panel'
import {Page} from '@/shared/Page'

const relatedKoboForms: (KoboFormName)[] = [
  'safety_incident',
]

export const safetyModule = {
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
        <NavLink to={path(safetyModule.siteMap.incidentDashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="equalizer" active={isActive}>{m.safety.incidentTrackerTitle}</SidebarItem>
          )}
        </NavLink>
        <SidebarHr/>
        <SidebarSection title={m.koboForms}>
          {relatedKoboForms.map(_ => {
            const name = KoboIndex.byName(_).parsed.name
            return (
              <Tooltip key={_} title={name} placement="right">
                <NavLink to={path(safetyModule.siteMap.form(_))}>
                  {({isActive, isPending}) => (
                    <SidebarItem size="small" active={isActive} icon="calendar_view_month">{name}</SidebarItem>
                  )}
                </NavLink>
              </Tooltip>
            )
          })}
        </SidebarSection>
        {/*<NavLink to={path(mpcaModule.siteMap.paymentTools)}>*/}
        {/*  <SidebarItem icon="savings">{m.mpcaDb.paymentTools}</SidebarItem>*/}
        {/*</NavLink>*/}
        {/*<NavLink to={path(mpcaModule.siteMap.deduplication)}>*/}
        {/*  <SidebarItem icon="join_left">{m.wfpDeduplication}</SidebarItem>*/}
        {/*</NavLink>*/}
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
          <Route path={safetyModule.siteMap.incidentDashboard} element={<SafetyIncidentDashboard/>}/>
          {relatedKoboForms.map(_ =>
            <Route key={_} path={safetyModule.siteMap.form(_)} element={
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

