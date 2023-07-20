const basePath = '/database'

const base = (serverId = ':serverId', formId = ':formId') => `/form/${serverId}/${formId}`
export const databaseModule = {
  basePath,
  siteMap: {
    home: base,
    database: {
      relative: `database`,
      absolute: (serverId = ':serverId', formId = ':formId') => base(serverId, formId) + '/database'
    },
    access: {
      relative: `database`,
      absolute: (serverId = ':serverId', formId = ':formId') => base(serverId, formId) + '/access'
    },
    // database: (serverId = ':serverId', formId = ':formId') => `form/${serverId}/${formId}/database`,
    // access: (serverId = ':serverId', formId = ':formId') => `form/${serverId}/${formId}/access`,
  }
}
