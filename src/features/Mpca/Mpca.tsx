import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import {MPCADeduplicationProvider} from './MpcaDeduplicationContext'
import React, {useMemo} from 'react'
import {MpcaDeduplicationDb} from './MpcaDeduplicationDb'
import {MpcaData} from '@/features/Mpca/MpcaData/MpcaData'
import {MpcaDashboard} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {MpcaPaymentTools} from '@/features/Mpca/PaymentTools/MpcaPaymentTools'
import {MpcaPaymentTool} from '@/features/Mpca/PaymentTool/MpcaPaymentTool'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {WfpDeduplicationData} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {WfpDeduplication, WfpDeduplicationStatus} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {addMonths, differenceInMonths, isAfter, isBefore, startOfMonth} from 'date-fns'
import {WfpDeduplicationSdk} from '@/core/sdk/server/wfpDeduplication/WfpDeduplicationSdk'
import {getOverlapMonths} from '@/utils/utils'

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
    <Sidebar headerId="app-header">
      <SidebarBody>
        <SidebarItem component={NavLink} icon="equalizer" to={path(mpcaModule.siteMap.dashboard)}>{m.dashboard}</SidebarItem>
        <SidebarItem component={NavLink} icon="table_chart" to={path(mpcaModule.siteMap.data)}>{m.data}</SidebarItem>
        <SidebarItem component={NavLink} icon="savings" to={path(mpcaModule.siteMap.paymentTools)}>{m.mpcaDb.paymentTools}</SidebarItem>
        <SidebarItem component={NavLink} icon="join_left" to={path(mpcaModule.siteMap.deduplication)}>{m.wfpDeduplication}</SidebarItem>
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
      </MPCADeduplicationProvider>
    </Router>
  )
}

