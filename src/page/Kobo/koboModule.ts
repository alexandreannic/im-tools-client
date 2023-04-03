const basePath = '/kobo'

export const koboModule = {
  basePath,
  siteMap: {
    form: (serverId = ':serverId', formId = ':formId') => `form/${serverId}/${formId}`
  }
}
