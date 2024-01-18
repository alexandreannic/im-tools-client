import React, {useEffect, useMemo, useState} from 'react'
import {Enum, map, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useProtHhs2Data} from './useProtHhs2Data'
import {DashboardProtHHS2Sample} from './DashboardProtHHS2Sample'
import {DashboardLayout} from '../shared/DashboardLayout'
import {Protection_Hhs2_1Options} from '@/core/generatedKoboInterface/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {DashboardProtHHS2Document} from './DashboardProtHHS2Document'
import {DashboardProtHHS2Livelihood} from './DashboardProtHHS2Livelihood'
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
import {KoboIndex} from '@/KoboIndex'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Period, Person} from '@/core/type'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {enrichProtHHS_2_1, ProtHHS2Enrich} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import LokiDb from 'lokijs'
import {Messages} from '@/core/i18n/localization/en'
import {FilterLayout} from '@/features/Dashboard/helper/FilterLayout'
import {useFetcher} from '@/shared/hook/useFetcher'

type CustomFilterOptionFilters = {
  hhComposition?: (keyof Messages['protHHS2']['_hhComposition'])[]
}

export interface DashboardPageProps {
  periodFilter: Partial<Period>
  optionFilter: CustomFilterOptionFilters & DataFilter.Filter
  data: Seq<ProtHHS2Enrich>
  computed: NonNullable<ReturnType<typeof useProtHhs2Data>>
}

