import React, {useMemo} from 'react'
import type {AppProps} from 'next/app'
import {Provide} from '@/shared/Provide'
import {Box, CssBaseline, Icon, ThemeProvider} from '@mui/material'
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
import {CacheProvider, EmotionCache} from '@emotion/react'
import {CenteredContent} from '@/shared/CenteredContent'
import {ModalProvider} from '@/shared/Modal/ModalProvider'
import createEmotionCache from '@/core/createEmotionCache'
import Head from 'next/head'

const api = new ApiSdk(new ApiClient({
  baseUrl: appConfig.apiURL,
}))

const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const App = ({
  emotionCache = clientSideEmotionCache,
  ...props
}: MyAppProps) => {
  return (
    <Provide providers={[
      _ => <CacheProvider value={emotionCache} children={_}/>,
      _ => <AppSettingsProvider api={api} children={_}/>,
    ]}>
      <>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width"/>
        </Head>
        <AppWithConfig {...props}/>
      </>
    </Provide>
  )
}
const AppWithConfig = (props: AppProps) => {
  const settings = useAppSettings()
  const msal = useMemo(() => getMsalInstance(settings.conf), [settings.conf])
  return (
    <Provide providers={[
      // _ => <StyledEngineProvider injectFirst children={_}/>,
      _ => <ToastProvider children={_}/>,
      _ => <ThemeProvider theme={muiTheme({dark: false && settings.darkTheme})} children={_}/>,
      _ => <CssBaseline children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <MsalProvider children={_} instance={msal}/>,
      _ => <NfiProvider children={_}/>,
      _ => <ModalProvider children={_}/>,
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
      <CenteredContent>
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
      </CenteredContent>
    )
  }
  return (
    <Component {...pageProps} />
  )
}

export default App