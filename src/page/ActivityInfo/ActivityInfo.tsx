import {Layout} from '../../shared/Layout'
import {ActivityInfoSidebar} from './ActivityInfoSidebar'
import {Outlet} from 'react-router-dom'


export const activityInfoModule = {
  basePath: '/activity-info',
  siteMap: {
    hhs2: 'hhs2',
    nfi: 'nfi'
  }
}


interface MenuItem {
  children: () => JSX.Element
  path: string
}

// const activityInfoMenu: MenuItem[] = [
//   {name: 'HHS v2.1', children: ActivityInfoHHS_2_1},
//   {name: 'NFI', children: ActivityInfoNFI},
// ]

export const ActivityInfo = () => {
  return (
    <Layout sidebar={<ActivityInfoSidebar/>}>
      <Outlet/>
    </Layout>
  )
}