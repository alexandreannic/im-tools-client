import {DashboardPageProps} from './ProtectionDashboardMonito'
import {useI18n} from '@/core/i18n'
import {Div} from '@/shared/PdfLayout/PdfSlide'
import {Protection_hhs3} from '@/core/sdk/server/kobo/generatedInterface/Protection_hhs3'
import {useMemo} from 'react'
import {ChartHelper} from '@/shared/charts/chartHelper'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Panel, PanelBody} from '@/shared/Panel'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Txt} from 'mui-extension'
import {toPercent} from '@/utils/utils'

export const ProtectionDashboardMonitoPN = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  const fixedData = useMemo(() => {
    return data.map(_ => {
      return {
        ..._,
        what_is_your_1_priority: _.what_is_your_1_priority === 'livelihood_support vocational_training' as any ? 'livelihood_support' : _.what_is_your_1_priority,
        what_is_your_2_priority: _.what_is_your_2_priority === 'livelihood_support vocational_training' as any ? 'livelihood_support' : _.what_is_your_2_priority,
        what_is_your_3_priority: _.what_is_your_3_priority === 'livelihood_support vocational_training' as any ? 'livelihood_support' : _.what_is_your_3_priority,
      }
    })
  }, [data])

  const mostSelected = useMemo(() => {
    const byCategory = ChartHelper.single({
      data: fixedData.flatMap(_ => [_.what_is_your_1_priority, _.what_is_your_2_priority, _.what_is_your_3_priority]).filter(_ => _ !== 'unable_unwilling_to_answer' && _ !== 'none').compact()
    }).get()
    const sorted = Obj.entries(byCategory).sort(([a, av], [b, bv]) => bv.value - av.value).splice(0, 4).map(([label, value]) => ({label, value}))
    return {
      byCategory: sorted,
      total: seq(Obj.values(byCategory)).sum(_ => _.value)
    }
  }, [data])

  const table = useMemo(() => {
    const pn1 = ChartHelper.single({
      data: fixedData.map(_ => _.what_is_your_1_priority).filter(_ => _ !== 'unable_unwilling_to_answer').compact(),
    }).get()
    const pn2 = ChartHelper.single({
      data: fixedData.map(_ => _.what_is_your_2_priority).filter(_ => _ !== 'unable_unwilling_to_answer').compact(),
    }).get()
    const pn3 = ChartHelper.single({
      data: fixedData.map(_ => _.what_is_your_3_priority).filter(_ => _ !== 'unable_unwilling_to_answer').compact(),
    }).get()
    return Obj.keys(pn1).map(_ => ({
      need: _,
      need1: pn1[_]?.value ?? 0,
      need2: pn2[_]?.value ?? 0,
      need3: pn3[_]?.value ?? 0,
      totalNeed1: seq(Obj.values(pn1)).sum(_ => _.value),
      totalNeed2: seq(Obj.values(pn2)).sum(_ => _.value),
      totalNeed3: seq(Obj.values(pn3)).sum(_ => _.value),
    }))
  }, [fixedData])

  return (
    <Div column>
      <Div responsive>
        {mostSelected.byCategory.map(_ =>
          <Panel key={_.label} sx={{flex: 1, mb: 0}}>
            <PanelBody>
              <ChartPieWidget value={_.value.value} base={mostSelected.total} title={Protection_hhs3.options.what_is_your_1_priority[_.label]} showValue/>
            </PanelBody>
          </Panel>
        )}
      </Div>
      <Div>
        <Panel sx={{flex: 1}}>
          <Sheet
            id="prot-pm-dashboard-pn"
            data={table}
            columns={[
              {
                type: 'select_one',
                id: 'need',
                head: m.priorityNeeds,
                render: _ => <Txt bold>{Protection_hhs3.options.what_is_your_1_priority[_.need] ?? _.need}</Txt>,
                renderValue: _ => Protection_hhs3.options.what_is_your_1_priority[_.need] ?? _.need,
                renderOption: _ => Protection_hhs3.options.what_is_your_1_priority[_.need] ?? _.need,
              },
              {
                type: 'number',
                id: 'need1',
                head: m.firstPriorityNeed,
                render: _ => _.need1
              },
              {
                width: 0, type: 'number',
                id: 'need1_percent',
                head: '%',
                render: _ => <Txt bold color="primary">{toPercent(_.need1 / _.totalNeed1)}</Txt>,
                renderValue: _ => Math.round(_.need1 / _.totalNeed1 * 1000) / 10
              },
              {
                type: 'number',
                id: 'need2',
                head: m.secondPriorityNeed,
                render: _ => _.need2
              },
              {
                width: 0, type: 'number',
                id: 'need2_percent',
                head: '%',
                render: _ => <Txt bold color="primary">{toPercent(_.need2 / _.totalNeed2)}</Txt>,
                renderValue: _ => Math.round(_.need2 / _.totalNeed2 * 1000) / 10
              },
              {
                type: 'number',
                id: 'need3',
                head: m.thirdPriorityNeed,
                render: _ => _.need3
              },
              {
                width: 0, type: 'number',
                id: 'need3_percent',
                head: '%',
                render: _ => <Txt bold color="primary">{toPercent(_.need3 / _.totalNeed3)}</Txt>,
                renderValue: _ => Math.round(_.need3 / _.totalNeed3 * 1000) / 10
              },
            ]}
          />
        </Panel>
      </Div>
    </Div>
  )
}