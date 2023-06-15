import {Outlet} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '../../shared/Layout/Sidebar'
import {Layout} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {MPCADeduplicationProvider} from './MpcaDeduplicationContext'
import {useMemo} from 'react'
import {MpcaDeduplicationDb} from './MpcaDeduplicationDb'

export const mpcaModule = {
  basePath: '/mpca',
  siteMap: {
    deduplication: 'deduplication',
    dashboard: 'dashboard',
    paymentTools: 'payment-tools',
    paymentTool: (id = ':id') => 'payment-tool/' + id,
  }
}

const MPCASidebar = () => {
  const path = (page: string) => mpcaModule.basePath + '/' + page
  const {m} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarItem icon="equalizer" to={path(mpcaModule.siteMap.dashboard)}>{m.dashboard}</SidebarItem>
        <SidebarItem icon="content_copy" to={path(mpcaModule.siteMap.deduplication)}>{m.deduplication}</SidebarItem>
        <SidebarItem icon="savings" to={path(mpcaModule.siteMap.paymentTools)}>{m.mpcaDb.paymentTools}</SidebarItem>
      </SidebarBody>
    </Sidebar>
  )
}

export const Mpca = () => {
  const db = useMemo(() => new MpcaDeduplicationDb(), [])
  return (
    <MPCADeduplicationProvider db={db}>
      <Layout sidebar={<MPCASidebar/>}>
        <Outlet/>
      </Layout>
    </MPCADeduplicationProvider>
  )
}
