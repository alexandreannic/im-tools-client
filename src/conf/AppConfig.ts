import {env, required} from '@alexandreannic/ts-utils'

const _ = env(process.env)

export const appConfig = {
  contact: 'alexandre.annic@drc.ngo',
  apiURL: _(required)('REACT_APP_API_URL'),
  gooogle: {
    apiKey: _(required)('REACT_APP_GOOGLE_MAPS_API_KEY'),
    mapId: _(required)('REACT_APP_GOOGLE_MAPS_ID'),
  },
  microsoft: {
    // To find it go to https://developer.microsoft.com/en-us/graph/graph-explorer,
    // Login and inspect Network
    bearerToken: _(required)('REACT_APP_MS_BEARER_TOKEN')
  }
}

console.log(appConfig)

export type AppConfig = typeof appConfig


