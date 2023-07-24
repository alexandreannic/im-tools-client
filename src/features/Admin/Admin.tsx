import {NavLink, Route, HashRouter as Router, Routes} from 'react-router-dom'
import React from 'react'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import {Layout} from '@/shared/Layout'

export const adminModule = {
  basePath: '/admin',
  siteMap: {
    users: '/',
  }
}

const AdminSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(adminModule.siteMap.users)}>
          {({isActive}) =>
            <SidebarItem icon="group" active={isActive}>{m.users}</SidebarItem>
          }
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const Admin = () => {
  return (
    <Router>
      <Layout
        sidebar={<AdminSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        <Routes>
          <Route index element={<AdminUsers/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}