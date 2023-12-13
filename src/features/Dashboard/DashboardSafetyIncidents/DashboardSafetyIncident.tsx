import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {map, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {DashboardLayout} from '../shared/DashboardLayout'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {makeKoboBarChartComponent} from '../shared/KoboBarChart'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {KoboIndex} from '@/KoboIndex'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Period} from '@/core/type'
import Link from 'next/link'
import {AAIconBtn} from '@/shared/IconBtn'
import {SafetyIncidentTracker} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTracker'
import {SafetyIncidentTrackerOptions} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTrackerOptions'
import {DashboardSafetyIncidentBody} from '@/features/Dashboard/DashboardSafetyIncidents/DashboardSafetyIncidentBody'
import {useDashboardSafetyIncident} from '@/features/Dashboard/DashboardSafetyIncidents/useDashboardSafetyIncident'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {FilterLayout} from '@/features/Dashboard/helper/FilterLayout'

export interface DashboardSafetyIncidentsPageProps {
  filters: DataFilter.Filter
  data: Seq<KoboAnswer<KoboSafetyIncidentHelper.Type>>
  computed: NonNullable<ReturnType<typeof useDashboardSafetyIncident>>
}

export const SafetyIncidentsTrackerBarChart = makeKoboBarChartComponent<SafetyIncidentTracker, typeof SafetyIncidentTrackerOptions>({
  options: SafetyIncidentTrackerOptions
})


export const DashboardSafetyIncident = () => {
  const {api} = useAppSettings()
  const {m, formatLargeNumber, formatDateTime, formatDate} = useI18n()
  const _period = useFetcher(() => api.kobo.answer.getPeriod(KoboIndex.byName('safety_incident').id))

  const filterShape = DataFilter.makeShape<KoboAnswer<SafetyIncidentTracker>>({
    oblast: {
      icon: 'location_on',
      getValue: _ => _.oblast,
      getOptions: DataFilter.buildOptionsFromObject(SafetyIncidentTrackerOptions.oblast),
      label: m.oblast,
    },
    attackType: {
      icon: 'rocket_launch',
      getValue: _ => _.attack_type,
      getOptions: DataFilter.buildOptionsFromObject(SafetyIncidentTrackerOptions.attack_type),
      label: m._dashboardSafetyIncident.attackTypes,
      multiple: true,
    }
  })

  const [optionFilter, setOptionFilters] = useState<DataFilter.InferShape<typeof filterShape>>({})
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const _answers = useFetcher((filter: Partial<Period>) => api.kobo.typedAnswers.searchSafetyIncident({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => seq(_.data)) as Promise<DashboardSafetyIncidentsPageProps['data']>)

  useEffect(() => {
    _period.fetch()
  }, [])

  useEffect(() => {
    map(_period.entity, setPeriodFilter)
  }, [_period.entity])

  useEffect(() => {
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const data: DashboardSafetyIncidentsPageProps['data'] | undefined = useMemo(() => {
    return map(_answers.entity, _ => seq(DataFilter.filterData(_, filterShape, optionFilter)))
  }, [_answers.entity, optionFilter])

  const computed = useDashboardSafetyIncident({data: _answers.entity, period: periodFilter})

  return (
    <DashboardLayout
      hideEuLogo
      pageWidth={1360}
      loading={_answers.loading}
      title={m.ukraine}
      subTitle={m._dashboardSafetyIncident.title}
      action={
        <>
          <Link href="/">
            <AAIconBtn sx={{mr: 1}} children="home"/>
          </Link>
        </>
      }
      header={
        <FilterLayout
          shape={filterShape}
          filters={optionFilter}
          setFilters={setOptionFilters}
          before={
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
          }/>
      }
      beforeSection={
        data && computed && (
          <>
            <DashboardSafetyIncidentBody data={data} computed={computed}/>
            {/*<DashboardSafetyIncidentAgravatingFactors data={data} computed={computed}/>*/}
          </>
        )
      }
    />
  )
}
