import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {Arr, Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {DashboardLayout} from '../shared/DashboardLayout'
import {DashboardFilterOptions} from '../shared/DashboardFilterOptions'
import {Box} from '@mui/material'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {makeKoboBarChartComponent} from '../shared/KoboBarChart'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {MealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoring'
import {MealVisitMonitoringOptions} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringOptions'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DashboardFilterHelper} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {ageGroup, Period} from '@/core/type'
import {KoboUkraineMap} from '../shared/KoboUkraineMap'
import {OblastISOSVG} from '@/shared/UkraineMap/ukraineSvgPath'
import Link from 'next/link'
import {AAIconBtn} from '@/shared/IconBtn'
import {SafetyIncidentTracker} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTracker'
import {KoboLineChartDate} from '@/features/Dashboard/shared/KoboLineChartDate'
import {Lazy} from '@/shared/Lazy'
import {SafetyIncidentTrackerOptions} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTrackerOptions'
import {ChartTools} from '@/core/chartTools'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {KoboLineChart} from '@/features/Dashboard/shared/KoboLineChart'
import {format} from 'date-fns'
import {ScLineChart2} from '@/shared/Chart/ScLineChart2'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'

export interface DashboardPageProps {
  filters: OptionFilters
  data: Arr<KoboAnswer<MealVisitMonitoring>>
}

export const SafetyIncidentsTrackerBarChart = makeKoboBarChartComponent<SafetyIncidentTracker, typeof SafetyIncidentTrackerOptions>({
  options: SafetyIncidentTrackerOptions
})


const mapOblast: Record<string, OblastISOSVG> = {
  aroc: 'UA43',//'UA01',
  cherkaska: 'UA71',
  chernihivska: 'UA74',
  chernivetska: 'UA77',// 'UA73',
  dnipropetrovska: 'UA12',
  donetska: 'UA14',
  'ivano-frankivska': 'UA26',
  kharkivska: 'UA63',
  khersonska: 'UA65',
  khmelnytska: 'UA68',
  kirovohradska: 'UA35',
  citykyiv: 'UA32',//'UA80',
  kyivska: 'UA32',
  luhanska: 'UA09',//'UA44',
  lvivska: 'UA46',
  mykolaivska: 'UA48',
  odeska: 'UA51',
  poltavska: 'UA53',
  rivnenska: 'UA56',
  sevastopilska: 'UA40',//'UA85',
  sumska: 'UA59',
  ternopilska: 'UA61',
  vinnytska: 'UA05',
  volynska: 'UA07',
  zakarpatska: 'UA21',
  zaporizka: 'UA23',
  zhytomyrska: 'UA18',
}

const filterShape = DashboardFilterHelper.makeShape<typeof MealVisitMonitoringOptions>()({
  oblast: {
    icon: 'location_on',
    options: 'mdro',
    label: m => m.oblast,
  },
})

type OptionFilters = DashboardFilterHelper.InferShape<typeof filterShape>

export const DashboardSafetyIncidentsTracker = () => {
  const {api} = useAppSettings()
  const {m, formatLargeNumber, formatDateTime, formatDate} = useI18n()

  const _period = useFetcher(() => api.kobo.answer.getPeriod(kobo.drcUa.form.safetyIncidentTracker))
  const [optionFilter, setOptionFilters] = useState<OptionFilters>(Arr(Enum.keys(filterShape)).reduceObject<OptionFilters>(_ => [_, []]))
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const [mapType, setMapType] = useState<'incident' | 'attack'>('incident')
  const _answers = useFetcher((filter: Partial<Period>) => api.kobo.answer.searchSafetyIncidentTracker({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => _.data) as Promise<KoboAnswer<SafetyIncidentTracker>[]>)

  useEffect(() => {
    _period.fetch()
  }, [])
  useEffect(() => {
    map(_period.entity, setPeriodFilter)
  }, [_period.entity])

  useEffect(() => {
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const getChoices = <T extends keyof typeof MealVisitMonitoringOptions>(
    questionName: T, {
      skipKey = [],
      // renameOptions
    }: {
      skipKey?: (keyof typeof MealVisitMonitoringOptions[T])[]
      // renameOptions?: Record<keyof typeof ProtHHS_2_1Options[T], string>
    } = {}
  ) => {
    return Enum.entries(MealVisitMonitoringOptions[questionName] ?? {})
      .map(([name, label]) => ({name, label: label}))
      .filter(_ => !(skipKey as string[]).includes(_.name))
  }

  const data = useMemo(() => {
    return map(_answers.entity, _ => Arr(DashboardFilterHelper.filterData(_, filterShape, optionFilter)))
  }, [_answers.entity, optionFilter])

  return (
    <DashboardLayout
      hideEuLogo
      pageWidth={1360}
      loading={_answers.loading}
      title={m.ukraine}
      subTitle={m._dashboardSafetyIncidentsTracker.title}
      action={
        <>
          <Link href="/">
            <AAIconBtn sx={{mr: 1}} children="home"/>
          </Link>
        </>
      }
      header={
        <Box sx={{
          pt: 1,
          pb: 1,
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          alignItems: 'center',
          '& > :not(:last-child)': {mr: 1}
        }}>
          <DebouncedInput<[Date | undefined, Date | undefined]>
            debounce={400}
            value={[periodFilter.start, periodFilter.end]}
            onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
          >
            {(value, onChange) => <PeriodPicker
              sx={{marginTop: '-6px'}}
              defaultValue={value ?? [undefined, undefined]}
              onChange={onChange}
              min={_period.entity?.start}
              max={_period.entity?.end}
            />}
          </DebouncedInput>
          {Enum.entries(filterShape).map(([k, shape]) =>
            <DashboardFilterOptions
              key={k}
              icon={shape.icon}
              value={optionFilter[k]}
              label={shape.label(m)}
              options={getChoices(shape.options)}
              onChange={_ => setOptionFilters(prev => ({...prev, [k]: _}))}
            />
          )}
        </Box>
      }
      // visualisation of the project, visit, overall rating, and then someone can click to expand comments and details
      beforeSection={
        data && (
          <>
            <Div sx={{alignItems: 'flex-start'}}>
              <Div column>
                <Div>
                  <SlideWidget sx={{flex: 1}} icon="report" title={m._dashboardSafetyIncidentsTracker.incidents}>
                    {formatLargeNumber(data.length)}
                  </SlideWidget>
                  <SlidePanel BodyProps={{sx: {p: '0px !important'}}} sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Lazy deps={[data]} fn={() => ChartTools.percentage({
                      data: data,
                      value: _ => _.attack === 'yes'
                    })}>
                      {_ => (
                        <PieChartIndicator value={_.value} base={_.base} title={m._dashboardSafetyIncidentsTracker.attacks}/>
                      )}
                    </Lazy>
                  </SlidePanel>
                </Div>
                <SlidePanel>
                  <ScRadioGroup value={mapType} onChange={setMapType} dense inline sx={{mb: 2}}>
                    <ScRadioGroupItem dense hideRadio value="incident" title={m._dashboardSafetyIncidentsTracker.incidents}/>
                    <ScRadioGroupItem dense hideRadio value="attack" title={m._dashboardSafetyIncidentsTracker.attacks}/>
                  </ScRadioGroup>
                  {fnSwitch(mapType, {
                    'incident': (
                      <KoboUkraineMap
                        sx={{mx: 3}}
                        fillBaseOn="value"
                        data={data}
                        getOblast={_ => mapOblast[_.oblast!]}
                        value={_ => true}
                        base={_ => _.oblast !== undefined}
                      />
                    ),
                    'attack': (
                      <KoboUkraineMap
                        sx={{mx: 3}}
                        fillBaseOn="value"
                        data={data}
                        getOblast={_ => mapOblast[_.oblast!]}
                        value={_ => _.attack === 'yes'}
                        base={_ => _.oblast !== undefined}
                      />
                    )
                  })}
                </SlidePanel>
                <SlidePanel title={m._dashboardSafetyIncidentsTracker.attackTypes}>
                  <SafetyIncidentsTrackerBarChart data={data} question="attack_type"/>
                </SlidePanel>
              </Div>
              <Div column>
                <Div>
                  <Lazy deps={[data]} fn={() => data?.sum(_ => _.dead ?? 0)}>
                    {_ => (
                      <SlideWidget sx={{flex: 1}} title={m._dashboardSafetyIncidentsTracker.dead}>
                        {formatLargeNumber(_)}
                      </SlideWidget>
                    )}
                  </Lazy>
                  <Lazy deps={[data]} fn={() => data?.sum(_ => _.injured ?? 0)}>
                    {_ => (
                      <SlideWidget sx={{flex: 1}} title={m._dashboardSafetyIncidentsTracker.injured}>
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
                      <ScLineChart2 height={300} data={_} translation={{
                        total: m._dashboardSafetyIncidentsTracker.incidents,
                        dead: m._dashboardSafetyIncidentsTracker.dead,
                        injured: m._dashboardSafetyIncidentsTracker.injured,
                      } as any}/>
                    )}
                  </Lazy>
                </SlidePanel>
                <SlidePanel title={m._dashboardSafetyIncidentsTracker.target}>
                  <SafetyIncidentsTrackerBarChart data={data} question="what_destroyed" questionType="multiple"/>
                </SlidePanel>
                <SlidePanel title={m._dashboardSafetyIncidentsTracker.typeOfCasualties}>
                  <SafetyIncidentsTrackerBarChart data={data} question="type_casualties"/>
                </SlidePanel>
              </Div>
            </Div>
          </>
        )
      }
    />
  )
}
