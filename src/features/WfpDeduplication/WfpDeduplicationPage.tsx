import {Layout} from '@/shared/Layout'
import {WfpDeduplicationData} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {BtnUploader} from 'mui-extension'
import React from 'react'
import {useAsync, useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '@/core/i18n'
import {useAaToast} from '@/core/useToast'
import {useAppSettings} from '@/core/context/ConfigContext'
import {appFeaturesIndex} from '@/features/appFeatures'


const WpfDeduplicationSidebar = () => {
  const {api} = useAppSettings()
  const _uploadTaxIdMapping = useAsync(api.wfpDeduplication.uploadTaxIdsMapping)
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()

  useEffectFn(_uploadTaxIdMapping.getError(), toastHttpError)
  return (
    <Sidebar headerId="app-header">
      <SidebarBody>
        <SidebarItem>
          <BtnUploader
            variant="contained"
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
      </SidebarBody>
    </Sidebar>
  )
}

export const WfpDeduplicationPage = () => {
  return (
    <Layout title={appFeaturesIndex.WFP_Deduplication.name} sidebar={<WpfDeduplicationSidebar/>}>
      <WfpDeduplicationData/>
    </Layout>
  )
}
