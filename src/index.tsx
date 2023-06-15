import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {Provide} from './shared/Provide'
import {CssBaseline, ThemeProvider} from '@mui/material'
import {muiTheme} from './core/theme'
import {I18nProvider} from './core/i18n'
import {ToastProvider} from 'mui-extension'
import {BrowserRouter as Router} from 'react-router-dom'
import {ApiSdk} from './core/sdk/server/ApiSdk'
import {ApiClient} from './core/sdk/server/ApiClient'
import {ConfigContextProvider} from './core/context/ConfigContext'
import {NfiProvider} from './core/context/NfiContext'
import {appConfig} from './conf/AppConfig'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {LocalizationProvider} from '@mui/x-date-pickers'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const api = new ApiSdk(new ApiClient({
  baseUrl: appConfig.apiURL,
}))

root.render(
  <Provide providers={[
    _ => <ConfigContextProvider children={_} api={api}/>,
    _ => <ToastProvider children={_}/>,
    _ => <Router children={_}/>,
    _ => <ThemeProvider theme={muiTheme()} children={_}/>,
    _ => <CssBaseline children={_}/>,
    _ => <I18nProvider children={_}/>,
    _ => <NfiProvider children={_}/>,
  ]}>
    <App/>
  </Provide>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
