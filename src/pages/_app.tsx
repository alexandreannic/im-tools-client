import React, {useMemo} from 'react'
import type {AppProps} from 'next/app'
import {Provide} from '@/shared/Provide'
import {Box, CssBaseline, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {I18nProvider} from '@/core/i18n'
import {ToastProvider} from 'mui-extension'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ConfigContextProvider, useAppSettings} from '@/core/context/ConfigContext'
import {NfiProvider} from '@/core/context/NfiContext'
import {appConfig} from '@/conf/AppConfig'
import {MsalProvider} from '@azure/msal-react'
import {getMsalInstance} from '@/core/msal'
import {SessionProvider} from '@/core/context/SessionContext'

const api = new ApiSdk(new ApiClient({
  baseUrl: appConfig.apiURL,
}))

const App = (props: AppProps) => {
  return (
    <ConfigContextProvider api={api}>
      <AppWithConfig {...props}/>
    </ConfigContextProvider>
  )
}

const AppWithConfig = ({Component, pageProps}: AppProps) => {
  const settings = useAppSettings()
  const msal = useMemo(() => getMsalInstance(settings.conf), [settings.conf])
  return (
    <Provide providers={[
      _ => <ToastProvider children={_}/>,
      _ => <ThemeProvider theme={muiTheme(settings.darkTheme)} children={_}/>,
      _ => <CssBaseline children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <MsalProvider children={_} instance={msal}/>,
      _ => <SessionProvider children={_}/>,
      _ => <NfiProvider children={_}/>,
    ]}>
      <Box>
        <Component {...pageProps} />
      </Box>
    </Provide>
  )
}

export default App