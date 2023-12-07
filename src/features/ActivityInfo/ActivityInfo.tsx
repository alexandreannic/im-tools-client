import {Layout} from '@/shared/Layout'
import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import React, {ReactNode} from 'react'
import {AiNfi} from '@/features/ActivityInfo/NFI/AiNfi'
import {AiMpca} from '@/features/ActivityInfo/Mpca/AiMpca'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {Enum} from '@alexandreannic/ts-utils'
import {AiSnfi} from '@/features/ActivityInfo/Snfi/AiSnfi'
import {AiProtectionGeneral} from '@/features/ActivityInfo/Protection/AiProtectionGeneral'

interface Activity {
  // id: string
  name: string,
  componnent: ReactNode,
  path: string
}

const activities = {
  'protection_general': {
    // id: 'protection_general',
    name: 'Protection',
    path: '/protection_general',
    componnent: <AiProtectionGeneral/>,
  },
  'nfi': {
    // id: 'nfi',
    name: 'WASH (NFI)',
    path: '/nfi',
    componnent: <AiNfi/>,
  },
  'mpca': {
    // id: 'mpca',
    name: 'MPCA',
    path: '/mpca',
    componnent: <AiMpca/>,
  },
  'shelter': {
    // id: 'shelter',
    name: 'SNFI',
    path: '/shelter',
    componnent: <AiSnfi/>,
  },
}

export const activityInfoModule = {
  basePath: '/activity-info',
  siteMap: new Enum(activities).transform((k, v) => [k, v.path]).get()
}

const ActivityInfoSidebar = () => {
  return (
    <Sidebar>
      {Enum.keys(activities).map(k =>
        <NavLink to={activities[k].path} key={k}>
          {({isActive, isPending}) => (
            <SidebarItem key={k} active={isActive}>{activities[k].name}</SidebarItem>
          )}
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
          {Enum.values(activities).map(k =>
            <Route key={k.path} path={k.path} element={k.componnent}/>
          )}
        </Routes>
      </Layout>
    </Router>
  )
}
