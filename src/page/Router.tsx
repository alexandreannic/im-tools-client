import {Route, Routes} from 'react-router-dom'
import React from 'react'
import {useI18n} from '../core/i18n'
import {Home} from './Home/Home'
import {ActivityInfo} from './ActivityInfo'


export const Router = () => {
  const {m} = useI18n()
  return (
    <div>
      <Routes>
        {/*<Route path="/" element={<ActivityInfo/>}/>*/}
        <Route path="/" element={<Home/>}/>
      </Routes>
    </div>
  )
}
