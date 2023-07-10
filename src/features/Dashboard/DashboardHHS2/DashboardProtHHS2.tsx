import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {_Arr, Arr, Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useProtHHS2Data} from './useProtHHS2Data'
import {DashboardProtHHS2Sample} from './DashboardProtHHS2Sample'
import {DashboardLayout} from '../shared/DashboardLayout'
import {ProtHHS_2_1Options} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {DashboardProtHHS2Document} from './DashboardProtHHS2Document'
import {DashboardProtHHS2Livelihood} from './DashboardProtHHS2Livelihood'
import {Box} from '@mui/material'
import {Alert, Txt} from 'mui-extension'
import {DashboardProtHHS2Housing} from './DashboardProtHHS2Housing'
import {DashboardProtHHS2Displacement} from './DashboardProtHHS2Displacement'
import {DashboardProtHHS2PN} from './DashboardProtHHS2PN'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {DashboardProtHHS2FamilyUnity} from './DashboardProtHHS2FamilyUnity'
import {DashboardProtHHS2Safety} from './DashboardProtHHS2Safety'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardProtHHS2Violence} from './DashboardProtHHS2Violence'
import {DashboardProtHHS2Disability} from '@/features/Dashboard/DashboardHHS2/DashboardProtHHS2Disability'
import {koboFormId} from '@/koboFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Period} from '@/core/type'
import {DashboardFilterHelper} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import LokiDb from 'lokijs'
import {endOfDay, startOfDay} from 'date-fns'

const filterShape = DashboardFilterHelper.makeShape<typeof ProtHHS_2_1Options>()({
  drcOffice: {
    icon: 'business',
    label: m => m.drcOffice,
    options: 'staff_to_insert_their_DRC_office',
  },
  currentOblast: {
    propertyIfDifferentThanOption: 'where_are_you_current_living_oblast',
    options: 'what_is_your_area_of_origin_oblast',
    icon: 'location_on',
    label: m => m.currentOblast
  },
  originOblast: {
    options: 'what_is_your_area_of_origin_oblast',
    icon: 'explore',
    label: m => m.originOblast
  },
  typeOfSite: {
    options: 'type_of_site',
    icon: 'location_city',
    label: m => m.typeOfSite
  },
  poc: {
    options: 'do_you_identify_as_any_of_the_following',
    icon: 'directions_run',
    label: m => m.poc
  },
  hhType: {
    options: 'what_is_the_type_of_your_household',
    icon: 'people',
    label: m => m.hhType,
  },
  specificNeeds: {
    options: 'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household',
    icon: 'support',
    label: m => m.specificNeeds,
    skipOption: ['unable_unwilling_to_answer', 'other_specify']
  }
})

type OptionFilters = DashboardFilterHelper.InferShape<typeof filterShape>

export interface DashboardPageProps {
  periodFilter: Partial<Period>
  optionFilter: OptionFilters
  data: _Arr<ProtHHS2Enrich>
  computed: NonNullable<ReturnType<typeof useProtHHS2Data>>
}

export enum Donor {
  'BHA_UKR000284' = 'BHA UKR-000284',
  'OKF_UKR000309' = 'OKF UKR-000309',
  'ECHO_UKR000322' = 'ECHO UKR-000322',
  'UHF_IV_UKR000314' = 'UHF IV UKR-000314',
  'NN2_UKR000298' = 'NN2 UKR-000298',
}

