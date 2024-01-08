import {Page} from '@/shared/Page'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useState} from 'react'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {Panel} from '@/shared/Panel'
import {Box, Chip, Icon} from '@mui/material'
import {Modal} from 'mui-extension'
import {AaInput} from '@/shared/ItInput/AaInput'
import {useForm} from 'react-hook-form'
import {useAsync} from '@/alexlib-labo/useAsync'
import {AAIconBtn} from '@/shared/IconBtn'
import {IAccessForm} from '@/features/Access/AccessForm'
import {accessLevelIcon} from '@/core/sdk/server/access/Access'
import {AdminGroupAccessForm} from '@/features/Admin/AdminGroupAccessForm'
import {BasicDialog} from '@/shared/BasicDialog'
import {UUID} from '@/core/type'
import {Utils} from '@/utils/utils'

interface GoupForm {
  name: string
  desc?: string
}

export const AdminGroups = () => {
  const {api} = useAppSettings()
  const {m, formatDate, formatDateTime} = useI18n()

  const groupForm = useForm<GoupForm>()
  const accessForm = useForm<IAccessForm>()

  const fetcher = useFetcher(api.group.getAllWithItems)
  const asyncCreate = useAsync(api.group.create)
  const asyncUpdate = useAsync(api.group.update)
  const asyncRemove = useAsync(api.group.remove, {requestKey: _ => _[0]})
  const asyncItemCreate = useAsync(api.group.createItem)
  const asyncItemItem = useAsync(api.group.updateItem)
  const asyncItemDelete = useAsync(api.group.deleteItem, {requestKey: _ => _[0]})

  const [selectedGroupId, setSelectedGroupId] = useState<{groupId: UUID, accessId?: UUID} | undefined>()

  useEffect(() => {
    fetcher.fetch()
  }, [])

  useEffect(() => {
    fetcher.fetch({force: true, clean: false})
  }, [
    asyncCreate.callIndex,
    asyncUpdate.callIndex,
    asyncRemove.callIndex,
    asyncItemDelete.callIndex,
    asyncItemItem.callIndex,
    asyncItemCreate.callIndex,
  ])

  return (
    <Page width="lg">
      <Panel>
        <Sheet
          data={fetcher.entity}
          loading={fetcher.loading}
          id="group"
          header={
            <>
              <Modal
                onOpen={groupForm.reset}
                onConfirm={(e, close) => groupForm.handleSubmit(form => {
                  asyncCreate.call(form).then(close)
                })()}
                title={m._admin.createGroup}
                content={
                  <>
                    <AaInput sx={{mt: 2}} label={m.name} autoFocus {...groupForm.register('name')}/>
                    <AaInput multiline minRows={3} maxRows={6} label={m.desc} {...groupForm.register('desc')}/>
                  </>
                }
              >
                <AaBtn icon="add" variant="outlined">{m.create}</AaBtn>
              </Modal>
            </>
          }
          columns={[
            {type: 'select_one', id: 'drcJob', width: 150, head: m.name, render: _ => _.name},
            {type: 'string', id: 'desc', width: 120, head: m.desc, render: _ => _.desc},
            {type: 'date', id: 'createdAt', width: 80, head: m.createdAt, tooltip: _ => formatDateTime(_.createdAt), render: _ => formatDate(_.createdAt), renderValue: _ => _.createdAt},
            {
              id: 'items', style: () => ({whiteSpace: 'normal'}), head: m.accesses, render: _ => (
                <>
                  {_.items.map(item =>
                    <Chip
                      onClick={() => {
                        accessForm.reset({
                          ...item,
                          drcJob: item.drcJob ? [item.drcJob] : undefined
                        })
                        setSelectedGroupId({groupId: _.id, accessId: item.id})
                      }}
                      onDelete={e => asyncItemDelete.call(item.id)}
                      sx={{mr: .5, my: .25}}
                      icon={<Icon>{accessLevelIcon[item.level]}</Icon>}
                      size="small"
                      key={item.id}
                      label={<>
                        {item.drcJob ?? item.email}
                        {item.drcOffice ? ` (${item.drcOffice})` : ''}
                      </>}
                    />
                  )}
                  <Chip
                    icon={<Icon>add</Icon>}
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => setSelectedGroupId({groupId: _.id})}
                    sx={{
                      borderStyle: 'dotted',
                      // borderWidth: 2
                    }}
                  />
                </>
              )
            },
            {
              id: 'actions', width: 24, align: 'right', render: _ => <>
                <Modal
                  onOpen={groupForm.reset}
                  onConfirm={(e, close) => groupForm.handleSubmit(form => {
                    asyncUpdate.call(_.id, form).then(close)
                  })()}
                  title={m._admin.createGroup}
                  confirmLabel={m.edit}
                  content={
                    <>
                      <AaInput sx={{mt: 2}} label={m.name} defaultValue={_.name} autoFocus {...groupForm.register('name')}/>
                      <AaInput multiline minRows={3} maxRows={6} defaultValue={_.desc} label={m.desc} {...groupForm.register('desc')}/>
                    </>
                  }
                >
                  <AAIconBtn size="small">edit</AAIconBtn>
                </Modal>
                <AAIconBtn size="small" onClick={() => asyncRemove.call(_.id)} loading={asyncRemove.loading.has(_.id)}>delete</AAIconBtn>
              </>
            },
          ]}
        />
        <BasicDialog
          open={!!selectedGroupId}
          loading={asyncItemCreate.loading.size > 0}
          onClose={() => setSelectedGroupId(undefined)}
          confirmDisabled={!accessForm.formState.isValid}
          onConfirm={(e) => accessForm.handleSubmit(f => {
            if (selectedGroupId?.accessId) {
              asyncItemItem.call(selectedGroupId.accessId, {
                ...f,
                drcJob: f.drcJob?.[0] ?? null
              })
            } else
              asyncItemCreate.call(selectedGroupId?.groupId!, Utils.nullValuesToUndefined(f))
            setSelectedGroupId(undefined)
          })()}
        >
          <Box sx={{width: 400}}>
            <AdminGroupAccessForm form={accessForm}/>
          </Box>
        </BasicDialog>
      </Panel>
    </Page>
  )
}