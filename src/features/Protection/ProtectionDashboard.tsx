import {useProtectionContext} from '@/features/Protection/Context/ProtectionContext'
import {Page} from '@/shared/Page'
import {Panel, PanelBody} from '@/shared/Panel'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import React from 'react'
import {today} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {Utils} from '@/utils/utils'
import {OblastName} from '@/shared/UkraineMap/oblastIndex'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Enum} from '@alexandreannic/ts-utils'
import {ChartBarSingleBy} from '@/shared/chart/ChartBarSingleBy'
import {AiViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {Div, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Protection_pss} from '@/core/generatedKoboInterface/Protection_pss'
import {format} from 'date-fns'
import {ChartLineBy} from '@/shared/chart/ChartLineBy'
import {ChartBarMultipleBy} from '@/shared/chart/ChartBarMultipleBy'

export const ProtectionDashboard = () => {
  const ctx = useProtectionContext()
  const {m, formatLargeNumber} = useI18n()
  if (!ctx.data) return
  const data = ctx.data
  return (
    <Page width="lg">
      <DataFilterLayout
        filters={ctx.filters.filters}
        shape={ctx.filters.shape}
        setFilters={ctx.filters.setFilters}
        onClear={() => {
          ctx.filters.setFilters({})
          ctx.filters.setPeriod({})
        }}
        before={
          <>
            <PeriodPicker
              defaultValue={[ctx.filters.period.start, ctx.filters.period.end]}
              onChange={([start, end]) => {
                ctx.filters.setPeriod(prev => ({...prev, start, end}))
              }}
              label={[m.start, m.endIncluded]}
              max={today}
            />
          </>
        }
      />
      <Div column>
        <Div>
          <Div column>
            <Div sx={{alignItems: 'stretch'}}>
              <SlideWidget sx={{flex: 1}} icon="group" title={m.submissions}>
                {formatLargeNumber(data.all.length)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                {formatLargeNumber(data.flatFiltered.length)}
              </SlideWidget>
            </Div>
            <Panel title={m.submissions}>
              <ChartLineBy
                sx={{mt: 1}}
                data={ctx.data.filtered}
                getX={_ => format(_.date, 'yyyy-MM')}
                getY={_ => 1}
                label={m.count}
              />
            </Panel>
            <Panel title={m.ageGroup}>
              <PanelBody>
                <AgeGroupTable tableId="protection-dashboard" persons={data.flatFiltered}/>
              </PanelBody>
            </Panel>
          </Div>
          <Div column>
            <Panel title={m.displacementStatus}>
              <PanelBody>
                {data.flatFiltered && (
                  <ChartBarSingleBy
                    data={data.flatFiltered}
                    by={_ => _.status}
                    label={Protection_pss.options.hh_char_hh_det_status}
                  />
                )}
              </PanelBody>
            </Panel>
            <Panel title={m.project}>
              <PanelBody>
                {data.flatFiltered && (
                  <ChartBarMultipleBy
                    data={data.flatFiltered}
                    by={_ => _.project!}
                  />
                )}
              </PanelBody>
            </Panel>
          </Div>
        </Div>
        <Lazy deps={[data.flatFiltered]} fn={() => {
          if (!data.flatFiltered) return
          const res: {
            oblast: OblastName
            raion: string
            hromada: string
            protection_gbv?: number
            protection_pss?: number
            protection_hhs2_1?: number
            protection_groupSession?: number
            data: {
              protection_gbv?: any[]
              protection_pss?: any[]
              protection_hhs2_1?: any[]
              protection_groupSession?: any[]
            }
          }[] = []
          Utils.groupBy({
            data: data.flatFiltered,
            groups: [
              {by: _ => _.oblast!},
              {by: _ => _.raion!},
              {by: _ => _.hromada!},
            ],
            finalTransform: (grouped, [
              oblast,
              raion,
              hromada
            ]) => {
              const countByForm = grouped.groupBy(_ => _.koboForm as string)
              res.push({
                oblast,
                raion,
                hromada,
                ...Enum.mapValues(countByForm, _ => _.length),
                data: countByForm,
              })
            }
          })
          return res
        }}>
          {res => (
            <Panel>
              <Sheet
                showExportBtn
                defaultLimit={500}
                id="protection-by-loc"
                data={res}
                columns={[
                  {type: 'select_one', id: 'oblast', head: 'oblast', renderExport: _ => _.oblast, render: _ => _.oblast, renderValue: _ => _.oblast},
                  {type: 'select_one', id: 'raion', head: 'raion', renderExport: _ => _.raion, render: _ => _.raion, renderValue: _ => _.raion},
                  {type: 'select_one', id: 'hromada', head: 'hromada', renderExport: _ => _.hromada, render: _ => _.hromada, renderValue: _ => _.hromada},
                  {type: 'number', id: 'protection_gbv', head: 'gbv', renderExport: _ => _.protection_gbv, render: _ => _.protection_gbv, renderValue: _ => _.protection_gbv},
                  {type: 'number', id: 'protection_pss', head: 'pss', renderExport: _ => _.protection_pss, render: _ => _.protection_pss, renderValue: _ => _.protection_pss},
                  {type: 'number', id: 'protection_hhs2_1', head: 'hhs', renderExport: _ => _.protection_hhs2_1, render: _ => _.protection_hhs2_1, renderValue: _ => _.protection_hhs2_1},
                  {type: 'number', id: 'protection_groupSession', head: 'groupSession', renderExport: _ => _.protection_groupSession, render: _ => _.protection_groupSession, renderValue: _ => _.protection_groupSession},
                  {
                    id: 'actions', head: '', width: 120, renderExport: false, render: _ => (
                      <>
                        <AiViewAnswers answers={_.data.protection_gbv ?? []}/>
                        <AiViewAnswers answers={_.data.protection_pss ?? []}/>
                        <AiViewAnswers answers={_.data.protection_hhs2_1 ?? []}/>
                        <AiViewAnswers answers={_.data.protection_groupSession ?? []}/>
                      </>
                    )
                  },
                ]}
              />
            </Panel>
          )}
        </Lazy>
      </Div>
    </Page>
  )
}