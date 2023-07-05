import {Link} from 'react-router-dom'

export const dashboardModule = {
  basePath: '/dashboard',
  siteMap: {
    hhs: 'househould-survey',
    mealVisitMonitoring: 'meal-visit-monitoring',
  }
}

export const Dashboard = () => {
  return (
    <>
      <Link to={dashboardModule.siteMap.hhs}>HHS</Link>
    </>

  )
}