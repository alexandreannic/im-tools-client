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
import {useSession} from '@/core/context/SessionContext'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {AaBtn} from '@/shared/Btn/AaBtn'


const WpfDeduplicationSidebar = () => {
  const {api} = useAppSettings()
  const _uploadTaxIdMapping = useAsync(api.wfpDeduplication.uploadTaxIdsMapping)
  const _refreshData = useAsync(api.wfpDeduplication.refresh)
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()

  useEffectFn(_uploadTaxIdMapping.getError(), toastHttpError)
  useEffectFn(_refreshData.getError(), toastHttpError)

  return (
    <Sidebar headerId="app-header">
      <SidebarBody>
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
        <SidebarItem icon="list_alt">
          {m.data}
        </SidebarItem>
        <SidebarItem icon="bar_chart">
          {m.dashboard}
        </SidebarItem>
        <SidebarItem icon="person_add">
          {m.grantAccess}
        </SidebarItem>
      </SidebarBody>
    </Sidebar>
  )
}

export const WfpDeduplicationPage = () => {
  const {accesses} = useSession()
  const access = useMemo(() => accesses.filter(_ => _.featureId === appFeaturesIndex.WFP_Deduplication.id), [accesses])
  if (access.length === 0) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <Layout title={appFeaturesIndex.WFP_Deduplication.name} sidebar={<WpfDeduplicationSidebar/>}>
      <WfpDeduplicationData/>
    </Layout>
  )
}
