import {Page} from '@/shared/Page'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Sheet} from '@/shared/Sheet/Sheet'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {DrcSupportSuggestion, WfpDeduplicationStatus} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {Icon} from '@mui/material'
import {BtnUploader, Txt} from 'mui-extension'
import {DrcOffice} from '@/core/drcJobTitle'

export const WfpDeduplicationData = () => {
  const {api} = useAppSettings()
  const _search = useFetcher(api.wfpDeduplication.search)
  const _uploadTaxIdMapping = useAsync(api.wfpDeduplication.uploadTaxIdsMapping)
  const {formatDate, formatLargeNumber} = useI18n()
  const {m} = useI18n()

  useEffect(() => {
    _search.fetch()
  }, [])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          loading={_search.loading}
          columns={[
            {id: 'createdAt', head: m.createdAt, render: _ => formatDate(_.createdAt), type: 'date'},
            {id: 'office', head: m.office, render: _ => _.office, type: Enum.values(DrcOffice)},
            {id: 'taxId', head: m.taxId, render: _ => _.taxId ?? <Txt color="error">{m.mpcaDb.uploadWfpTaxIdMapping}</Txt>, type: 'string'},
            {id: 'amount', head: m.amount, align: 'right', render: _ => formatLargeNumber(_.amount)},
            {id: 'validFrom', head: m.validFrom, render: _ => formatDate(_.validFrom)},
            {id: 'expiry', head: m.expiry, render: _ => formatDate(_.expiry)},
            {id: 'suggestion', head: '', render: _ => m.mpcaDb.drcSupportSuggestion[_.suggestion], type: Enum.keys(DrcSupportSuggestion)},
            {
              id: 'status', align: 'center', head: m.status,
              type: Enum.keys(WfpDeduplicationStatus),
              tooltip: _ => m.mpcaDb.status[_.status],
              render: _ => (
                fnSwitch(_.status, {
                  Deduplicated: <Icon color="warning">join_full</Icon>,
                  PartiallyDeduplicated: <Icon color="info">join_left</Icon>,
                  NotDeduplicated: <Icon color="success">check_circle</Icon>,
                  Error: <Icon color="error">error</Icon>,
                }, () => <></>)
              ),
            },
            {id: 'existingOrga', head: m.mpcaDb.existingOrga, render: _ => _.existingOrga},
            {id: 'existingAmount', head: m.mpcaDb.existingAmount, align: 'right', render: _ => _.existingAmount && formatLargeNumber(_.existingAmount)},
            {id: 'existingStart', head: m.mpcaDb.existingStart, render: _ => _.existingStart && formatDate(_.existingStart)},
            {id: 'existingEnd', head: m.mpcaDb.existingEnd, render: _ => _.existingEnd && formatDate(_.existingEnd)},
          ]}
          data={_search.entity?.data}
        />
      </Panel>
    </Page>
  )
}