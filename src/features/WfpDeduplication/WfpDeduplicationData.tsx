import {Page} from '@/shared/Page'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Sheet, SheetUtils} from '@/shared/Sheet/Sheet'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {DrcSupportSuggestion, WfpDeduplicationStatus} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {Txt} from 'mui-extension'
import {DrcOffice} from '@/core/drcJobTitle'

import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {format} from 'date-fns'

export const WfpDeduplicationData = () => {
  const {api} = useAppSettings()
  const _search = useFetcher(api.wfpDeduplication.search)
  const _uploadTaxIdMapping = useAsync(api.wfpDeduplication.uploadTaxIdsMapping)
  const {formatDate, formatLargeNumber} = useI18n()
  const {m} = useI18n()

  const existingOrga = useMemo(() => {
    if (!_search.entity) return
    return Arr(_search.entity.data)
      .map(_ => _.existingOrga)
      .distinct(_ => _)
      .compact()
      .map(SheetUtils.buildOption)
  }, [_search.entity])

  console.log(existingOrga)

  useEffect(() => {
    _search.fetch()
  }, [])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          showExportBtn
          title={'wfp-deduplication-' + format(new Date(), 'yyyy-MM-dd')}
          loading={_search.loading}
          columns={[
            {
              id: 'fileName',
              head: m.fileName,
              renderExport: true,
              render: _ => _.fileName,
              type: 'string',
            },
            {
              id: 'createdAt',
              head: m.createdAt,
              renderExport: true,
              render: _ => formatDate(_.createdAt),
              type: 'date'
            },
            {
              id: 'office',
              head: m.office,
              renderExport: true,
              render: _ => _.office,
              type: 'select_one',
              options: () => Enum.values(DrcOffice).map(_ => ({label: _, value: _}))
            },
            // {
            //   id: 'beneficiaryId',
            //   head: 'beneficiaryId',
            //   renderExport: true,
            //   render: _ => _.beneficiaryId, type: 'string'
            // },
            {
              id: 'taxId',
              head: m.taxId,
              renderExport: true,
              render: _ => _.taxId ?? <Txt color="error">{m.mpcaDb.uploadWfpTaxIdMapping}</Txt>,
              type: 'string',
            },
            {
              id: 'amount',
              type: 'number',
              head: m.amount,
              align: 'right', renderExport: true,
              render: _ => formatLargeNumber(_.amount)
            },
            {
              id: 'validFrom',
              head: m.validFrom,
              type: 'date',
              renderExport: true,
              render: _ => formatDate(_.validFrom)
            },
            {
              id: 'expiry',
              head: m.expiry,
              renderExport: true,
              type: 'date',
              render: _ => formatDate(_.expiry)
            },
            {
              id: 'suggestion',
              head: m.suggestion,
              renderExport: true,
              render: _ => m.mpcaDb.drcSupportSuggestion[_.suggestion],
              width: 246,
              type: 'select_one',
              options: () => Enum.keys(DrcSupportSuggestion).map(_ => ({label: m.mpcaDb.drcSupportSuggestion[_], value: _})),
            },
            {
              id: 'status',
              align: 'center',
              head: m.status,
              type: 'select_one',
              options: () => Enum.keys(WfpDeduplicationStatus).map(_ => ({label: _, value: _})),
              tooltip: _ => m.mpcaDb.status[_.status],
              renderExport: false,
              render: _ => (
                fnSwitch(_.status, {
                  Deduplicated: <TableIcon color="warning" children="join_full"/>,
                  PartiallyDeduplicated: <TableIcon color="info" children="join_left"/>,
                  NotDeduplicated: <TableIcon color="success" children="check_circle"/>,
                  Error: <TableIcon color="error" children="error"/>,
                }, () => <></>)
              ),
            },
            {
              id: 'existingOrga',
              head: m.mpcaDb.existingOrga,
              renderExport: true,
              render: _ => _.existingOrga,
              options: existingOrga ? (() => existingOrga) : undefined,
              type: 'select_one',
            },
            {
              id: 'existingAmount',
              head: m.mpcaDb.existingAmount,
              align: 'right', renderExport: true,
              render: _ => _.existingAmount && formatLargeNumber(_.existingAmount),
              type: 'number',
            },
            {
              id: 'existingStart',
              head: m.mpcaDb.existingStart,
              renderExport: true,
              render: _ => _.existingStart && formatDate(_.existingStart),
              type: 'date',
            },
            {
              id: 'existingEnd',
              head: m.mpcaDb.existingEnd,
              renderExport: true,
              render: _ => _.existingEnd && formatDate(_.existingEnd),
              type: 'date',
            },
          ]}
          data={_search.entity?.data}
        />
      </Panel>
    </Page>
  )
}