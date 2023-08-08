import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {ShelterData} from '@/features/Shelter/Data/ShelterData'

export const shelterModule = {
  basePath: '/shelter',
  siteMap: {
    data: '/data',
  }
}

const ShelterSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(shelterModule.siteMap.data)}>
          <SidebarItem icon="table_chart">{m.data}</SidebarItem>
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const Shelter = () => {
  const {session, accesses} = useSession()
  const access = useMemo(() => accesses.filter(_ => _.featureId === appFeaturesIndex.mpca.id), [accesses])
  if (!session.admin && access.length === 0) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <Router>
      <Layout
        sidebar={<ShelterSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        <Routes>
          <Route path={shelterModule.siteMap.data} element={<ShelterData/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}

