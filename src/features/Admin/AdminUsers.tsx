import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {AAIconBtn} from '@/shared/IconBtn'

export const AdminUsers = () => {
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const _connectAs = useFetcher(api.session.connectAs)
  const _users = useFetcher(api.user.search)
  const {m} = useI18n()

  useEffect(() => {
    _users.fetch()
  }, [])

  const connectAs = (email: string) => {
    _connectAs.fetch({force: true, clean: true}, email)
  }

  return (
    <Page>
      <Sheet
        data={_users.entity}
        columns={[
          {
            id: 'name',
            head: m.name,
            render: _ => _.name,
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
            id: 'email',
            head: m.email,
            render: _ => _.email,
          },
          {
            id: 'action',
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
    </Page>
  )
}