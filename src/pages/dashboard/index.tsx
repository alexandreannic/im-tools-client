import {Page, PageTitle} from '@/shared/Page'
import {useI18n} from '@/core/i18n'
import Link from 'next/link'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {Layout} from '@/shared/Layout'

const Index = () => {
  const {m} = useI18n()
  const path = (route: string) => appFeaturesIndex.dashboards.path + '/' + route
  return (
    <Layout title={m.dashboard}>
      <Page>
        <Link href={path('protection-monitoring')}>Protection Monitoring</Link>
      </Page>
    </Layout>
  )
}

export default Index