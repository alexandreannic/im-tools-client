import {Page} from '@/shared/Page'
import {useMPCADeduplicationContext} from '../MpcaDeduplicationContext'
import {useEffect} from 'react'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Panel, PanelTitle} from '@/shared/Panel'
import {useI18n} from '../../../core/i18n'
import {Txt} from 'mui-extension'
import {TableIcon} from '../DedupTable/MpcaDedupTable'
import {useNavigate} from 'react-router'
import {mpcaModule} from '../Mpca'

export const MpcaPaymentTools = () => {
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {_getPayments} = useMPCADeduplicationContext()
  const navigate = useNavigate()

  useEffect(() => {
    _getPayments.fetch()
  }, [])

  return (
    <Page>
      <Panel>
        <Sheet
          header={<PanelTitle>{m.mpcaDb.paymentTools}</PanelTitle>}
          data={_getPayments.entity}
          loading={_getPayments.loading}
          columns={[
            {
              id: 'createdAt',
              head: m.createdAt,
              render: _ => (
                formatDate(_.createdAt)
              )
            },
            {
              id: 'budgetLineMPCA',
              head: m.mpcaDb.budgetLineMPCA,
              render: _ => _.budgetLineMPCA
            },
            {
              id: 'budgetLineCFR',
              head: m.mpcaDb.budgetLineCFR,
              render: _ => _.budgetLineCFR
            },
            {
              id: 'budgetLineStartUp',
              head: m.mpcaDb.budgetLineStartUp,
              render: _ => _.budgetLineStartUp
            },
            {
              id: 'hoo',
              head: m.mpcaDb.headOfOperations,
              render: _ => _.headOfOperation,
            },
            {
              id: 'hoo',
              head: m.mpcaDb.financeAndAdministrationOfficer,
              render: _ => _.financeAndAdministrationOfficer,
            },
            {
              id: 'hoo',
              head: m.mpcaDb.cashAndVoucherAssistanceAssistant,
              render: _ => _.cashAndVoucherAssistanceAssistant,
            },
            {
              id: 'kobo',
              head: 'Kobo',
              align: 'right',
              render: _ => (
                <Txt link bold>{_.answers?.length}</Txt>
              )
            },
            {
              id: 'actions',
              head: '',
              align: 'right',
              onClick: _ => navigate(mpcaModule.siteMap.paymentTool(_.id)),
              render: _ => (
                <TableIcon>chevron_right</TableIcon>
              )
            }
          ]}/>
      </Panel>
    </Page>
  )
}