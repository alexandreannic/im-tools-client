import {Sheet} from '@/shared/Sheet/Sheet'
import {Access} from '@/core/sdk/server/access/Access'
import {AAIconBtn} from '@/shared/IconBtn'
import React, {ReactNode} from 'react'
import {useI18n} from '@/core/i18n'
import {UUID} from '@/core/type'
import {UseAsync} from '@/features/useAsync'
import {UseFetchersMultiple, UseFetchersSimple} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useSession} from '@/core/Session/SessionContext'

export const AccessTable = ({
  header,
  onRemoved,
  _data,
  _remove,
}: {
  _data: UseFetchersSimple<() => Promise<Access[]>>
  _remove: UseAsync<(_: UUID) => Promise<any>>
  onRemoved?: (_: UUID) => void
  // data: Access[] | undefined
  header?: ReactNode
}) => {
  const {m} = useI18n()
  const {session} = useSession()
  return (
    <Sheet<Access>
      loading={_data.loading}
      header={header}
      data={_data.get()}
      columns={[
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
          id: 'accessLevel',
          head: m.accessLevel,
          render: _ => _.level,
        },
        {
          id: 'params',
          head: m.filter,
          render: _ => JSON.stringify(_.params),
        },
        ...session.admin ? [{
          id: 'actions',
          head: '',
          align: 'right',
          render: (_: Access) => (
            <AAIconBtn loading={_remove.getLoading(_.id)} onClick={() => _remove.call(_.id).then(() => onRemoved?.(_.id))} icon="delete"/>
          ),
        } as const] : [],
      ]}
    />
  )
}