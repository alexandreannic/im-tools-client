import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {ProtHHS_2_1} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {Arr, Enum, mapFor} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useProtHHS2Data} from './useProtHHS2Data'
import {DashboardProtHHS2Sample} from './DashboardProtHHS2Sample'
import {KoboAnswer2} from '@/core/sdk/server/kobo/Kobo'
import {DashboardLayout} from '../DashboardLayout'
import {multipleFilters} from '@/utils/utils'
import {ProtHHS_2_1Options} from '@/core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {DashboardProtHHS2Document} from './DashboardProtHHS2Document'
import {DashboardProtHHS2Livelihood} from './DashboardProtHHS2Livelihood'
import {DashboardFilterOptions} from '../shared/DashboardFilterOptions'
import {Box} from '@mui/material'
import {Alert, Txt} from 'mui-extension'
import {DashboardProtHHS2Housing} from './DashboardProtHHS2Housing'
import {DashboardProtHHS2Displacement} from './DashboardProtHHS2Displacement'
import {DashboardProtHHS2PN} from './DashboardProtHHS2PN'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {intersection} from 'lodash'
import {makeKoboBarChartComponent} from '../shared/KoboBarChart'
import {DashboardProtHHS2FamilyUnity} from './DashboardProtHHS2FamilyUnity'
import {DashboardProtHHS2Safety} from './DashboardProtHHS2Safety'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardProtHHS2Violence} from './DashboardProtHHS2Violence'
import {DashboardProtHHS2Disability} from '@/features/Dashboard/DashboardHHS2/DashboardProtHHS2Disability'
import {koboFormId} from '@/koboFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {getProtHhsIptData} from '@/utils/getIptData'

export type ProtHHS2Enrich = ReturnType<typeof enrichProtHHS_2_1>

interface DashboardProtHHS2Filters {
  start?: Date
  end?: Date
  currentOblast: string[]
  originOblast: string[]
  hhType: string[]
  poc: string[]
  typeOfSite: string[]
  specificNeeds: string[]
}

export interface DashboardPageProps {
  filters: DashboardProtHHS2Filters
  data: Arr<ProtHHS2Enrich>
  computed: NonNullable<ReturnType<typeof useProtHHS2Data>>
}

export interface ProtHHS2Person {
  age: ProtHHS_2_1['hh_age_1']
  gender: ProtHHS_2_1['hh_sex_1']
  lackDoc: ProtHHS_2_1['does_1_lack_doc']
  isIdpRegistered: ProtHHS_2_1['is_member_1_registered']
}

export const enrichProtHHS_2_1 = (a: KoboAnswer2<ProtHHS_2_1>) => {
  const maxHHNumber = 12
  const mapPerson = (a: ProtHHS_2_1) => {
    const fields = [
      ...mapFor(maxHHNumber, i => [
        `hh_age_${i}`,
        `hh_sex_${i}`,
        `does_${i}_lack_doc`,
        `is_member_${i}_registered`,
      ]),
    ] as [keyof ProtHHS_2_1, keyof ProtHHS_2_1, keyof ProtHHS_2_1, keyof ProtHHS_2_1][]
    return Arr(fields)
      .map(([ageCol, sexCol, lackDocCol, isIdpRegisteredCol]) => {
        return ({
          age: isNaN(a[ageCol] as any) ? undefined : +a[ageCol]!,
          gender: a[sexCol] as NonNullable<ProtHHS_2_1['hh_sex_1']>,
          lackDoc: a[lackDocCol],
          isIdpRegistered: a[isIdpRegisteredCol],
        }) as ProtHHS2Person
      }).filter(_ => _.age !== undefined || _.gender !== undefined)
  }

  return {
    ...a,
    persons: mapPerson(a),
  }
}

export const ProtHHS2BarChart = makeKoboBarChartComponent<ProtHHS_2_1, typeof ProtHHS_2_1Options>({
  options: ProtHHS_2_1Options
})