export const DashboardProtHHS2 = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const _period = useFetcher(() => api.kobo.answer.getPeriod(KoboIndex.byName('protection_hhs2_1').id))
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const _answers = useFetcher((filter?: Partial<Period>) => api.kobo.typedAnswers.searchProtection_Hhs2({
    filters: {
      start: filter?.start,
      end: filter?.end,
    }
  }).then(_ => seq(_.data).map(enrichProtHHS_2_1)) as Promise<Seq<ProtHHS2Enrich>>)

  useEffect(() => {
    _period.fetch()
    _answers.fetch()
  }, [])

  useEffect(() => {
    if (_period.get) setPeriodFilter(_period.get)
  }, [_period.get])

  useEffect(() => {
    if (periodFilter.start?.getTime() !== _period.get?.start.getTime() || periodFilter.end?.getTime() !== _period.get?.end.getTime())
      _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const getOption = (p: keyof ProtHHS2Enrich, option: keyof typeof Protection_Hhs2_1Options = p as any) => () => {
    return _answers.get
      ?.flatMap(_ => _[p] as any)
      .distinct(_ => _)
      .compact()
      .sortByString(_ => _, 'a-z')
      .map((_: any) => ({value: _, label: (Protection_Hhs2_1Options[option] as any)[_]}))
  }

  const filterShape = useMemo(() => {
    return DataFilter.makeShape<ProtHHS2Enrich>({
      staff_to_insert_their_DRC_office: {
        getValue: _ => _.staff_to_insert_their_DRC_office,
        icon: 'business',
        label: m.drcOffice,
        getOptions: getOption('staff_to_insert_their_DRC_office'),
      },
      where_are_you_current_living_oblast: {
        getValue: _ => _.where_are_you_current_living_oblast,
        getOptions: getOption('where_are_you_current_living_oblast', 'what_is_your_area_of_origin_oblast'),
        icon: 'location_on',
        label: m.currentOblast
      },
      what_is_your_area_of_origin_oblast: {
        getValue: _ => _.what_is_your_area_of_origin_oblast,
        getOptions: getOption('what_is_your_area_of_origin_oblast'),
        icon: 'explore',
        label: m.originOblast,
      },
      type_of_site: {
        getValue: _ => _.type_of_site,
        getOptions: getOption('type_of_site'),
        icon: 'location_city',
        label: m.typeOfSite
      },
      hh_sex_1: {
        getValue: _ => _.hh_sex_1,
        getOptions: getOption('hh_sex_1'),
        icon: 'female',
        label: m.respondent
      },
      do_you_identify_as_any_of_the_following: {
        getValue: _ => _.do_you_identify_as_any_of_the_following,
        getOptions: getOption('do_you_identify_as_any_of_the_following'),
        icon: 'directions_run',
        label: m.poc
      },
      what_is_the_type_of_your_household: {
        getValue: _ => _.what_is_the_type_of_your_household,
        getOptions: getOption('what_is_the_type_of_your_household'),
        icon: 'people',
        label: m.hhType,
      },
      do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household: {
        multiple: true,
        getValue: _ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household,
        getOptions: getOption('do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household'),
        icon: 'support',
        label: m.protHHS2.specificNeedsToHHS,
        skipOption: ['unable_unwilling_to_answer', 'other_specify']
      }
    })
  }, [_answers.get])

  const [optionFilter, setOptionFilters] = useState<DataFilter.InferShape<typeof filterShape> & CustomFilterOptionFilters>({})

  const database = useMemo(() => {
    if (!_answers.get) return
    const loki = new LokiDb(KoboIndex.byName('protection_hhs2_1').id, {
      persistenceMethod: 'memory',
    })
    const table = loki.addCollection('data', {
      indices: [
        'staff_to_insert_their_DRC_office',
        'where_are_you_current_living_oblast',
        'what_is_your_area_of_origin_oblast',
        'type_of_site',
        'hh_sex_1',
        'do_you_identify_as_any_of_the_following',
        'what_is_the_type_of_your_household',
        'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household',
      ]
    })
    _answers.get.forEach(_ => {
      table.insert({..._})
    })
    return table
  }, [_answers.get])

  const data: Seq<ProtHHS2Enrich> | undefined = useMemo(() => {
    return map(database, _ => {
      const {hhComposition, ...basicFilters} = optionFilter
      const filtered = seq(DataFilter.filterDataFromLokiJs(_ as any, filterShape, basicFilters as any)) as Seq<ProtHHS2Enrich>
      if (hhComposition && hhComposition.length > 0)
        return filtered.filter(d => !!d.persons.find(p => {
          if (!p.age) return false
          if (p.gender === Person.Gender.Female) {
            if (hhComposition.includes('girl') && p.age < 17) return true
            if (hhComposition.includes('olderFemale') && p.age > 60) return true
            if (hhComposition.includes('adultFemale')) return true
          }
          if (p.gender === Person.Gender.Male) {
            if (hhComposition.includes('boy') && p.age < 17) return true
            if (hhComposition.includes('olderMale') && p.age > 60) return true
            if (hhComposition.includes('adultMale')) return true
          }
          return false
        }))
      return filtered
    })
  }, [database, optionFilter])

  const computed = useProtHhs2Data({data: data})

  return (
    <DashboardLayout
      loading={_answers.loading}
      title={m.ukraine}
      subTitle={m.protectionMonitoringDashboard}
      header={
        <FilterLayout
          hidePopup
          sx={{mb: 0}}
          onClear={() => {
            setPeriodFilter({})
            setOptionFilters({})
          }}
          shape={filterShape}
          filters={optionFilter}
          setFilters={setOptionFilters}
          before={
            <DebouncedInput<[Date | undefined, Date | undefined]>
              debounce={800}
              value={[periodFilter.start, periodFilter.end]}
              onChange={([start, end]) => {
                setPeriodFilter(prev => ({...prev, start: start ?? undefined, end: end ?? undefined}))
              }}
            >
              {(value, onChange) => <PeriodPicker
                sx={{marginTop: '-6px'}}
                value={value}
                onChange={onChange}
                label={[m.start, m.endIncluded]}
                min={_period.get?.start}
                max={_period.get?.end}
              />}
            </DebouncedInput>
          }
          after={
            <DebouncedInput
              debounce={50}
              value={optionFilter.hhComposition}
              onChange={_ => setOptionFilters(prev => ({...prev, hhComposition: _}))}
            >
              {(value, onChange) =>
                <DashboardFilterOptions
                  icon="wc"
                  value={value ?? []}
                  label={m.protHHS2.hhComposition}
                  options={() => Enum.entries(m.protHHS2._hhComposition).map(([k, v]) => ({value: k, label: v}))}
                  onChange={onChange as any}
                />
              }
            </DebouncedInput>
          }
        />
      }
      beforeSection={
        <>
          <Alert type="info" deletable persistentDelete sx={{mb: '-20px', borderRadius: t => t.shape.borderRadius + 'px'}}>
            <Txt size="big" bold block sx={{lineHeight: 1, mb: .5}}>{m.protHHS2.descTitle}</Txt>
            <Txt block sx={{mb: .5}}>{m.protHHS2.desc}</Txt>
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
          {icon: 'savings', name: 'livelihood', title: m.livelihoods, component: () => <DashboardProtHHS2Livelihood {...panelProps}/>},
          {icon: 'fingerprint', name: 'document', title: m.protHHS2.registrationAndDocumention, component: () => <DashboardProtHHS2Document {...panelProps}/>},
          {icon: 'rocket_launch', name: 'safety', title: m.protHHS2.safetyAndSecurity, component: () => <DashboardProtHHS2Safety {...panelProps}/>},
          {icon: 'local_police', name: 'violence', title: m.protHHS2.protectionIncidents, component: () => <DashboardProtHHS2Violence {...panelProps}/>},
          {icon: 'healing', name: 'disability', title: m.protHHS2.disabilityAndHealth, component: () => <DashboardProtHHS2Disability {...panelProps}/>},
          {icon: 'traffic', name: 'priorityneeds', title: m.priorityNeeds, component: () => <DashboardProtHHS2PN {...panelProps}/>},
        ]
      })()}/>
  )
}
