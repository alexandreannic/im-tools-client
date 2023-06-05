import {Outlet} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '../../shared/Layout/Sidebar'
import {Layout} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {MPCADeduplicationProvider} from './MPCADeduplicationContext'
import {useMemo} from 'react'
import {MPCADeduplicationDb} from './MPCADeduplicationDb'

export const mpcaModule = {
  basePath: '/mpca',
  siteMap: {
    deduplication: 'deduplication',
    dashboard: 'dashboard',
    paymentTools: 'finance',
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
        <SidebarItem icon="savings" to={path(mpcaModule.siteMap.paymentTools)}>{m.mpcaDd.paymentTools}</SidebarItem>
      </SidebarBody>
    </Sidebar>
  )
}

export const MPCA = () => {
  const db = useMemo(() => new MPCADeduplicationDb(), [])
  return (
    <MPCADeduplicationProvider db={db}>
      <Layout sidebar={<MPCASidebar/>}>
        <Outlet/>
      </Layout>
    </MPCADeduplicationProvider>
  )
}
