import {Layout} from '@/shared/Layout'
import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import React from 'react'
import {ActivityInfoProtectionGeneral} from '@/features/ActivityInfo/HHS_2_1/ActivityInfoProtectionGeneral'
import {ActivityInfoNFI} from '@/features/ActivityInfo/NFI/ActivityInfoNFI'
import {ActivityInfoMpca} from '@/features/ActivityInfo/Mpca/ActivityInfoMpca'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {Enum} from '@alexandreannic/ts-utils'
import {AiProtectionGeneral} from '@/features/ActivityInfo/Protection/AiProtectionGeneral'

export const activityInfoModule = {
  basePath: '/activity-info',
  siteMap: {
    mpca: '/mpca',
    protection_general: '/protection_general',
    protection_general2: '/protection_general2',
    nfi: '/nfi'
  }
}

const ActivityInfoSidebar = () => {
  const translate: Record<keyof typeof activityInfoModule['siteMap'], string> = {
    protection_general: 'Protection',
    protection_general2: 'Protection 2',
    nfi: 'NFI',
    mpca: 'MPCA',
  }
  return (
    <Sidebar>
      {Enum.entries(activityInfoModule.siteMap).map(([k, path]) =>
        <NavLink to={path} key={path}>
          <SidebarItem key={path}>{translate[k]}</SidebarItem>
        </NavLink>
      )}
    </Sidebar>
  )
}

export const ActivityInfo = () => {
  return (
    <Router>
      <Layout sidebar={<ActivityInfoSidebar/>}>
        <Routes>
          <Route path={activityInfoModule.siteMap.mpca} element={<ActivityInfoMpca/>}/>
          <Route path={activityInfoModule.siteMap.protection_general} element={<ActivityInfoProtectionGeneral/>}/>
          <Route path={activityInfoModule.siteMap.protection_general2} element={<AiProtectionGeneral/>}/>
          <Route path={activityInfoModule.siteMap.nfi} element={<ActivityInfoNFI/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}
