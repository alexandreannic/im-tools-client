import {Box, Grid} from '@mui/material'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from 'mui-extension'
import {appFeatures} from '@/features/appFeatureId'
import {FeatureLogo} from '@/features/FeatureLogo'
import {Page} from '@/shared/Page'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'

export const Home = () => {
  const {m} = useI18n()
  const {session, accesses} = useSession()
  return (
    <Page>
      <Box sx={{textAlign: 'center'}}>
        <DRCLogo/>
        <Txt sx={{textAlign: 'center'}} size="title" block>{m.title}</Txt>
        <Txt sx={{textAlign: 'center', mb: 4}} size="big" color="hint" block>{m.subTitle}</Txt>
      </Box>
      <Grid container>
        {appFeatures.filter(_ => !_.showIf || _.showIf(session, accesses)).map(feature => (
          <Grid key={feature.id} item md={3} sm={4} xs={6}>
            <FeatureLogo sx={{m: 2}} feature={feature}/>
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}
