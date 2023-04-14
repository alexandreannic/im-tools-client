import {Navigate, Route, Routes} from 'react-router-dom'
import React from 'react'
import {useI18n} from '../core/i18n'
import {Home} from './Home/Home'
import {ActivityInfo} from './ActivityInfo/ActivityInfo'
import {Kobo} from './Kobo/Kobo'
import {koboModule} from './Kobo/koboModule'
import {KoboForm} from './Kobo/KoboForm/KoboForm'
import {DrcUaMap} from './DrcUaMap/DrcUaMap'

export const Router = () => {
  const {m} = useI18n()
  return (
    <div>
      <Routes>
        <Route path="/map" element={<DrcUaMap/>}/>
        <Route path="/snapshot" element={<Home/>}/>
        <Route path="/activity-info" element={<ActivityInfo/>}/>
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
