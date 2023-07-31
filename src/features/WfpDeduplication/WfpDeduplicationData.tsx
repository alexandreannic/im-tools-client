import {Page} from '@/shared/Page'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Sheet} from '@/shared/Sheet/Sheet'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {DrcSupportSuggestion, WfpDeduplicationStatus} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {Txt} from 'mui-extension'
import {DrcOffice} from '@/core/drcJobTitle'

import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'

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
          title="wfp-deduplication"
          loading={_search.loading}
          columns={[
            {
              id: 'fileName',
              head: m.fileName,
              renderExport: true,
              render: _ => _.fileName, width: 146
            },
            {
              id: 'createdAt',
              head: m.createdAt,
              renderExport: true,
              render: _ => formatDate(_.createdAt), type: 'date'
            },
            {
              id: 'office',
              head: m.office,
              renderExport: true,
              render: _ => _.office, type: 'select_one', options: Enum.values(DrcOffice).map(_ => ({label: _, name: _}))
            },
            {
              id: 'taxId',
              head: m.taxId,
              renderExport: true,
              render: _ => _.taxId ?? <Txt color="error">{m.mpcaDb.uploadWfpTaxIdMapping}</Txt>, type: 'text'
            },
            {
              id: 'amount',
              head: m.amount,
              align: 'right', renderExport: true,
              render: _ => formatLargeNumber(_.amount)
            },
            {
              id: 'validFrom',
              head: m.validFrom,
              renderExport: true,
              render: _ => formatDate(_.validFrom)
            },
            {
              id: 'expiry',
              head: m.expiry,
              renderExport: true,
              render: _ => formatDate(_.expiry)
            },
            {
              id: 'suggestion',
              head: m.suggestion,
              renderExport: true,
              render: _ => m.mpcaDb.drcSupportSuggestion[_.suggestion],
              width: 246,
              type: 'select_one',
              options: Enum.keys(DrcSupportSuggestion).map(_ => ({label: m.mpcaDb.drcSupportSuggestion[_], name: _})),
            },
            {
              id: 'status',
              align: 'center',
              head: m.status,
              type: 'select_one',
              options: Enum.keys(WfpDeduplicationStatus).map(_ => ({label: _, name: _})),
              tooltip: _ => m.mpcaDb.status[_.status],
              renderExport: false,
              render: _ => (
                fnSwitch(_.status, {
                  Deduplicated: <TableIcon color="warning" icon="join_full"/>,
                  PartiallyDeduplicated: <TableIcon color="info" icon="join_left"/>,
                  NotDeduplicated: <TableIcon color="success" icon="check_circle"/>,
                  Error: <TableIcon color="error" icon="error"/>,
                }, () => <></>)
              ),
            },
            {
              id: 'existingOrga',
              head: m.mpcaDb.existingOrga,
              renderExport: true,
              render: _ => _.existingOrga
            },
            {
              id: 'existingAmount',
              head: m.mpcaDb.existingAmount,
              align: 'right', renderExport: true,
              render: _ => _.existingAmount && formatLargeNumber(_.existingAmount)
            },
            {
              id: 'existingStart',
              head: m.mpcaDb.existingStart,
              renderExport: true,
              render: _ => _.existingStart && formatDate(_.existingStart)
            },
            {
              id: 'existingEnd',
              head: m.mpcaDb.existingEnd,
              renderExport: true,
              render: _ => _.existingEnd && formatDate(_.existingEnd)
            },
          ]}
          data={_search.entity?.data}
        />
      </Panel>
    </Page>
  )
}