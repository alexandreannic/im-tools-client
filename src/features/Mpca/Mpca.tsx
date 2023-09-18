import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import {MPCAProvider} from './MpcaContext'
import React, {useMemo} from 'react'
import {MpcaData} from '@/features/Mpca/MpcaData/MpcaData'
import {MpcaDashboard} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {MpcaPaymentTools} from '@/features/Mpca/PaymentTools/MpcaPaymentTools'
import {MpcaPaymentTool} from '@/features/Mpca/PaymentTool/MpcaPaymentTool'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {WfpDeduplicationData} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'

export const mpcaModule = {
  basePath: '/mpca',
  siteMap: {
    deduplication: '/deduplication',
    data: '/data',
    dashboard: '/',
    paymentTools: '/payment-tools',
    paymentTool: (id = ':id') => '/payment-tool/' + id,
  }
}

const MPCASidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(mpcaModule.siteMap.dashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="equalizer" active={isActive}>{m.dashboard}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(mpcaModule.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
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

export const Mpca = () => {
  const {session, accesses} = useSession()
  const access = useMemo(() => !!appFeaturesIndex.mpca.showIf?.(session, accesses), [accesses])
  if (!access) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <Router>
      <MPCAProvider>
        <Layout
          sidebar={<MPCASidebar/>}
          header={<AppHeader id="app-header"/>}
        >
          <Routes>
            <Route path={mpcaModule.siteMap.dashboard} element={<MpcaDashboard/>}/>
            <Route path={mpcaModule.siteMap.deduplication} element={<WfpDeduplicationData/>}/>
            <Route path={mpcaModule.siteMap.data} element={<MpcaData/>}/>
            <Route path={mpcaModule.siteMap.paymentTools} element={<MpcaPaymentTools/>}/>
            <Route path={mpcaModule.siteMap.paymentTool()} element={<MpcaPaymentTool/>}/>
          </Routes>
        </Layout>
      </MPCAProvider>
    </Router>
  )
}

