import React from 'react'
import type {AppProps} from 'next/app'
import {Provide} from '@/shared/Provide'
import {Box, CssBaseline, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {I18nProvider} from '@/core/i18n'
import {ToastProvider} from 'mui-extension'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ConfigContextProvider, useConfig} from '@/core/context/ConfigContext'
import {NfiProvider} from '@/core/context/NfiContext'
import {appConfig} from '@/conf/AppConfig'

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
  const config = useConfig()
  return (
    <Provide providers={[
      _ => <ToastProvider children={_}/>,
      _ => <ThemeProvider theme={muiTheme(config.darkTheme)} children={_}/>,
      _ => <CssBaseline children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <NfiProvider children={_}/>,
    ]}>
      <Box>
        <Component {...pageProps} />
      </Box>
    </Provide>
  )
}

export default App