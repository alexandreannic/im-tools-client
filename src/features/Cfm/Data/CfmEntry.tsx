import {CfmData, useCfmContext} from '@/features/Cfm/CfmContext'
import {useParams} from 'react-router'
import {Page, PageTitle} from '@/shared/Page'
import * as yup from 'yup'
import {Fender, Txt} from 'mui-extension'
import {Box, Divider, Grid, Icon} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {ListRow} from '@/shared/ListRow'
import {useI18n} from '@/core/i18n'
import {AaSelect} from '@/shared/Select/Select'
import React from 'react'
import {KoboMealCfmArea, KoboMealCfmStatus, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboSelectTag} from '@/shared/KoboSelectTag'
import {DrcOffice} from '@/core/drcJobTitle'
import {Utils} from '@/utils/utils'
import {AaInput} from '@/shared/ItInput/AaInput'
import {DebouncedInput} from '@/shared/DebouncedInput'

const routeParamsSchema = yup.object({
  formId: yup.string().required(),
  answerId: yup.number().required()
})
export const CfmEntryRoute = () => {
  const {formId, answerId} = routeParamsSchema.validateSync(useParams())
  const ctx = useCfmContext()
  const entry = ctx.data.entity?.find(_ => _.id === answerId && formId === formId)

  console.log(ctx.data.entity)
  if (!entry) {
    return (
      <Fender type="error">
        {formId}, {answerId}
      </Fender>
    )
  }
  return (
    <Page>
      <CfmEntry entry={entry}/>
    </Page>
  )
}

export const CfmEntry = ({entry}: {entry: CfmData}) => {
  const {m, formatDateTime} = useI18n()
  const ctx = useCfmContext()
  return (
    <Page>
      <PageTitle subTitle={formatDateTime(entry.date)} action={
        <KoboSelectTag<KoboMealCfmTag, CfmData>
          sx={{width: 200,}}
          label={m.status}
          entry={entry}
          setData={ctx.data.setEntity}
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
      }>
        <Box>{entry.id}</Box>
      </PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Panel>
            <PanelHead>{m._cfm.reporterDetails}</PanelHead>
            <PanelBody>
              <ListRow icon="person" label={entry.name}/>
              <ListRow icon="phone" label={entry.phone}/>
              <ListRow icon="email" label={entry.email}/>
              <ListRow icon="female" label={ctx.translateExternal.translateChoice('gender', entry.gender)}/>
              <Divider/>
              <ListRow icon="location_on" label={m.oblast}>{ctx.translateExternal.translateChoice('ben_det_oblast', entry.ben_det_oblast)}</ListRow>
              <ListRow icon="" label={m.raion}>{ctx.translateExternal.translateChoice('ben_det_raion', entry.ben_det_raion)}</ListRow>
              <ListRow icon="" label={m.hromada}>{ctx.translateExternal.translateChoice('ben_det_hromada', entry.ben_det_hromada)}</ListRow>
              <Divider/>
              {entry.internal ? (
                <>
                  <ListRow icon="bookmark" label={m._cfm.existingDrcBeneficiary}>{entry.internal.existing_beneficiary && (
                    <Icon color="success">check_circle</Icon>
                  )}</ListRow>
                  <ListRow icon="" label={m.projectCode}>{entry.internal.project_code}</ListRow>
                </>
              ) : entry.external && entry.external.feedback_type === 'complaint' && (
                <>
                  <ListRow icon="handshake" label={m._cfm.contactAgreement}>
                    {entry.external.prot_support === 'yes' ? (
                      <Icon color="success">check_circle</Icon>
                    ) : (
                      <Icon color="error">block</Icon>
                    )}
                    <Box sx={{ml: 1}}>
                      {ctx.translateExternal.translateChoice('prot_support', entry.external.prot_support)}
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
              <ListRow icon="business" label={m.drcOffice}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  formId={entry.formId}
                  answerId={entry.id}
                  setData={ctx.data.setEntity}
                  enumerator={DrcOffice}
                  tag="office"
                  entry={entry}
                />
              </ListRow>
              <ListRow icon="map" label={m.area}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  formId={entry.formId}
                  answerId={entry.id}
                  setData={ctx.data.setEntity}
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
      <Txt color="hint" bold uppercase block sx={{mb: 1}}>{m._cfm.feedback}</Txt>
      {entry.internal ? (
        <Panel>
          <PanelHead>
            {ctx.translateInternal.translateChoice('feedback_type', entry.internal?.feedback_type)}
          </PanelHead>
          <PanelBody>
            {entry.internal.feedback}
          </PanelBody>
        </Panel>
      ) : entry.external && (
        <Panel>
          <PanelHead>
            {ctx.translateExternal.translateChoice('feedback_type', entry.external?.feedback_type)}
          </PanelHead>
          <PanelBody>
            {entry.external.thanks_feedback ?? entry.external?.complaint}
          </PanelBody>
        </Panel>
      )}
    </Page>
  )
}