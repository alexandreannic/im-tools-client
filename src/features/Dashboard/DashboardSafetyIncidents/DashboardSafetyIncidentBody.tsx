import React, {useState} from 'react'
import {Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {KoboUkraineMap} from '../shared/KoboUkraineMap'
import {Lazy} from '@/shared/Lazy'
import {format} from 'date-fns'
import {ScLineChart2} from '@/shared/Chart/ScLineChart2'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {CommentsPanel, CommentsPanelProps} from '@/features/Dashboard/DashboardMealMonitoring/CommentsPanel'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {DashboardSafetyIncidentsPageProps, SafetyIncidentsTrackerBarChart} from '@/features/Dashboard/DashboardSafetyIncidents/DashboardSafetyIncident'

export const DashboardSafetyIncidentBody = ({
  data,
  computed,
}: {
  data: DashboardSafetyIncidentsPageProps['data']
  computed: DashboardSafetyIncidentsPageProps['computed']
}) => {
  const {m, formatLargeNumber} = useI18n()
  const [mapType, setMapType] = useState<'incident' | 'attack'>('incident')

  return (
    <Div sx={{alignItems: 'flex-start'}}>
      <Div column>
        <Div>
          <SlideWidget sx={{flex: 1}} icon="report" title={m._dashboardSafetyIncident.incidents}>
            {formatLargeNumber(data.length)}
          </SlideWidget>
          <SlidePanel BodyProps={{sx: {p: '0px !important'}}} sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <KoboPieChartIndicator
              title={m._dashboardSafetyIncident.attacks}
              question="attack"
              filter={_ => _ === 'yes'}
              showValue
              compare={{before: computed.lastMonth}}
              filterBase={_ => _ !== undefined}
              data={data}
            />
          </SlidePanel>
        </Div>
        <SlidePanel>
          <ScRadioGroup value={mapType} onChange={setMapType} dense inline sx={{mb: 2}}>
            <ScRadioGroupItem dense hideRadio value="incident" title={m._dashboardSafetyIncident.incidents}/>
            <ScRadioGroupItem dense hideRadio value="attack" title={m._dashboardSafetyIncident.attacks}/>
          </ScRadioGroup>
          {fnSwitch(mapType, {
            'incident': (
              <KoboUkraineMap
                sx={{mx: 3}}
                fillBaseOn="value"
                data={data}
                getOblast={_ => _.oblastISO!}
                value={_ => true}
                base={_ => _.oblastISO !== undefined}
              />
            ),
            'attack': (
              <KoboUkraineMap
                sx={{mx: 3}}
                fillBaseOn="value"
                data={data}
                getOblast={_ => _.oblastISO}
                value={_ => _.attack === 'yes'}
                base={_ => _.oblastISO !== undefined}
              />
            )
          })}
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.attackTypes}>
          <SafetyIncidentsTrackerBarChart data={data} question="attack_type"/>
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.target}>
          <SafetyIncidentsTrackerBarChart data={data} question="what_destroyed" questionType="multiple"/>
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.typeOfCasualties}>
          <SafetyIncidentsTrackerBarChart data={data} question="type_casualties"/>
        </SlidePanel>
      </Div>
      <Div column>
        <Div>
          <Lazy deps={[data]} fn={() => data?.sum(_ => _.dead ?? 0)}>
            {_ => (
              <SlideWidget sx={{flex: 1}} title={m._dashboardSafetyIncident.dead}>
                {formatLargeNumber(_)}
              </SlideWidget>
            )}
          </Lazy>
          <Lazy deps={[data]} fn={() => data?.sum(_ => _.injured ?? 0)}>
            {_ => (
              <SlideWidget sx={{flex: 1}} title={m._dashboardSafetyIncident.injured}>
                {formatLargeNumber(_)}
              </SlideWidget>
            )}
          </Lazy>
        </Div>
        <SlidePanel>
          <Lazy deps={[data]} fn={() => {
            const x = data?.groupBy(_ => _.date_time ? format(_.date_time, 'yyyy-MM') : 'no_date')
            return new Enum(x)
              .transform((k, v) => [k, {
                total: v.length,
                dead: v.sum(_ => _.dead ?? 0),
                injured: v.sum(_ => _.injured ?? 0),
              }])
              .entries()
              .filter(([k]) => k !== 'no_date')
              .map(([k, v]) => ({name: k, ...v}))
          }}>
            {_ => (
              <ScLineChart2 height={300} data={_ as any} translation={{
                total: m._dashboardSafetyIncident.incidents,
                dead: m._dashboardSafetyIncident.dead,
                injured: m._dashboardSafetyIncident.injured,
              } as any}/>
            )}
          </Lazy>
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.lastAttacks}>
          <Lazy deps={[data]} fn={() => data?.filter(_ => _.attack === 'yes').map(_ => ({
            id: _.id,
            title: m._dashboardSafetyIncident.attackOfOn(_.oblastISO, _.attack_type),
            date: _.date_time,
            desc: _.Attack_details,
          }) as CommentsPanelProps['data'][0])}>
            {_ => <CommentsPanel data={_}/>}
          </Lazy>
        </SlidePanel>
      </Div>
    </Div>
  )
}