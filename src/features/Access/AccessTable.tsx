import {Sheet} from '@/shared/Sheet/Sheet'
import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import {AAIconBtn} from '@/shared/IconBtn'
import React, {ReactNode} from 'react'
import {useI18n} from '@/core/i18n'
import {UUID} from '@/core/type'
import {useAsync, UseAsync} from '@/alexlib-labo/useAsync'
import {UseFetchersSimple} from '@/alexlib-labo/useFetchersFn'
import {Enum, seq} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'

export const AccessTable = ({
  isAdmin,
  header,
  onRemoved,
  renderParams = _ => JSON.stringify(_),
  _data,
  _remove,
}: {
  isAdmin?: boolean
  _data: UseFetchersSimple<() => Promise<Access[]>>
  _remove: UseAsync<(_: UUID) => Promise<any>>
  renderParams?: (_: any) => ReactNode
  onRemoved?: (_: UUID) => void
  // data: Access[] | undefined
  header?: ReactNode
}) => {
  const {m, formatDate} = useI18n()
  const {api} = useAppSettings()
  const _update = useAsync(api.access.update, {requestKey: ([id]) => id})

  return (
    <Sheet<Access>
      id="access"
      loading={_data.loading}
      header={header}
      data={_data.get()}
      columns={[
        {
          id: 'drcJob',
          head: m.drcJob,
          render: _ => _.drcJob,
          type: 'select_one',
          options: () => seq(_data.get()?.map(_ => _.drcJob)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
        },
        {
          width: 80,
          head: m.createdAt,
          id: 'date',
          type: 'date',
          render: _ => formatDate(_.createdAt),
        },
        {
          id: 'drcOffice',
          head: m.drcOffice,
          render: _ => _.drcOffice,
          type: 'select_one',
          options: () => seq(_data.get()?.map(_ => _.drcOffice)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
        },
        {
          id: 'email',
          head: m.email,
          render: _ => _.email,
        },
        {
          id: 'group',
          type: 'select_one',
          head: m.group,
          render: _ => _.groupName,
        },
        {
          width: 90,
          id: 'level',
          head: m.accessLevel,
          type: 'select_one',
          options: () => Enum.keys(AccessLevel).map(_ => ({value: _, label: _})),
          render: row => isAdmin ? (
            <AaSelectSingle
              hideNullOption
              disabled={!!row.groupName}
              defaultValue={row.level}
              onChange={_ => _update.call(row.id, {level: _ as AccessLevel})}
              options={Enum.keys(AccessLevel).map(_ => ({value: _, children: _}))}
            />
          ) : row.level,
        },
        {
          id: 'params',
          head: m.filter,
          render: _ => renderParams(_.params),
          type: 'string'
        },
        ...isAdmin ? [{
          id: 'actions',
          width: 0,
          head: '',
          align: 'right',
          render: (_: Access) => (
            <AAIconBtn loading={_remove.loading.get(_.id)} onClick={() => _remove.call(_.id).then(() => onRemoved?.(_.id))} children="delete"/>
          ),
        } as const] : [],
      ]}
    />
  )
}