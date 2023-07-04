import {Fender} from 'mui-extension'
import {Layout} from '@/shared/Layout'
import {Page} from '@/shared/Page'

export const NoFeatureAccessPage = () => {

  return (
    <Layout>
      <Page>
        <Fender type="error">
          You don't have access to this feature.
        </Fender>
      </Page>
    </Layout>
    // <Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    // </Box>
  )
}