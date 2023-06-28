import React, {useMemo} from 'react'
import type {AppProps} from 'next/app'
import {Provide} from '@/shared/Provide'
import {Box, ButtonBase, CssBaseline, Icon, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {I18nProvider, useI18n} from '@/core/i18n'
import {ToastProvider, Txt} from 'mui-extension'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {AppSettingsProvider, useAppSettings} from '@/core/context/ConfigContext'
import {NfiProvider} from '@/core/context/NfiContext'
import {appConfig} from '@/conf/AppConfig'
import {MsalProvider} from '@azure/msal-react'
import {getMsalInstance} from '@/core/msal'
import {DRCLogo} from '@/shared/logo/logo'

const api = new ApiSdk(new ApiClient({
  baseUrl: appConfig.apiURL,
}))

const App = (props: AppProps) => {
  return (
    <Provide providers={[
      _ => <AppSettingsProvider api={api} children={_}/>,
    ]}>
      <AppWithConfig {...props}/>
    </Provide>
  )
}
const AppWithConfig = (props: AppProps) => {
  const settings = useAppSettings()
  const msal = useMemo(() => getMsalInstance(settings.conf), [settings.conf])
  return (
    <Provide providers={[
      _ => <ToastProvider children={_}/>,
      _ => <ThemeProvider theme={muiTheme(settings.darkTheme)} children={_}/>,
      _ => <CssBaseline children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <MsalProvider children={_} instance={msal}/>,
      _ => <NfiProvider children={_}/>,
    ]}>
      <AppWithBaseContext {...props}/>
    </Provide>
  )
}

const AppWithBaseContext = ({Component, pageProps}: AppProps) => {
  const settings = useAppSettings()
  const {m} = useI18n()
  if (settings.conf.appOff) {
    return (
      <Box sx={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Box sx={{
          border: t => `1px solid ${t.palette.divider}`,
          padding: 4,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <DRCLogo sx={{display: 'block', mb: 2}}/>
          <Txt size="title" block>{m.title}</Txt>
          <Txt sx={{mb: 4}} size="big" color="hint" block>{m.appInMaintenance}</Txt>
          <Icon sx={{fontSize: '90px !important', color: t => t.palette.text.disabled}}>
            engineering
          </Icon>
          <Box>
          </Box>
        </Box>
      </Box>
    )
  }
  return (
    <Component {...pageProps} />
  )
}

export default App