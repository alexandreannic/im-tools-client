import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '../../shared/Layout/Sidebar'
import {Layout} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {MPCADeduplicationProvider} from './MpcaDeduplicationContext'
import React, {useMemo} from 'react'
import {MpcaDeduplicationDb} from './MpcaDeduplicationDb'
import {MpcaDedupTable} from '@/features/Mpca/DedupTable/MpcaDedupTable'
import {MpcaDashboard} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {MpcaPaymentTools} from '@/features/Mpca/PaymentTools/MpcaPaymentTools'
import {MpcaPaymentTool} from '@/features/Mpca/PaymentTool/MpcaPaymentTool'
import {Header} from '@/shared/Layout/Header/Header'

export const mpcaModule = {
  basePath: '/mpca',
  siteMap: {
    deduplication: '/deduplication',
    dashboard: '/dashboard',
    paymentTools: '/payment-tools',
    paymentTool: (id = ':id') => '/payment-tool/' + id,
  }
}

const MPCASidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  return (
    <Sidebar headerId="app-header">
      <SidebarBody>
        <SidebarItem component={NavLink} icon="equalizer" to={path(mpcaModule.siteMap.dashboard)}>{m.dashboard}</SidebarItem>
        <SidebarItem component={NavLink} icon="content_copy" to={path(mpcaModule.siteMap.deduplication)}>{m.deduplication}</SidebarItem>
        <SidebarItem component={NavLink} icon="savings" to={path(mpcaModule.siteMap.paymentTools)}>{m.mpcaDb.paymentTools}</SidebarItem>
      </SidebarBody>
    </Sidebar>
  )
}

export const Mpca = () => {
  const db = useMemo(() => new MpcaDeduplicationDb(), [])
  return (
    <Router>
      <MPCADeduplicationProvider db={db}>
        <Layout
          sidebar={<MPCASidebar/>}
          header={<Header id="app-header"/>}
        >
          <Routes>
            <Route path={mpcaModule.siteMap.deduplication} element={<MpcaDedupTable/>}/>
            <Route path={mpcaModule.siteMap.dashboard} element={<MpcaDashboard/>}/>
            <Route path={mpcaModule.siteMap.paymentTools} element={<MpcaPaymentTools/>}/>
            <Route path={mpcaModule.siteMap.paymentTool()} element={<MpcaPaymentTool/>}/>
          </Routes>
        </Layout>
      </MPCADeduplicationProvider>
    </Router>
  )
}
