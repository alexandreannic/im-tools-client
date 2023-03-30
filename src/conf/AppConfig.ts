import {env, required} from '@alexandreannic/ts-utils'

const _ = env(process.env)

export const appConfig = {
  apiURL: ``,
  gooogle: {
    apiKey: _(required)('REACT_APP_GOOGLE_MAPS_API_KEY'),
    mapId: _(required)('REACT_APP_GOOGLE_MAPS_ID'),
  }
}

export type AppConfig = typeof appConfig


