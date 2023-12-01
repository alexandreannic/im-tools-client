import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useState} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {AAIconBtn} from '@/shared/IconBtn'
import {Panel} from '@/shared/Panel'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {Txt} from 'mui-extension'
import {Box, Switch} from '@mui/material'
import {useRouter} from 'next/router'
import {seq} from '@alexandreannic/ts-utils'

export const AdminUsers = () => {
  const {api, conf} = useAppSettings()
  const {session, setSession} = useSession()
  const _connectAs = useFetcher(api.session.connectAs)
  const _users = useFetcher(api.user.search)
  const {m, formatDate, formatDateTime} = useI18n()
  const router = useRouter()

  const [showDummyAccounts, setShowDummyAccounts] = useState(false)

  useEffect(() => {
    _users.fetch({clean: false}, {includeDummy: showDummyAccounts})
  }, [showDummyAccounts])

  const connectAs = async (email: string) => {
    const session = await _connectAs.fetch({force: true, clean: true}, email)
    await router.push('/')
    setSession(session)
  }

  const filteredData = _users.entity

  return (
    <Page width="lg">
      <Panel>
        <Sheet
          id="users"
          header={
            <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
              <Txt sx={{fontSize: '1rem'}} color="hint">{m.showDummyAccounts}</Txt>
              <Switch value={showDummyAccounts} onChange={e => setShowDummyAccounts(e.target.checked)}/>
            </Box>
          }
          defaultLimit={200}
          data={filteredData}
          columns={[
            {
              id: 'name',
              head: m.name,
              render: _ => _.name,
            },
            {
              id: 'email',
              head: m.email,
              render: _ => <Txt bold>{_.email}</Txt>,
              type: 'string',
            },
            {
              width: 110,
              id: 'createdAt',
              head: m.createdAt,
              renderValue: _ => _.createdAt,
              render: _ => <Txt color="hint">{formatDate(_.createdAt)}</Txt>,
              type: 'date',
            },
            {
              width: 140,
              id: 'lastConnectedAt',
              head: m.lastConnectedAt,
              renderValue: _ => _.lastConnectedAt,
              render: _ => _.lastConnectedAt && <Txt color="hint">{formatDateTime(_.lastConnectedAt)}</Txt>,
              type: 'date',
            },
            {
              id: 'drcJob',
              head: m.drcJob,
              render: _ => _.drcJob,
              type: 'select_one',
              options: () => seq(_users.entity?.map(_ => _.drcJob)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
            },
            {
              id: 'drcOffice',
              head: m.drcOffice,
              render: _ => _.drcOffice,
              options: () => seq(_users.entity?.map(_ => _.drcOffice)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
            },
            {
              type: 'select_one',
              id: 'admin',
              width: 10,
              align: 'center',
              head: m.admin,
              renderValue: _ => _.admin ? 'true' : 'false',
              render: _ => _.admin && <TableIcon color="success">check_circle</TableIcon>,
              options: () => [{value: 'true', label: m.yes}, {value: 'false', label: m.no}]
            },
            {
              id: 'action',
              width: 10,
              align: 'right',
              render: _ => (
                <AAIconBtn
                  disabled={_.email === conf.contact || _.email === session.email}
                  children="visibility"
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