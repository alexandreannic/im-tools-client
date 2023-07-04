import {Layout} from '@/shared/Layout'
import {ActivityInfoSidebar} from './ActivityInfoSidebar'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import React from 'react'
import {ActivityInfoHHS2} from '@/features/ActivityInfo/HHS_2_1/ActivityInfoHHS2'
import {ActivityInfoNFI} from '@/features/ActivityInfo/NFI/ActivityInfoNFI'

export const activityInfoModule = {
  basePath: '/activity-info',
  siteMap: {
    hhs2: '/hhs2',
    nfi: '/nfi'
  }
}


interface MenuItem {
  children: () => JSX.Element
  path: string
}

// const activityInfoMenu: MenuItem[] = [
//   {name: 'HHS v2.1', children: ActivityInfoHHS2},
//   {name: 'NFI', children: ActivityInfoNFI},
// ]

export const ActivityInfo = () => {
  return (
    <Router>
      <Layout sidebar={<ActivityInfoSidebar/>}>
        <Routes>
          <Route path={activityInfoModule.siteMap.hhs2} element={<ActivityInfoHHS2/>}/>
          <Route path={activityInfoModule.siteMap.nfi} element={<ActivityInfoNFI/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}
