import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '../../core/context/ConfigContext'
import {Sidebar, SidebarHr, SidebarItem} from '../../shared/Layout/Sidebar'
import {Fragment, useEffect, useState} from 'react'
import {CircularProgress, Divider} from '@mui/material'
import {koboModule} from './koboModule'
import {koboFormId} from '../../koboFormId'
import {KoboApiSdk} from '../../core/sdk/server/kobo/KoboApiSdk'

/**@deprecated*/
export const KoboSidebar = () => {
  const {api} = useAppSettings()
  const _servers = useFetcher(api.kobo.server.getAll)
  const _forms = useFetcher(api.kobo.form.get)
  const [serverId, setServerId] = useState<string | undefined>()

  const path = (page: string) => koboModule.basePath + '/' + page

  useEffect(() => {
    _servers.fetch()
  }, [])

  useEffectFn(serverId, _ => _ && _forms.fetch({}, _))

  return (
    <Sidebar>
      <SidebarItem to={path(koboModule.siteMap.form(KoboApiSdk.serverRefs.prod, koboFormId.prod.protectionHh2))}>
        HHS v2
      </SidebarItem>
      <SidebarItem to={path(koboModule.siteMap.form(KoboApiSdk.serverRefs.prod, koboFormId.prod.BNRE))}>
        BNRE
      </SidebarItem>
      <SidebarItem to={path(koboModule.siteMap.form(KoboApiSdk.serverRefs.prod, koboFormId.prod.fcrmMpcaNAA))}>
        fcrmMpcaNAA
      </SidebarItem>
      <Divider/>
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
                  key={form.uid}
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
