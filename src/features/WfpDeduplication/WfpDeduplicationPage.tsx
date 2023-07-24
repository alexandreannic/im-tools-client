import {Layout} from '@/shared/Layout'
import {WfpDeduplicationData} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {BtnUploader} from 'mui-extension'
import React, {useMemo} from 'react'
import {useAsync, useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '@/core/i18n'
import {useAaToast} from '@/core/useToast'
import {useAppSettings} from '@/core/context/ConfigContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {WfpDeduplicationAccess} from '@/features/WfpDeduplication/WfpDeduplicationAccess'

export const wfpDeduplicationModule = {
  basePath: '/wfp-deduplication',
  siteMap: {
    data: '/',
    access: '/access',
  }
}

const WpfDeduplicationSidebar = () => {
  const {api} = useAppSettings()
  const {session} = useSession()

  const _uploadTaxIdMapping = useAsync(api.wfpDeduplication.uploadTaxIdsMapping)
  const _refreshData = useAsync(api.wfpDeduplication.refresh)
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()
  const path = (page: string) => '' + page

  useEffectFn(_uploadTaxIdMapping.getError(), toastHttpError)
  useEffectFn(_refreshData.getError(), toastHttpError)

  return (
    <Sidebar headerId="app-header">
      <SidebarBody>
        {session.admin && (
          <>
            <SidebarItem>
              <BtnUploader
                fullWidth
                variant="outlined"
                uploading={_uploadTaxIdMapping.getLoading()}
                onUpload={_uploadTaxIdMapping.call}
                onDelete={console.log}
                msg={{
                  invalidSize: m.error,
                  loading: m.loading,
                  upload: m.mpcaDb.uploadWfpTaxIdMapping,
                }}
              />
            </SidebarItem>
            <SidebarItem>
              <AaBtn variant="outlined" icon="refresh" onClick={_refreshData.call} loading={_refreshData.getLoading()}>
                {m.refresh}
              </AaBtn>
            </SidebarItem>
            <SidebarHr sx={{my: 2}}/>
          </>
        )}
        <NavLink to={path(wfpDeduplicationModule.siteMap.data)}>
          {({isActive}) =>
            <SidebarItem icon="list_alt" active={isActive}>
              {m.data}
            </SidebarItem>
          }
        </NavLink>
        {/*<SidebarItem icon="bar_chart">*/}
        {/*  {m.dashboard}*/}
        {/*</SidebarItem>*/}
        <NavLink to={path(wfpDeduplicationModule.siteMap.access)}>
          {({isActive}) =>
            <SidebarItem icon="person_add" active={isActive}>
              {m.grantAccess}
            </SidebarItem>
          }
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const WfpDeduplicationPage = () => {
  const {accesses, session} = useSession()
  const access = useMemo(() => accesses.filter(_ => _.featureId === appFeaturesIndex.wfp_deduplication.id), [accesses])
  if (!session.admin && access.length === 0) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <Router>
      <Layout title={appFeaturesIndex.wfp_deduplication.name} sidebar={<WpfDeduplicationSidebar/>}>
        <Routes>
          <Route index element={<WfpDeduplicationData/>}/>
          <Route path={wfpDeduplicationModule.siteMap.access} element={<WfpDeduplicationAccess/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}