export const DashboardProtHHS2 = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const _period = useFetcher(() => api.kobo.answer.getPeriod(koboFormId.prod.protectionHh2))
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const [optionFilter, setOptionFilters] = useState<OptionFilters>(Arr(Enum.keys(filterShape)).reduceObject<OptionFilters>(_ => [_, []]))

  const request = (filter: Partial<Period>) => api.kobo.answer.searchProtHhs({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  })
    .then(_ => _.data.map(enrichProtHHS_2_1))

  const _answers = useFetcher(request)

  useEffect(() => {
    _period.fetch()
  }, [])

  useEffect(() => {
    if (_period.entity) setPeriodFilter(_period.entity)
  }, [_period.entity])

  useEffect(() => {
    if (periodFilter.start || periodFilter.end)
      _answers.fetch({force: true, clean: false}, {
        start: map(periodFilter.start, startOfDay),
        end: map(periodFilter.end, endOfDay),
      })
  }, [periodFilter])

  const getChoices = <T extends keyof typeof ProtHHS_2_1Options>(
    questionName: T, {
      skipKey = [],
      // renameOptions
    }: {
      skipKey?: (keyof typeof ProtHHS_2_1Options[T])[]
      // renameOptions?: Record<keyof typeof ProtHHS_2_1Options[T], string>
    } = {}
  ) => {
    return Enum.entries(ProtHHS_2_1Options[questionName] ?? {})
      .map(([name, label]) => ({name, label: label}))
      .filter(_ => !(skipKey as string[]).includes(_.name))
  }

  const database = useMemo(() => {
    if (!_answers.entity) return
    const loki = new LokiDb(koboFormId.prod.protectionHh2)
    const table = loki.addCollection('data', {
      indices: Enum.values(filterShape).map(_ => _.options)
    })
    _answers.entity.forEach(_ => {
      table.insert({..._})
    })
    return table
  }, [_answers.entity])

  const data: _Arr<ProtHHS2Enrich> | undefined = useMemo(() => {
    return map(database, _ => Arr(DashboardFilterHelper.filterDataFromLokiJs(_, filterShape, optionFilter)) as _Arr<ProtHHS2Enrich>)
  }, [database, optionFilter])

  // const choices = useMemo(() => {
  //   const res = {} as Record<keyof OptionFilters, {name: any, label: string}[]>
  //   Enum.entries(filterShape).forEach(([key, shape]) => {
  //     res[key] = data
  //       ? [...new Set(data.map(_ => _[shape.property]))].map(name => {
  //         return ({
  //           name,
  //           // @ts-ignore
  //           label: ProtHHS_2_1Options[shape.property][name]
  //         })
  //       })
  //       : []
  //   })
  //   return res
  // }, [data, optionFilter])

  const computed = useProtHHS2Data({data: data})

  return (
    <DashboardLayout
      loading={_answers.loading}
      title={m.ukraine}
      subTitle={m.protectionMonitoringDashboard}
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
            debounce={800}
            value={[periodFilter.start, periodFilter.end]}
            onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
          >
            {(value, onChange) => <PeriodPicker
              sx={{marginTop: '-6px'}}
              value={value ?? [undefined, undefined]}
              onChange={onChange}
              label={[m.start, m.endIncluded]}
              min={_period.entity?.start}
              max={_period.entity?.end}
            />}
          </DebouncedInput>
          {Enum.entries(filterShape).map(([k, shape]) =>
            <DebouncedInput<string[]>
              key={k}
              debounce={50}
              value={optionFilter[k]}
              onChange={_ => setOptionFilters(prev => ({...prev, [k]: _}))}
            >
              {(value, onChange) =>
                <DashboardFilterOptions
                  icon={shape.icon}
                  value={value ?? []}
                  label={shape.label(m)}
                  options={getChoices(shape.options, {skipKey: shape.skipOption as any})}
                  onChange={onChange}
                />
              }
            </DebouncedInput>
          )}
        </Box>
      }
      beforeSection={
        <>
          <Alert type="info" deletable persistentDelete sx={{mb: '-20px'}}>
            <Txt size="big" bold block>{m.protHHS2.descTitle}</Txt>
            <Txt block sx={{mb: 1}}>{m.protHHS2.desc}</Txt>
            {m.protHHS2.disclaimer}
          </Alert>
        </>
      }
      sections={(() => {
        if (!data || !computed) return []
        const panelProps: DashboardPageProps = data && computed && {
          periodFilter,
          optionFilter,
          data,
          computed,
        }
        return [
          {icon: 'bar_chart', name: 'sample', title: m.sample, component: () => <DashboardProtHHS2Sample {...panelProps}/>},
          {icon: 'explore', name: 'displacement', title: m.displacement, component: () => <DashboardProtHHS2Displacement {...panelProps}/>},
          {icon: 'family_restroom', name: 'family_unity', title: m.familyUnity, component: () => <DashboardProtHHS2FamilyUnity {...panelProps}/>},
          {icon: 'home', name: 'housing', title: m.housing, component: () => <DashboardProtHHS2Housing {...panelProps}/>},
          {icon: 'savings', name: 'livelihood', title: m.livelihood, component: () => <DashboardProtHHS2Livelihood {...panelProps}/>},
          {icon: 'fingerprint', name: 'document', title: m.protHHS2.registrationAndDocumention, component: () => <DashboardProtHHS2Document {...panelProps}/>},
          {icon: 'rocket_launch', name: 'safety', title: m.protHHS2.safetyAndSecurity, component: () => <DashboardProtHHS2Safety {...panelProps}/>},
          {icon: 'local_police', name: 'violence', title: m.protHHS2.protectionIncidents, component: () => <DashboardProtHHS2Violence {...panelProps}/>},
          {icon: 'healing', name: 'disability', title: m.protHHS2.disabilityAndHealth, component: () => <DashboardProtHHS2Disability {...panelProps}/>},
          {icon: 'traffic', name: 'priorityneeds', title: m.priorityNeeds, component: () => <DashboardProtHHS2PN {...panelProps}/>},
        ]
      })()}/>
  )
}
