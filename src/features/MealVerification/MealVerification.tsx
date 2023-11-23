import {Layout} from '@/shared/Layout'
import React from 'react'
import {MealVerificationIndex} from '@/features/MealVerification/MealVerificationIndex'
import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {MealVerificationForm} from '@/features/MealVerification/Form/MealVerificationForm'
import {MealVerificationTable} from '@/features/MealVerification/MealVerificationTable'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import {MealVerificationProvider, useMealVerificationContext} from '@/features/MealVerification/MealVerificationContext'

export const mealVerificationModule = {
  basePath: '/meal-verification',
  siteMap: {
    index: '/',
    form: '/form',
    data: (_: string = '/:id') => `/${_}`,
  }
}

const MealVerificationSidebar = () => {
  const path = (page: string) => '' + page
  const {m, formatLargeNumber} = useI18n()
  const ctx = useMealVerificationContext()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(mealVerificationModule.siteMap.index)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="home" active={isActive}>{m.requests}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(mealVerificationModule.siteMap.form)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="add" active={isActive}>{m._mealVerif.newRequest}</SidebarItem>
          )}
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const MealVerification = () => {
  return (
    <MealVerificationProvider>
      <Router>
        <Layout sidebar={<MealVerificationSidebar/>}>
          <Routes>
            <Route index path={mealVerificationModule.siteMap.index} element={<MealVerificationIndex/>}/>
            <Route path={mealVerificationModule.siteMap.form} element={<MealVerificationForm/>}/>
            <Route path={mealVerificationModule.siteMap.data()} element={<MealVerificationTable/>}/>
          </Routes>
        </Layout>
      </Router>
    </MealVerificationProvider>
  )
}