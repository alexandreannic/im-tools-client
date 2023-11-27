import React, {useState} from 'react'
import {Enum, fnSwitch, seq, Seq} from '@alexandreannic/ts-utils'
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
import {MinusRusData} from '@/features/Dashboard/DashboardSafetyIncidents/minusRusParser'
import {Txt} from 'mui-extension'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {Messages} from '@/core/i18n/localization/en'
import {Box} from '@mui/material'

const minusResKeys: Seq<keyof Messages['_dashboardSafetyIncident']['minusRusLabel']> = seq([
  'prisoners',
  'killed',
  'aircraft',
  'armored_combat_vehicles',
  'artillery',
  'helicopters',
  'wounded',
  'ships_boats',
  'tanks',
])

export const DashboardSafetyIncidentBody = ({
  data,
  minusRus,
  computed,
}: {
  minusRus?: Seq<MinusRusData>
  data: DashboardSafetyIncidentsPageProps['data']
  computed: DashboardSafetyIncidentsPageProps['computed']
}) => {
  const {m, formatLargeNumber} = useI18n()
  const [mapType, setMapType] = useState<'incident' | 'attack'>('incident')
  const [minusRusDate, setMinusRusDate] = useState<string>('yyyy-MM-dd')
  const [minusRusCurveType, setMinusRusCurveType] = useState<'relative' | 'cumulative'>('relative')
  const [minusRusCurves, setMinusRusCurves] = useState<{
    prisoners: boolean
    killed: boolean
    aircraft: boolean
    armored_combat_vehicles: boolean
    artillery: boolean
    helicopters: boolean
    wounded: boolean
    ships_boats: boolean
    tanks: boolean
  }>({
    prisoners: false,
    killed: true,
    aircraft: false,
    armored_combat_vehicles: false,
    artillery: false,
    helicopters: false,
    wounded: false,
    ships_boats: false,
    tanks: false,
  })

  return (
    <Div sx={{alignItems: 'flex-start'}}>
      <Div column>
        <Div sx={{alignItems: 'stretch'}}>
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
          <SafetyIncidentsTrackerBarChart data={data} question="attack_type" questionType="multiple"/>
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.target}>
          <SafetyIncidentsTrackerBarChart data={data} question="what_destroyed" questionType="multiple"/>
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.typeOfCasualties}>
          <SafetyIncidentsTrackerBarChart data={data} question="type_casualties"/>
        </SlidePanel>
      </Div>
      <Div column>
        <Div sx={{alignItems: 'stretch'}}>
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
              <ScLineChart2 height={280} data={_ as any} translation={{
                total: m._dashboardSafetyIncident.incidents,
                dead: m._dashboardSafetyIncident.dead,
                injured: m._dashboardSafetyIncident.injured,
              } as any}/>
            )}
          </Lazy>
        </SlidePanel>
        <SlidePanel title={m._dashboardSafetyIncident.minusRusTitle}>
          <Txt block dangerouslySetInnerHTML={{__html: m._dashboardSafetyIncident.dataTakenFromMinusRus}}/>
          <Box sx={{my: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <ScRadioGroup inline dense value={minusRusCurveType} onChange={setMinusRusCurveType}>
              <ScRadioGroupItem hideRadio value="relative">{m.relative}</ScRadioGroupItem>
              <ScRadioGroupItem hideRadio value="cumulative">{m.cumulative}</ScRadioGroupItem>
            </ScRadioGroup>
            <ScRadioGroup inline dense value={minusRusDate} onChange={setMinusRusDate}>
              <ScRadioGroupItem hideRadio value="yyyy-MM-dd">{m.daily}</ScRadioGroupItem>
              <ScRadioGroupItem hideRadio value="yyyy-MM">{m.monthly}</ScRadioGroupItem>
            </ScRadioGroup>
            <AaSelectMultiple
              sx={{width: 200}}
              options={minusResKeys.map(_ => ({value: _, children: m._dashboardSafetyIncident.minusRusLabel[_]}))}
              value={minusResKeys.filter(_ => minusRusCurves[_])}
              onChange={e => {
                setMinusRusCurves(prev => {
                  Enum.keys(prev).forEach(_ => {
                    if (e.includes(_)) prev[_] = true
                    else prev[_] = false
                  })
                  return {...prev}
                })
              }}
            />
          </Box>

          <Lazy deps={[minusRus, minusRusDate, minusRusCurveType, minusRusCurves]} fn={() => {
            if (!minusRus) return []
            const gb = minusRus?.sortByNumber(_ => _.date.getTime()).groupBy(_ => format(_.date, minusRusDate))
            const res = new Enum(gb).entries().map(([k, v]) => {
              return {
                name: k,
                ...Enum.entries(minusRusCurves).filter(([k, v]) => v).reduce((acc, [k]) => ({
                  ...acc,
                  [k]: v.sum(_ => _[k])
                }), {}),
              }
            })
            if (minusRusCurveType === 'cumulative') return res
            return res.filter((_, i) => i > 0).map((_, i) => ({
              ...Enum.entries(minusRusCurves).filter(([k, v]) => v).reduce((acc, [k]) => ({
                ...acc,
                // @ts-ignore
                [k]: _[k] - res[i][k]
              }), {}),
            }))
          }}>
            {_ => (
              <ScLineChart2 hideLabelToggle height={280} data={_ as any} translation={m._dashboardSafetyIncident.minusRusLabel}/>
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
            {_ => <CommentsPanel pageSize={10} data={_}/>}
          </Lazy>
        </SlidePanel>
      </Div>
    </Div>
  )
}
