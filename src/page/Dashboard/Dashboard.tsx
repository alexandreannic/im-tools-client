import {Link, Outlet} from 'react-router-dom'

export const dashboardModule = {
  basePath: '/dashboard',
  siteMap: {
    hhs: 'hhs',
  }
}

export const Dashboard = () => {
  return (
    <>
      <Link to={dashboardModule.siteMap.hhs}>HHS</Link>
    </>

  )
}