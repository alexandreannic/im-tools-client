import {Navigate, Route, Routes} from 'react-router-dom'
import React from 'react'
import {useI18n} from '../core/i18n'
import {Home} from './Home/Home'
import {Kobo} from './Kobo/Kobo'
import {koboModule} from './Kobo/koboModule'
import {KoboForm} from './Kobo/KoboForm/KoboForm'
import {DrcUaMap} from './DrcUaMap/DrcUaMap'
import {Playground} from './Playground'
import {Dashboard} from './Dashboard/Dashboard'
import {ActivityInfoNFI} from './ActivityInfo/NFI/ActivityInfoNFI'
import {ActivityInfo, activityInfoModule} from './ActivityInfo/ActivityInfo'
import {ActivityInfoHHS_2_1} from './ActivityInfo/HHS_2_1/ActivityInfoHHS_2_1'

export const Router = () => {
  const {m} = useI18n()
  return (
    <div>
      <Routes>
        <Route path="/map" element={<DrcUaMap/>}/>
        <Route path="/snapshot" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path={activityInfoModule.basePath} element={<ActivityInfo/>}>
          <Route path={activityInfoModule.siteMap.hhs2} element={<ActivityInfoHHS_2_1/>}/>
          <Route path={activityInfoModule.siteMap.nfi} element={<ActivityInfoNFI/>}/>
        </Route>
        <Route path="/playground" element={<Playground/>}/>
        <Route path={koboModule.basePath} element={<Kobo/>}>
          <Route path={koboModule.siteMap.form()} element={<KoboForm/>}/>
        </Route>
        <Route
          path="/"
          element={<Navigate to="/activity-info" replace/>}
        />
      </Routes>
    </div>
  )
}
