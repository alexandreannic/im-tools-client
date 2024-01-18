import React, {useEffect, useMemo, useState} from 'react'
import {map, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {KoboIndex} from '@/KoboIndex'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Period} from '@/core/type'
import {SafetyIncidentTracker} from '@/core/generatedKoboInterface/SafetyIncidentTracker/SafetyIncidentTracker'
import {SafetyIncidentTrackerOptions} from '@/core/generatedKoboInterface/SafetyIncidentTracker/SafetyIncidentTrackerOptions'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'
import {FilterLayout} from '@/features/Dashboard/helper/FilterLayout'
import {Page} from '@/shared/Page'
import {useSafetyIncidentDashboard} from '@/features/Safety/IncidentsDashboard/useSafetyIncidentDashboard'
import {SafetyIncidentDashboardBody} from '@/features/Safety/IncidentsDashboard/SafetyIncidentDashboardBody'
import {useFetcher} from '@/shared/hook/useFetcher'

export interface DashboardSafetyIncidentsPageProps {
  filters: DataFilter.Filter
  data: Seq<KoboAnswer<KoboSafetyIncidentHelper.Type>>
  computed: NonNullable<ReturnType<typeof useSafetyIncidentDashboard>>
}

// export const SafetyIncidentsTrackerBarChart = makeKoboBarChartComponent<SafetyIncidentTracker, typeof SafetyIncidentTrackerOptions>({
//   options: SafetyIncidentTrackerOptions
// })

export const SafetyIncidentDashboard = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const _period = useFetcher(() => api.kobo.answer.getPeriod(KoboIndex.byName('safety_incident').id))

  const filterShape = DataFilter.makeShape<KoboAnswer<SafetyIncidentTracker>>({
    oblast: {
      icon: 'location_on',
      getValue: _ => _.oblast,
      getOptions: () => DataFilter.buildOptionsFromObject(SafetyIncidentTrackerOptions.oblast),
      label: m.oblast,
    },
    attackType: {
      icon: 'rocket_launch',
      getValue: _ => _.attack_type,
      getOptions: () => DataFilter.buildOptionsFromObject(SafetyIncidentTrackerOptions.attack_type),
      label: m.safety.attackTypes,
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
    map(_period.get, setPeriodFilter)
  }, [_period.get])

  useEffect(() => {
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const data: DashboardSafetyIncidentsPageProps['data'] | undefined = useMemo(() => {
    return map(_answers.get, _ => seq(DataFilter.filterData(_, filterShape, optionFilter)))
  }, [_answers.get, optionFilter])

  const computed = useSafetyIncidentDashboard({data: _answers.get, period: periodFilter})

  return (
    <Page
      width="lg"
      loading={_answers.loading}
    >
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
              min={_period.get?.start}
              max={_period.get?.end}
            />}
          </DebouncedInput>
        }
      />
      {data && computed && (
        <>
          <SafetyIncidentDashboardBody data={data} computed={computed}/>
          {/*<DashboardSafetyIncidentAgravatingFactors data={data} computed={computed}/>*/}
        </>
      )}
    </Page>
  )
}
