import {env, required} from '@alexandreannic/ts-utils'

const _ = env(process.env)

export const appConfig = {
  apiURL: ``,
  google: {
    apiKey: _(required)('REACT_APP_GOOGLE_MAPS_API_KEY')
  }
}

export type AppConfig = typeof appConfig