export const DashboardProtHHS2 = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const [filter, setFilters] = useState<DashboardProtHHS2Filters>({
    // start: new Date(2023, 5, 1),
    // end: new Date(2023, 6, 1),
    currentOblast: [],
    originOblast: [],
    hhType: [],
    poc: [],
    specificNeeds: [],
    typeOfSite: [],
  })
  const request = (filter: DashboardProtHHS2Filters) => api.kobo.answer.searchProtHhs({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  })
    .then(_ => _.data)
    .then(_ => _.filter(_ => {
      return (!filter.start || _.end.getTime() > filter.start.getTime())
        && (!filter.end || _.end.getTime() < filter.end.getTime())
    }))
    .then(_ => _.map(enrichProtHHS_2_1))

  const _answers = useFetcher(request)
  const _period = useFetcher(() => api.kobo.answer.getPeriod(koboFormId.prod.protectionHh2))

  useEffect(() => {
    _period.fetch()
  }, [])

  useEffect(() => {
    if (_period.entity) setFilters(prev => ({...prev, ..._period.entity}))
  }, [_period.entity])

  useEffect(() => {
    _answers.fetch({force: true, clean: false}, filter)
  }, [filter])

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

  const data = useMemo(() => {
    if (_answers.entity) {
      return Arr(multipleFilters(_answers.entity, [
        filter?.currentOblast.length > 0 && (_ => filter.currentOblast.includes(_.where_are_you_current_living_oblast)),
        filter?.originOblast.length > 0 && (_ => filter.originOblast.includes(_.what_is_your_area_of_origin_oblast)),
        filter?.hhType.length > 0 && (_ => filter.hhType.includes(_.what_is_the_type_of_your_household)),
        filter?.poc.length > 0 && (_ => filter.poc.includes(_.do_you_identify_as_any_of_the_following)),
        filter?.typeOfSite.length > 0 && (_ => filter.typeOfSite.includes(_.type_of_site)),
        filter?.specificNeeds.length > 0 && (_ => intersection(filter.specificNeeds, _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household).length > 0),
      ]))
    }
  }, [_answers.entity, filter])
  const computed = useProtHHS2Data({data})

  console.log('getProtHhsIptData', getProtHhsIptData(computed))

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
            debounce={400}
            value={[filter.start, filter.end]}
            onChange={([start, end]) => setFilters(prev => ({...prev, start, end}))}
          >
            {(value, onChange) => <PeriodPicker
              sx={{marginTop: '-6px'}}
              value={value ?? [undefined, undefined]}
              onChange={onChange}
              min={_period.entity?.start}
              max={_period.entity?.end}
            />}
          </DebouncedInput>
          <DashboardFilterOptions
            icon="location_on"
            value={filter.currentOblast}
            label={m.currentOblast}
            options={getChoices('what_is_your_area_of_origin_oblast')}
            onChange={currentOblast => setFilters(prev => ({...prev, currentOblast}))}
          />
          <DashboardFilterOptions
            value={filter.originOblast}
            label={m.originOblast}
            options={getChoices('what_is_your_area_of_origin_oblast')}
            icon="explore"
            onChange={originOblast => setFilters(prev => ({...prev, originOblast}))}
          />
          <DashboardFilterOptions
            value={filter.typeOfSite}
            label={m.typeOfSite}
            options={getChoices('type_of_site').map(_ => ({..._, label: _.label.split('(')[0]}))}
            icon="location_city"
            onChange={typeOfSite => setFilters(prev => ({...prev, typeOfSite}))}
          />
          <DashboardFilterOptions
            value={filter.poc}
            label={m.poc}
            options={getChoices('do_you_identify_as_any_of_the_following')}
            icon="directions_run"
            onChange={poc => setFilters(prev => ({...prev, poc}))}
          />
          <DashboardFilterOptions
            value={filter.hhType}
            label={m.hhType}
            options={getChoices('what_is_the_type_of_your_household')}
            icon="people"
            onChange={hhType => setFilters(prev => ({...prev, hhType}))}
          />
          <DashboardFilterOptions
            value={filter.specificNeeds}
            label={m.specificNeeds}
            options={getChoices('do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household', {skipKey: ['unable_unwilling_to_answer', 'other_specify']})}
            icon="support"
            onChange={specificNeeds => setFilters(prev => ({...prev, specificNeeds}))}
          />
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
          filters: filter,
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
