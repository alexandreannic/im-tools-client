import React, {useEffect} from 'react'
import {DashboardMealVisitProvider} from '@/features/Meal/DashboardMealVisitContext'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {DashboardMealVisitDashboard} from '@/features/Meal/DashboardMealVisitDashboard'
import {DashboardMealVisitPdf} from '@/features/Meal/DashboardMealVisitPdf'
import {KoboSchemaProvider} from '@/features/Kobo/KoboSchemaContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {kobo} from '@/koboDrcUaFormId'
import {useFetcher} from '@alexandreannic/react-hooks-lib'

export const mealModule = {
  basePath: '/meal-visit-monitoring',
  siteMap: {
    dashboard: '/',
    details: (koboAnswerId = ':id') => `/test/${koboAnswerId}`,
  }
}

export const DashboardMealVisit = () => {
  const {api} = useAppSettings()
  const fetcherSchema = useFetcher(() => api.koboApi.getForm({id: kobo.drcUa.form.meal_visitMonitoring}))
  useEffect(() => {
    fetcherSchema.fetch()
  }, [])

  return (
    <Router>
      {fetcherSchema.entity && (
        <KoboSchemaProvider schema={fetcherSchema.entity}>
          <DashboardMealVisitProvider>
            <Routes>
              <Route path={mealModule.siteMap.dashboard} element={<DashboardMealVisitDashboard/>}/>
              <Route path={mealModule.siteMap.details()} element={<DashboardMealVisitPdf/>}/>
            </Routes>
          </DashboardMealVisitProvider>
        </KoboSchemaProvider>
      )}
    </Router>
  )
}
