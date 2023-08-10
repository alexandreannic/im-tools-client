import {Sheet} from '@/shared/Sheet/Sheet'
import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import {AAIconBtn} from '@/shared/IconBtn'
import React, {ReactNode} from 'react'
import {useI18n} from '@/core/i18n'
import {UUID} from '@/core/type'
import {UseAsync} from '@/alexlib-labo/useAsync'
import {UseFetchersSimple} from '@/alexlib-labo/useFetchersFn'
import {useSession} from '@/core/Session/SessionContext'
import {Arr, Enum} from '@alexandreannic/ts-utils'

export const AccessTable = ({
  header,
  onRemoved,
  renderParams = _ => JSON.stringify(_),
  _data,
  _remove,
}: {
  _data: UseFetchersSimple<() => Promise<Access[]>>
  _remove: UseAsync<(_: UUID) => Promise<any>>
  renderParams?: (_: any) => ReactNode
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
          type: 'select_one',
          options: () => Arr(_data.get()?.map(_ => _.drcJob)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
        },
        {
          id: 'drcOffice',
          head: m.drcOffice,
          render: _ => _.drcOffice,
          type: 'select_one',
          options: () => Arr(_data.get()?.map(_ => _.drcOffice)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
        },
        {
          id: 'email',
          head: m.email,
          render: _ => _.email,
        },
        {
          id: 'accessLevel',
          head: m.accessLevel,
          type: 'select_one',
          render: _ => _.level,
          options: () => Enum.keys(AccessLevel).map(_ => ({value: _, label: _}))
        },
        {
          id: 'params',
          head: m.filter,
          render: _ => renderParams(_.params),
          type: 'string'
        },
        ...session.admin ? [{
          id: 'actions',
          head: '',
          align: 'right',
          render: (_: Access) => (
            <AAIconBtn loading={_remove.loading.get(_.id)} onClick={() => _remove.call(_.id).then(() => onRemoved?.(_.id))} icon="delete"/>
          ),
        } as const] : [],
      ]}
    />
  )
}