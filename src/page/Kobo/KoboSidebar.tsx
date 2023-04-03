import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {Sidebar, SidebarHr, SidebarItem} from '../../shared/Layout/Sidebar'
import {Fragment, useEffect, useState} from 'react'
import {CircularProgress} from '@mui/material'
import {koboModule} from './koboModule'

export const KoboSidebar = () => {
  const {api} = useConfig()
  const _servers = useFetcher(api.kobo.fetchServers)
  const _forms = useFetcher(api.kobo.fetchForms)
  const [serverId, setServerId] = useState<string | undefined>()

  // const path = (page: string) => koboModule.basePath + '/' + page

  useEffect(() => {
    _servers.fetch()
  }, [])

  useEffectFn(serverId, _ => _ && _forms.fetch({}, _))

  return (
    <Sidebar>
      {_servers.entity?.map(server =>
        <Fragment key={server.id}>
          <SidebarItem
            large
            onClick={() => {
              // _forms.fetch({}, _.id)
              setServerId(server.id)
            }}
            // to={path(koboModule.siteMap.form(_.id))}
          >
            {server.url.replace(/https?\:\/\//, '')}
          </SidebarItem>
          {serverId === server.id && (
            _forms.entity ? (_forms.entity?.map(form =>
                <SidebarItem
                  icon="assignment"
                  to={koboModule.siteMap.form(server.id, form.uid)}
                >
                  {form.name}
                </SidebarItem>
              )
            ) : (_forms.loading && (
                <CircularProgress/>
              )
            )
          )}
          <SidebarHr/>
        </Fragment>
      )}
    </Sidebar>
  )
}
