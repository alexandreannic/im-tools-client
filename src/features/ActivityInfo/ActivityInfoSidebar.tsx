import {Sidebar, SidebarItem} from '../../shared/Layout/Sidebar'
import {activityInfoModule} from './ActivityInfo'
import {NavLink} from 'react-router-dom'

export const ActivityInfoSidebar = () => {
  return (
    <Sidebar>
      {Object.entries(activityInfoModule.siteMap).map(([k, path]) =>
        <SidebarItem component={NavLink} key={path} to={path}>{k}</SidebarItem>
      )}
    </Sidebar>
  )
}