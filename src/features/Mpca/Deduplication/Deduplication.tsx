import {Page} from '@/shared/Page'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {Datatable} from '@/shared/Datatable/Datatable'

export const Deduplication = () => {
  const {api} = useAppSettings()
  const _search = useFetcher(api.wfpDeduplication.search)
  const {formatDate} = useI18n()

  useEffect(() => {
    _search.fetch()
  }, [])

  return (
    <Page width="lg">

      <Panel>
        <Datatable
          loading={_search.loading}
          columns={[
            {id: 'createdAt', render: _ => formatDate(_.createdAt)},
            {id: 'taxId', render: _ => _.taxId ?? _.beneficiaryId},
            {id: 'status', render: _ => _.amount},
            {id: 'validFrom', render: _ => formatDate(_.validFrom)},
            {id: 'expiry', render: _ => formatDate(_.expiry)},
            {id: 'status', render: _ => _.status},
            {id: 'existingOrga', render: _ => _.existingOrga},
            {id: 'existingAmount', render: _ => _.existingAmount},
            {id: 'existingStart', render: _ => formatDate(_.existingStart)},
            {id: 'existingEnd', render: _ => formatDate(_.existingEnd)},
          ]}
          data={_search.entity?.data}
        />
      </Panel>
    </Page>
  )
}