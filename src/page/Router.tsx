import {Navigate, Route, Routes} from 'react-router-dom'
import React from 'react'
import {useI18n} from '../core/i18n'
import {Home} from './Home/Home'
import {Kobo} from './Kobo/Kobo'
import {koboModule} from './Kobo/koboModule'
import {KoboTable} from './Kobo/KoboForm/KoboTable'
import {DrcUaMap} from './DrcUaMap/DrcUaMap'
import {Playground} from './Playground'
import {DashboardProtHHS2} from './Dashboard/DashboardHHS2/DashboardProtHHS2'
import {ActivityInfoNFI} from './ActivityInfo/NFI/ActivityInfoNFI'
import {ActivityInfo, activityInfoModule} from './ActivityInfo/ActivityInfo'
import {ActivityInfoHHS_2_1} from './ActivityInfo/HHS_2_1/ActivityInfoHHS_2_1'
import {Dashboard, dashboardModule} from './Dashboard/Dashboard'

export const Router = () => {
  const {m} = useI18n()
  return (
    <div>
      <Routes>
        <Route path="/map" element={<DrcUaMap/>}/>
        <Route path="/snapshot" element={<Home/>}/>

        <Route path={dashboardModule.basePath + '/' + dashboardModule.siteMap.hhs} element={<DashboardProtHHS2/>}/>
        <Route path={dashboardModule.basePath} element={<Dashboard/>}/>

        <Route path={activityInfoModule.basePath} element={<ActivityInfo/>}>
          <Route path={activityInfoModule.siteMap.hhs2} element={<ActivityInfoHHS_2_1/>}/>
          <Route path={activityInfoModule.siteMap.nfi} element={<ActivityInfoNFI/>}/>
        </Route>
        <Route path="/playground" element={<Playground/>}/>
        <Route path={koboModule.basePath} element={<Kobo/>}>
          <Route path={koboModule.siteMap.form()} element={<KoboTable/>}/>
        </Route>
        <Route
          path="/"
          element={<Navigate to="/activity-info" replace/>}
        />
      </Routes>
    </div>
  )
}
