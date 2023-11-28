import React, {useEffect} from 'react'
import {Page} from '@/shared/Page'
import {useMealVerificationContext} from '@/features/MealVerification/MealVerificationContext'
import {Panel} from '@/shared/Panel'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {Avatar, Box, Icon, useTheme} from '@mui/material'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {mealVerificationModule} from '@/features/MealVerification/MealVerification'
import {NavLink} from 'react-router-dom'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {Modal, Txt} from 'mui-extension'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'
import {mealVerificationActivitiesIndex} from '@/features/MealVerification/mealVerificationConfig'
import {kobo, KoboIndex} from '@/koboDrcUaFormId'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseModule} from '@/features/Database/databaseModule'
import Link from 'next/link'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'

const LinkToForm = ({
  koboFormId,
}: {
  koboFormId: KoboId
}) => {
  const {conf} = useAppSettings()
  return (
    <Link target="_blank" href={conf.linkToFeature(
      AppFeatureId.kobo_database,
      databaseModule.siteMap.database.absolute(kobo.drcUa.server.prod, koboFormId)
    )}>
      <Txt link sx={{verticalAlign: 'middle',}}>
        <Icon fontSize="inherit" sx={{mr: .5}}>open_in_new</Icon>
        {KoboIndex.searchById(koboFormId)?.translation}
      </Txt>
    </Link>
  )
}

export const MealVerificationList = () => {
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
    <Page width="full">
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
              type: 'select_one',
              id: 'activity',
              head: m._mealVerif.activityForm,
              renderOption: _ => KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].activity.koboFormId)?.translation,
              renderValue: _ => KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].activity.koboFormId)?.translation,
              render: _ => <LinkToForm koboFormId={mealVerificationActivitiesIndex[_.activity].activity.koboFormId}/>
            },
            {
              type: 'select_one',
              id: 'verification',
              head: m._mealVerif.verificationForm,
              renderOption: _ => KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].verification.koboFormId)?.translation,
              renderValue: _ => KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].verification.koboFormId)?.translation,
              render: _ => <LinkToForm koboFormId={mealVerificationActivitiesIndex[_.activity].verification.koboFormId}/>
            },
            {
              id: 'actions',
              head: '',
              width: 1,
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
