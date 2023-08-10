import * as React from 'react'
import Document, {DocumentContext, DocumentProps, Head, Html, Main, NextScript} from 'next/document'
import {appConfig} from '@/conf/AppConfig'
import createEmotionCache from '@/core/createEmotionCache'
import createEmotionServer from '@emotion/server/create-instance'
import {AppType} from 'next/app'
import {MyAppProps} from '@/pages/_app'

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

export default function MyDocument({emotionStyleTags}: MyDocumentProps) {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <base href="/"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
        {/*<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>*/}
        <link rel="icon" type="image/x-icon" href="/static/favicon.svg"/>
        {emotionStyleTags}
        <meta name="emotion-insertion-point" content=""/>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      <script async type="text/javascript" src="https://www.gstatic.com/charts/loader.js"/>
      <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${appConfig.gooogle.apiKey}`}/>
      </body>
    </Html>
  )
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  const {extractCriticalToChunks} = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: style.css}}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}