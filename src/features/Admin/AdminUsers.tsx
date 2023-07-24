import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {AAIconBtn} from '@/shared/IconBtn'
import {useNavigate} from 'react-router'
import {adminModule} from '@/features/Admin/Admin'
import {Panel} from '@/shared/Panel'

export const AdminUsers = () => {
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const _connectAs = useFetcher(api.session.connectAs)
  const _users = useFetcher(api.user.search)
  const {m} = useI18n()
  const navigate = useNavigate()

  useEffect(() => {
    _users.fetch()
    navigate(adminModule.siteMap.users)
  }, [])

  const connectAs = (email: string) => {
    _connectAs.fetch({force: true, clean: true}, email).then(_ => setSession(_.email))
  }

  return (
    <Page>
      <Panel>
        <Sheet
          data={_users.entity}
          columns={[
            // {
            //   id: 'name',
            //   head: m.name,
            //   render: _ => _.name,
            // },
            {
              id: 'email',
              head: m.email,
              render: _ => _.email,
            },
            {
              id: 'drcJob',
              head: m.drcJob,
              render: _ => _.drcJob,
            },
            {
              id: 'drcOffice',
              head: m.drcOffice,
              render: _ => _.drcOffice,
            },
            {
              id: 'action',
              align: 'right',
              render: _ => (
                <AAIconBtn
                  icon="visibility"
                  loading={_connectAs.loading}
                  onClick={() => connectAs(_.email)}
                  tooltip={m.connectAs}
                />
              ),
            },
          ]}
        />
      </Panel>
    </Page>
  )
}