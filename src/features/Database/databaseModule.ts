const basePath = '/database'

export const databaseModule = {
  basePath,
  siteMap: {
    form: (serverId = ':serverId', formId = ':formId') => `form/${serverId}/${formId}`
  }
}
