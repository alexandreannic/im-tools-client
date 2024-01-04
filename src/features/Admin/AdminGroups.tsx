import {Page} from '@/shared/Page'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect} from 'react'
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

interface GoupForm {
  name: string
  desc?: string
}

export const AdminGroups = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()

  const groupForm = useForm<GoupForm>()
  const accessForm = useForm<IAccessForm>()

  const fetcher = useFetcher(api.group.getAllWithItems)
  const asyncCreate = useAsync(api.group.create)
  const asyncRemove = useAsync(api.group.remove, {requestKey: _ => _[0]})
  const asyncCreateItem = useAsync(api.group.createItem)
  const asyncDeleteItem = useAsync(api.group.deleteItem, {requestKey: _ => _[0]})

  useEffect(() => {
    fetcher.fetch()
  }, [])

  useEffect(() => {
    fetcher.fetch({force: true, clean: false})
  }, [
    asyncCreate.calledIndex,
    asyncRemove.calledIndex,
    asyncDeleteItem.calledIndex,
    asyncCreateItem.calledIndex,
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
            {id: 'drcJob', width: 150, head: m.name, render: _ => _.name},
            {id: 'email', width: 120, head: m.desc, render: _ => _.desc},
            {
              id: 'items', style: () => ({whiteSpace: 'normal'}), head: m.accesses, render: _ => (
                <>
                  {_.items.map(item =>
                    <Chip
                      onDelete={e => asyncDeleteItem.call(item.id)}
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
                  <Modal
                    loading={asyncCreateItem.loading.size > 0}
                    confirmDisabled={!accessForm.formState.isValid}
                    onConfirm={(e, close) => accessForm.handleSubmit(f => {
                      asyncCreateItem.call(_.id, f)
                      close()
                    })()}
                    content={
                      <Box sx={{width: 400}}>
                        <AdminGroupAccessForm form={accessForm}/>
                      </Box>
                    }>
                    <Chip
                      icon={<Icon>add</Icon>}
                      size="small"
                      variant="outlined"
                      clickable
                      sx={{
                        borderStyle: 'dotted',
                        // borderWidth: 2
                      }}
                    />
                  </Modal>
                </>
              )
            },
            {
              id: 'actions', width: 1, align: 'right', render: _ => <>
                <AAIconBtn onClick={() => asyncRemove.call(_.id)} loading={asyncRemove.loading.has(_.id)}>delete</AAIconBtn>
              </>
            },
          ]}
        />
      </Panel>
    </Page>
  )
}