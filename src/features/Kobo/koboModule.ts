const basePath = '/database'

export const koboModule = {
  basePath,
  siteMap: {
    form: (serverId = ':serverId', formId = ':formId') => `form/${serverId}/${formId}`
  }
}
