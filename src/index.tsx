import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {Provide} from './core/Provide'
import {CssBaseline, ThemeProvider} from '@mui/material'
import {muiTheme} from './core/theme'
import {I18nProvider} from './core/i18n'
import {ToastProvider} from 'mui-extension'
import {HashRouter} from 'react-router-dom'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <Provide providers={[
    _ => <ThemeProvider theme={muiTheme()} children={_}/>,
    _ => <CssBaseline children={_}/>,
    _ => <I18nProvider children={_}/>,
    _ => <ToastProvider children={_}/>,
    _ => <HashRouter children={_}/>
  ]}>
    <App/>
  </Provide>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
