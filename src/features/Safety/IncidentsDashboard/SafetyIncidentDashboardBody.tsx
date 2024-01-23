import React, {useState} from 'react'
import {Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {UaMapBy} from '../../DrcUaMap/UaMapBy'
import {Lazy} from '@/shared/Lazy'
import {format} from 'date-fns'
import {ChartLine} from '@/shared/chart/ChartLine'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {ChartPieWidgetBy} from '@/shared/chart/ChartPieWidgetBy'
import {useSession} from '@/core/Session/SessionContext'
import {DashboardSafetyIncidentsPageProps} from '@/features/Safety/IncidentsDashboard/SafetyIncidentDashboard'
import {MinusRusChartPanel} from '@/features/Safety/IncidentsDashboard/MinusRusChartPanel'
import {CommentsPanel, CommentsPanelProps} from '@/shared/CommentsPanel'
import {ChartBarMultipleBy} from '@/shared/chart/ChartBarMultipleBy'
import {SafetyIncidentTrackerOptions} from '@/core/generatedKoboInterface/SafetyIncidentTracker/SafetyIncidentTrackerOptions'

export const SafetyIncidentDashboardBody = ({
  data,
  computed,
}: {
  data: DashboardSafetyIncidentsPageProps['data']
  computed: DashboardSafetyIncidentsPageProps['computed']
}) => {
  const {m, formatLargeNumber} = useI18n()
  const [mapType, setMapType] = useState<'incident' | 'attack'>('incident')
  const {session} = useSession()
  return (
    <Div sx={{alignItems: 'flex-start'}}>
      <Div column>
        <Div sx={{alignItems: 'stretch'}}>
          <SlideWidget sx={{flex: 1}} icon="report" title={m.safety.incidents}>
            {formatLargeNumber(data.length)}
          </SlideWidget>
          <SlidePanel BodyProps={{sx: {p: '0px !important'}}} sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ChartPieWidgetBy
              title={m.safety.attacks}
              filter={_ => _.attack === 'yes'}
              showValue
              compare={{before: computed.lastMonth}}
              filterBase={_ => _.attack !== undefined}
              data={data}
            />
          </SlidePanel>
        </Div>
        <SlidePanel>
          <ScRadioGroup value={mapType} onChange={setMapType} dense inline sx={{mb: 2}}>
            <ScRadioGroupItem dense hideRadio value="incident" title={m.safety.incidents}/>
            <ScRadioGroupItem dense hideRadio value="attack" title={m.safety.attacks}/>
          </ScRadioGroup>
          {fnSwitch(mapType, {
            'incident': (
              <UaMapBy
                sx={{mx: 3}}
                fillBaseOn="value"
                data={data}
                getOblast={_ => _.oblastISO!}
                value={_ => true}
                base={_ => _.oblastISO !== undefined}
              />
            ),
            'attack': (
              <UaMapBy
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
        <SlidePanel title={m.safety.attackTypes}>
          <ChartBarMultipleBy
            data={data}
            by={_ => _.attack_type}
            label={SafetyIncidentTrackerOptions.attack_type}
          />
        </SlidePanel>
        <SlidePanel title={m.safety.target}>
          <ChartBarMultipleBy
            data={data}
            by={_ => _.what_destroyed}
            label={SafetyIncidentTrackerOptions.what_destroyed}
          />
        </SlidePanel>
        <SlidePanel title={m.safety.typeOfCasualties}>
          <ChartBarMultipleBy
            data={data}
            by={_ => _.type_casualties}
            label={SafetyIncidentTrackerOptions.type_casualties}
          />
        </SlidePanel>
      </Div>
      <Div column>
        <Div sx={{alignItems: 'stretch'}}>
          <Lazy deps={[data]} fn={() => data?.sum(_ => _.dead ?? 0)}>
            {_ => (
              <SlideWidget sx={{flex: 1}} title={m.safety.dead}>
                {formatLargeNumber(_)}
              </SlideWidget>
            )}
          </Lazy>
          <Lazy deps={[data]} fn={() => data?.sum(_ => _.injured ?? 0)}>
            {_ => (
              <SlideWidget sx={{flex: 1}} title={m.safety.injured}>
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
              .sort(([bk], [ak]) => bk.localeCompare(ak))
              .entries()
              .filter(([k]) => k !== 'no_date')
              .map(([k, v]) => ({name: k, ...v}))
          }}>
            {_ => (
              <ChartLine height={280} data={_ as any} translation={{
                total: m.safety.incidents,
                dead: m.safety.dead,
                injured: m.safety.injured,
              } as any}/>
            )}
          </Lazy>
        </SlidePanel>
        {(session?.admin || session?.drcJob === 'Head of Safety') && (
          <MinusRusChartPanel/>
        )}
        <SlidePanel title={m.safety.lastAttacks}>
          <Lazy deps={[data]} fn={() => data?.filter(_ => _.attack === 'yes').map(_ => ({
            id: _.id,
            title: m.safety.attackOfOn(_.oblastISO, _.attack_type),
            date: _.date_time,
            desc: _.Attack_details,
          }) as CommentsPanelProps['data'][0])}>
            {_ => <CommentsPanel pageSize={10} data={_}/>}
          </Lazy>
        </SlidePanel>
      </Div>
    </Div>
  )
}
