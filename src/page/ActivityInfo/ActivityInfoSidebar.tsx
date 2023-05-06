import {Sidebar, SidebarItem} from '../../shared/Layout/Sidebar'
import {activityInfoModule} from './ActivityInfo'

export const ActivityInfoSidebar = () => {
  return (
    <Sidebar>
      {Object.entries(activityInfoModule.siteMap).map(([k, path]) =>
        <SidebarItem key={path} to={path}>{k}</SidebarItem>
      )}
    </Sidebar>
  )
}