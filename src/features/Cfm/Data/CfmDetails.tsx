import {CfmData, cfmMakeEditRequestKey, useCfmContext} from '@/features/Cfm/CfmContext'
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
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboSelectTag} from '@/shared/KoboSelectTag'
import {DrcOffice} from '@/core/drcUa'
import {Utils} from '@/utils/utils'
import {AaInput} from '@/shared/ItInput/AaInput'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {AaSelect} from '@/shared/Select/Select'
import {Enum} from '@alexandreannic/ts-utils'
import {CfmPriorityLogo} from '@/features/Cfm/Data/CfmTable'
import {IpBtn} from '@/shared/Btn/IpBtn'
import {cfmIndex} from '@/features/Cfm/Cfm'
import {useSession} from '@/core/Session/SessionContext'
import {Modal} from 'mui-extension/lib/Modal'
import {Meal_CfmInternalOptions} from '@/core/koboModel/Meal_CfmInternal/Meal_CfmInternalOptions'
import {useAppSettings} from '@/core/context/ConfigContext'

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
            translate={{
              [KoboMealCfmStatus.Close]: (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TableIcon sx={{mr: 1}} tooltip={m._cfm.status.Close} color="success">check_circle</TableIcon>
                  {m._cfm.status.Close}
                </Box>
              ),
              [KoboMealCfmStatus.Open]: (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TableIcon sx={{mr: 1}} tooltip={m._cfm.status.Open} color="warning">new_releases</TableIcon>
                  {m._cfm.status.Open}
                </Box>
              ),
              [KoboMealCfmStatus.Processing]: (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TableIcon sx={{mr: 1}} tooltip={m._cfm.status.Processing} color="info">schedule</TableIcon>
                  {m._cfm.status.Processing}
                </Box>
              ),
            }}
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
              <ListRow icon="female" label={ctx.translateExternal.translateChoice('gender', entry.gender)}/>
              <Divider/>
              <ListRow icon="location_on" label={m.oblast}>{entry.oblast}</ListRow>
              <ListRow icon="" label={m.raion}>{ctx.translateExternal.translateChoice('ben_det_raion', entry.ben_det_raion)}</ListRow>
              <ListRow icon="" label={m.hromada}>{ctx.translateExternal.translateChoice('ben_det_hromada', entry.ben_det_hromada)}</ListRow>
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
                      {ctx.translateExternal.translateChoice('prot_support', entry.external_prot_support)}
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
                <DebouncedInput<string>
                  debounce={1250}
                  value={entry.tags?.focalPointEmail}
                  onChange={_ => {
                    if (_ === '' || Utils.regexp.drcEmail.test(_))
                      ctx.updateTag.call({formId: entry.formId, answerId: entry.id, key: 'focalPointEmail', value: _})
                  }}
                >
                  {(value, onChange) => (
                    <AaInput
                      helperText={null}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      placeholder="@drc.ngo"
                      endAdornment={value && !Utils.regexp.drcEmail.test(value) && <TableIcon tooltip={m.invalidEmail} color="error">error</TableIcon>}
                    />
                  )}
                </DebouncedInput>
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
              <Divider sx={{mb: 2}}/>
              <DebouncedInput<string>
                debounce={1250}
                value={entry.tags?.notes}
                onChange={_ => {
                  ctx.updateTag.call({formId: entry.formId, answerId: entry.id, key: 'notes', value: _})
                }}
              >
                {(value, onChange) => (
                  <AaInput
                    multiline
                    rows={8}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    label={m.note}
                  />
                )}
              </DebouncedInput>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
      <Panel>
        <PanelHead>{m._cfm.feedback} {entry.external_feedback_type ? `(${m._cfm._feedbackType[entry.external_feedback_type!]})` : ``}</PanelHead>
        <PanelBody>
          <AaSelect
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
        </PanelBody>
      </Panel>
      {canEdit && (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Modal
            loading={ctx.asyncRemove.loading.get(cfmMakeEditRequestKey(entry.formId, entry.id))}
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