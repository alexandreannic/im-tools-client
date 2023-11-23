import React, {useEffect} from 'react'
import {Page} from '@/shared/Page'
import {useMealVerificationContext} from '@/features/MealVerification/MealVerificationContext'
import {Panel} from '@/shared/Panel'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {Avatar, Box, Dialog, Icon, useTheme} from '@mui/material'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {mealVerificationModule} from '@/features/MealVerification/MealVerification'
import {NavLink} from 'react-router-dom'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {Modal} from 'mui-extension'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'

export const MealVerificationIndex = () => {
  const ctx = useMealVerificationContext()
  const {api} = useAppSettings()
  const {session} = useSession()
  const asyncRemove = useAsync(api.mealVerification.remove)
  const {m, formatDateTime} = useI18n()
  const t = useTheme()
  useEffect(() => {
    ctx.fetcherVerifications.fetch({force: true, clean: false})
  }, [])

  return (
    <Page>
      <Panel>
        <Sheet
          header={
            <NavLink to={mealVerificationModule.siteMap.form}>
              <AaBtn variant="contained" icon="add">{m._mealVerif.newRequest}</AaBtn>
            </NavLink>
          }
          id="meal-verification-request"
          data={ctx.fetcherVerifications.entity}
          loading={ctx.fetcherVerifications.loading}
          columns={[
            {
              type: 'string',
              id: 'name',
              head: m.name,
              style: () => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => _.name
            },
            {
              type: 'string',
              id: 'desc',
              head: m.description,
              style: () => ({color: t.palette.text.secondary}),
              render: _ => _.desc
            },
            {
              type: 'date',
              id: 'createdAt',
              head: m.createdAt,
              render: _ => formatDateTime(_.createdAt),
              renderValue: _ => _.createdAt
            },
            {
              type: 'select_one',
              id: 'createdBy',
              head: m.createdBy,
              render: _ => <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Avatar sx={{width: 22, height: 22, mr: 1}}><Icon fontSize="small">person</Icon></Avatar>
                {_.createdBy}
              </Box>
            },
            {
              type: 'string',
              id: 'filters',
              head: m.filters,
              render: _ => JSON.stringify(_.filters)
            },
            {
              id: 'actions',
              head: '',
              width: 0,
              align: 'right',
              render: _ => (
                <>
                  {session.admin && (
                    <Modal
                      title={m.confirmRemove}
                      onConfirm={(e, close) => asyncRemove.call(_.id).then(() => {
                        close()
                        ctx.fetcherVerifications.fetch({force: true, clean: false})
                      })}
                      loading={asyncRemove.isLoading}
                    >
                      <TableIconBtn>delete</TableIconBtn>
                    </Modal>
                  )}
                  <NavLink to={mealVerificationModule.siteMap.data(_.id)}>
                    <TableIconBtn>chevron_right</TableIconBtn>
                  </NavLink>
                </>
              )
            }
          ]}
        />
      </Panel>
    </Page>
  )
}
