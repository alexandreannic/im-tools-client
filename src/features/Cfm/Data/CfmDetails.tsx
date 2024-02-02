import {CfmData, cfmMakeEditRequestKey, CfmStatusIconLabel, useCfmContext} from '@/features/Cfm/CfmContext'
import {useNavigate, useParams} from 'react-router'
import {Page, PageTitle} from '@/shared/Page'
import * as yup from 'yup'
import {Fender, Txt} from 'mui-extension'
import {Box, Divider, Grid, Icon} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {ListRow} from '@/shared/ListRow'
import {useI18n} from '@/core/i18n'
import React from 'react'
import {CfmDataProgram, CfmDataSource, KoboMealCfmArea, KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {KoboSelectTag} from '@/shared/KoboSelectTag'
import {DrcOffice} from '@/core/type/drc'
import {Utils} from '@/utils/utils'
import {Enum, Obj} from '@alexandreannic/ts-utils'
import {CfmPriorityLogo} from '@/features/Cfm/Data/CfmTable'
import {IpBtn} from '@/shared/Btn'
import {cfmIndex} from '@/features/Cfm/Cfm'
import {useSession} from '@/core/Session/SessionContext'
import {Modal} from 'mui-extension/lib/Modal'
import {Meal_CfmInternalOptions} from '@/core/sdk/server/kobo/generatedInterface/Meal_CfmInternal/Meal_CfmInternalOptions'
import {useAppSettings} from '@/core/context/ConfigContext'
import {TableInput} from '@/shared/TableInput'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'

const routeParamsSchema = yup.object({
  formId: yup.string().required(),
  answerId: yup.string().required()
})
export const CfmEntryRoute = () => {
  const {formId, answerId} = routeParamsSchema.validateSync(useParams())
  const ctx = useCfmContext()
  const entry = ctx.mappedData?.find(_ => _.id === answerId && formId === formId)

  if (!entry) {
    return (
      <Fender type="error">
        {formId}, {answerId}
      </Fender>
    )
  }
  return (
    <Page>
      <CfmDetails entry={entry}/>
    </Page>
  )
}

export const CfmDetails = ({entry}: {
  entry: CfmData
}) => {
  const {m, formatDateTime} = useI18n()
  const ctx = useCfmContext()
  const navigate = useNavigate()
  const {api} = useAppSettings()
  const {session} = useSession()
  const canEdit = ctx.authorizations.sum.write || session.email === entry.tags?.focalPointEmail
  return (
    <Page>
      <PageTitle subTitle={formatDateTime(entry.date)} action={
        <>
          <CfmPriorityLogo fontSize="large" priority={entry.priority} sx={{mr: 2}}/>
          <KoboSelectTag<KoboMealCfmTag, CfmData>
            sx={{width: 200,}}
            label={m.status}
            entry={entry}
            tag="status"
            formId={entry.formId}
            answerId={entry.id}
            enumerator={KoboMealCfmStatus}
            translate={new Obj(KoboMealCfmStatus)
              .filter(_ => !ctx.authorizations.sum.admin ? _ !== KoboMealCfmStatus.Archived : true)
              .mapValues(k => (
                <CfmStatusIconLabel key={k} status={k!} sx={{display: 'flex', alignItems: 'center'}}/>
              )).get()
            }
          />
        </>
      }>
        <Box>{entry.id} - {m._cfm.formFrom[entry.form]}</Box>
      </PageTitle>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={6}>
          <Panel>
            <PanelHead action={
              canEdit && (
                <IpBtn
                  variant="outlined"
                  color="primary"
                  icon="edit"
                  href={api.koboApi.getEditUrl({formId: entry.formId, answerId: entry.id})}
                  target="_blank"
                >{m.edit}</IpBtn>
              )}
            >{m._cfm.reporterDetails}</PanelHead>
            <PanelBody>
              <ListRow icon="person" label={entry.name}/>
              <ListRow icon="phone" label={entry.phone}/>
              <ListRow icon="email" label={entry.email}/>
              <ListRow icon="female" label={ctx.schemaExternal.translate.choice('gender', entry.gender)}/>
              <Divider/>
              <ListRow icon="location_on" label={m.oblast}>{entry.oblast}</ListRow>
              <ListRow icon="" label={m.raion}>{ctx.schemaExternal.translate.choice('ben_det_raion', entry.ben_det_raion)}</ListRow>
              <ListRow icon="" label={m.hromada}>{ctx.schemaExternal.translate.choice('ben_det_hromada', entry.ben_det_hromada)}</ListRow>
              {entry.form === CfmDataSource.Internal ? (
                <>
                  <Divider/>
                  <ListRow icon="bookmark" label={m._cfm.existingDrcBeneficiary}>{entry.internal_existing_beneficiary && (
                    <Icon color="success">check_circle</Icon>
                  )}</ListRow>
                  <ListRow icon="" label={m.projectCode}>{entry.project}</ListRow>
                </>
              ) : entry.external_feedback_type === 'complaint' && (
                <>
                  <Divider/>
                  <ListRow icon="handshake" label={m._cfm.contactAgreement}>
                    {entry.external_prot_support === 'yes' ? (
                      <Icon color="success">check_circle</Icon>
                    ) : (
                      <Icon color="error">block</Icon>
                    )}
                    <Box sx={{ml: 1}}>
                      {ctx.schemaExternal.translate.choice('prot_support', entry.external_prot_support)}
                    </Box>
                  </ListRow>
                </>
              )}
            </PanelBody>
          </Panel>
        </Grid>
        <Grid item xs={6}>
          <Panel>
            <PanelBody>
              <ListRow icon="support_agent" label={m.focalPoint}>
                <TableInput
                  value={entry.tags?.focalPointEmail}
                  placeholder="@drc.ngo"
                  helper={(() => {
                    const email = entry.tags?.focalPointEmail
                    if (email && !Utils.regexp.drcEmail.test(email)) return {
                      text: m.invalidEmail,
                      status: 'error'
                    }
                  })()}
                  onChange={_ => {
                    if (_ === undefined || Utils.regexp.drcEmail.test(_))
                      ctx.updateTag.call({formId: entry.formId, answerId: entry.id, key: 'focalPointEmail', value: _})
                  }}
                />
              </ListRow>
              <ListRow icon="work" label={m.program}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  showUndefinedOption
                  formId={entry.formId}
                  answerId={entry.id}
                  enumerator={CfmDataProgram}
                  tag="program"
                  entry={entry}
                />
              </ListRow>
              <ListRow icon="business" label={m.drcOffice}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  showUndefinedOption
                  formId={entry.formId}
                  answerId={entry.id}
                  enumerator={DrcOffice}
                  tag="office"
                  entry={entry}
                />
              </ListRow>
              <ListRow icon="map" label={m.area}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  showUndefinedOption
                  formId={entry.formId}
                  answerId={entry.id}
                  enumerator={KoboMealCfmArea}
                  tag="gca"
                  entry={entry}
                />
              </ListRow>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
      <Panel>
        <PanelHead>{m._cfm.feedback} {entry.external_feedback_type ? `(${m._cfm._feedbackType[entry.external_feedback_type!]})` : ``}</PanelHead>
        <PanelBody>
          <IpSelectSingle
            sx={{mb: 2}}
            disabled={entry.form === CfmDataSource.Internal}
            defaultValue={entry.category}
            onChange={newValue => {
              ctx.updateTag.call({formId: entry.formId, answerId: entry.id, key: 'feedbackTypeOverride', value: newValue})
            }}
            options={Enum.entries(Meal_CfmInternalOptions.feedback_type).map(([k, v]) => ({value: k, children: v}))}
          />
          <Box>{entry.feedback}</Box>

          {entry.comments && <Txt block sx={{mt: 2}} bold size="big">{m.comments}</Txt>}
          {entry.comments}

          <Txt block sx={{mt: 2}} bold size="big">{m.note}</Txt>
          <TableInput
            value={entry.tags?.notes}
            multiline
            minRows={6}
            maxRows={10}
            onChange={_ => {
              ctx.updateTag.call({formId: entry.formId, answerId: entry.id, key: 'notes', value: _})
            }}
          />
        </PanelBody>
      </Panel>
      {ctx.authorizations.sum.admin && (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Modal
            loading={ctx.asyncRemove.loading[cfmMakeEditRequestKey(entry.formId, entry.id)]}
            content={m._cfm.deleteWarning}
            onConfirm={() => ctx.asyncRemove.call({formId: entry.formId, answerId: entry.id}).then(() => navigate(cfmIndex.siteMap.data))}
            title={m.shouldDelete}
          >
            <IpBtn
              icon="delete"
              size="large"
              sx={{margin: 'auto'}}
              variant="contained"
            >
              {m.remove}
            </IpBtn>
          </Modal>
        </Box>
      )}
    </Page>
  )
}