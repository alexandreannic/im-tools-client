import {Navigate, Route, Routes} from 'react-router-dom'
import React from 'react'
import {useI18n} from '../core/i18n'
import {Home} from './Home/Home'
import {Database} from '@/features/Database/Database'
import {databaseModule} from '@/features/Database/databaseModule'
import {Database} from '@/features/Database/Database'
import {Playground} from './Playground'
import {DashboardProtHHS2} from './Dashboard/DashboardHHS2/DashboardProtHHS2'
import {ActivityInfoNFI} from './ActivityInfo/NFI/ActivityInfoNFI'
import {ActivityInfo, activityInfoModule} from './ActivityInfo/ActivityInfo'
import {ActivityInfoHHS2} from './ActivityInfo/HHS_2_1/ActivityInfoHHS2'
import {Dashboard, dashboardModule} from './Dashboard/Dashboard'
import {MpcaData} from '@/features/Mpca/MpcaData/MpcaData'
import {Mpca, mpcaModule} from './Mpca/Mpca'
import {MpcaDashboard} from './Mpca/Dashboard/MpcaDashboard'
import {MpcaPaymentTools} from './Mpca/PaymentTools/MpcaPaymentTools'
import {IsaUaMap} from './DrcUaMap/IsaUaMap'
import {MpcaPaymentTool} from './Mpca/PaymentTool/MpcaPaymentTool'
import {DatabaseSources} from '@/features/Database/DatabaseMerge/DatabaseSources'

export const Router = () => {
  const {m} = useI18n()
  return (
    <div>
      <Routes>
        <Route path="/database" element={<DatabaseSources/>}/>
        <Route path={mpcaModule.basePath} element={<Mpca/>}>
          <Route path={mpcaModule.siteMap.deduplication} element={<MpcaData/>}/>
          <Route path={mpcaModule.siteMap.dashboard} element={<MpcaDashboard/>}/>
          <Route path={mpcaModule.siteMap.paymentTools} element={<MpcaPaymentTools/>}/>
          <Route path={mpcaModule.siteMap.paymentTool()} element={<MpcaPaymentTool/>}/>
        </Route>
        <Route path="/map" element={<IsaUaMap/>}/>
        <Route path="/snapshot" element={<Home/>}/>

        <Route path={dashboardModule.basePath + '/' + dashboardModule.siteMap.hhs} element={<DashboardProtHHS2/>}/>
        <Route path={dashboardModule.basePath} element={<Dashboard/>}/>

        <Route path={activityInfoModule.basePath} element={<ActivityInfo/>}>
          <Route path={activityInfoModule.siteMap.hhs2} element={<ActivityInfoHHS2/>}/>
          <Route path={activityInfoModule.siteMap.nfi} element={<ActivityInfoNFI/>}/>
        </Route>
        <Route path="/playground" element={<Playground/>}/>
        <Route path={databaseModule.basePath} element={<Database/>}>
          <Route path={databaseModule.siteMap.form()} element={<Database/>}/>
        </Route>
        <Route
          path="/"
          element={<Navigate to="/activity-info" replace/>}
        />
      </Routes>
    </div>
  )
}
