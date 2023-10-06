import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {_Arr, Arr, Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {DashboardLayout} from '../shared/DashboardLayout'
import {DashboardFilterOptions} from '../shared/DashboardFilterOptions'
import {Box} from '@mui/material'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {makeKoboBarChartComponent} from '../shared/KoboBarChart'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DashboardFilterHelper} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Period} from '@/core/type'
import Link from 'next/link'
import {AAIconBtn} from '@/shared/IconBtn'
import {SafetyIncidentTracker} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTracker'
import {SafetyIncidentTrackerOptions} from '@/core/koboModel/SafetyIncidentTracker/SafetyIncidentTrackerOptions'
import {DashboardSafetyIncidentBody} from '@/features/Dashboard/DashboardSafetyIncidents/DashboardSafetyIncidentBody'
import {useDashboardSafetyIncident} from '@/features/Dashboard/DashboardSafetyIncidents/useDashboardSafetyIncident'
import {KoboSafetyIncidentHelper} from '@/core/sdk/server/kobo/custom/KoboSafetyIncidentTracker'

export interface DashboardSafetyIncidentsPageProps {
  filters: OptionFilters
  data: _Arr<KoboAnswer<KoboSafetyIncidentHelper.Type>>
  computed: NonNullable<ReturnType<typeof useDashboardSafetyIncident>>
}

export const SafetyIncidentsTrackerBarChart = makeKoboBarChartComponent<SafetyIncidentTracker, typeof SafetyIncidentTrackerOptions>({
  options: SafetyIncidentTrackerOptions
})


const filterShape = DashboardFilterHelper.makeShape<typeof SafetyIncidentTrackerOptions>()({
  oblast: {
    icon: 'location_on',
    options: 'oblast',
    label: m => m.oblast,
  },
})

type OptionFilters = DashboardFilterHelper.InferShape<typeof filterShape>

export const DashboardSafetyIncident = () => {
  const {api} = useAppSettings()
  const {m, formatLargeNumber, formatDateTime, formatDate} = useI18n()

  const _period = useFetcher(() => api.kobo.answer.getPeriod(kobo.drcUa.form.safety_incident))
  const [optionFilter, setOptionFilters] = useState<OptionFilters>(Arr(Enum.keys(filterShape)).reduceObject<OptionFilters>(_ => [_, []]))
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const _answers = useFetcher((filter: Partial<Period>) => api.kobo.answer.searchSafetyIncident({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => Arr(_.data)) as Promise<DashboardSafetyIncidentsPageProps['data']>)

  useEffect(() => {
    _period.fetch()
  }, [])
  useEffect(() => {
    map(_period.entity, setPeriodFilter)
  }, [_period.entity])

  useEffect(() => {
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const getChoices = <T extends keyof typeof SafetyIncidentTrackerOptions>(
    questionName: T, {
      skipKey = [],
      // renameOptions
    }: {
      skipKey?: (keyof typeof SafetyIncidentTrackerOptions[T])[]
      // renameOptions?: Record<keyof typeof ProtHHS_2_1Options[T], string>
    } = {}
  ) => {
    return Enum.entries(SafetyIncidentTrackerOptions[questionName] ?? {})
      .map(([value, label]) => ({value, label: label}))
      .filter(_ => !(skipKey as string[]).includes(_.value))
  }

  const data: DashboardSafetyIncidentsPageProps['data'] | undefined = useMemo(() => {
    return map(_answers.entity, _ => Arr(DashboardFilterHelper.filterData(_.get, filterShape, optionFilter)))
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
