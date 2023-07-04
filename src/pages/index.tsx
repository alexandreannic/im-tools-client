import {useI18n} from '@/core/i18n'
import {useMsal} from '@azure/msal-react'
import React from 'react'
import {Box, Grid} from '@mui/material'
import {appFeatures} from '@/features/appFeatureId'
import {FeatureLogo} from '@/features/FeatureLogo'
import {Page} from '@/shared/Page'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from 'mui-extension'

const Index = () => {
  const {m} = useI18n()
  const msal = useMsal()

  return (
    <Page>
      <Box sx={{textAlign: 'center'}}>
        <DRCLogo/>
        <Txt sx={{textAlign: 'center'}} size="title" block>{m.title}</Txt>
        <Txt sx={{textAlign: 'center', mb: 4}} size="big" color="hint" block>{m.subTitle}</Txt>
      </Box>
      <Grid container>
        {appFeatures.map(feature => (
          <Grid key={feature.id} item md={3} sm={4} xs={6}>
            <FeatureLogo sx={{m: 2}} feature={feature}/>
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

export default Index