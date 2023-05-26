import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../../core/context/ConfigContext'
import React, {useEffect, useMemo, useState} from 'react'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {_Arr, Arr, mapFor} from '@alexandreannic/ts-utils'
import {mapProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {useI18n} from '../../../core/i18n'
import {useProtHHS2Data} from './useProtHHS2Data'
import {DashboardProtHHS2Sample} from './DashboardProtHHS2Sample'
import {KoboAnswer2} from '../../../core/sdk/server/kobo/Kobo'
import {DashboardLayout} from '../DashboardLayout'
import {DashboardProtHHS2Needs} from './DashboardProtHHS2Needs'
import {koboFormId, koboServerId} from '../../../koboFormId'
import {DashboardProtHHS2Displacement} from './DashboardProtHHS2Displacement'
import {ChartTools} from '../../../core/chartTools'
import {chain, multipleFilters} from '../../../utils/utils'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {DashboardProtHHS2Document} from './DashboardProtHHS2Document'
import {DashboardProtHHS2Livelihood} from './DashboardProtHHS2Livelihood'
import {DashboardFilterOptions} from '../shared/DashboardFilterOptions'
import {Box} from '@mui/material'

export type ProtHHS2Enrich = ReturnType<typeof enrichProtHHS_2_1>

interface DashboardProtHHS2Filters {
  start: Date
  end: Date
  currentOblast: string[]
  originOblast: string[]
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
}

export const enrichProtHHS_2_1 = (a: KoboAnswer2<ProtHHS_2_1>) => {
  const maxHHNumber = 12
  const mapPerson = (a: ProtHHS_2_1) => {
    const fields = [
      ...mapFor(maxHHNumber, i => [
        `hh_age_${i}`,
        `hh_sex_${i}`,
        `does_${i}_lack_doc`,
      ]),
    ] as [keyof ProtHHS_2_1, keyof ProtHHS_2_1, keyof ProtHHS_2_1][]
    return Arr(fields)
      .map(([ageCol, sexCol, lackDocCol]) => {
        return ({
          age: isNaN(a[ageCol] as any) ? undefined : +a[ageCol]!,
          gender: a[sexCol] as NonNullable<ProtHHS_2_1['hh_sex_1']>,
          lackDoc: a[lackDocCol],
        }) as ProtHHS2Person
      }).filter(_ => _.age !== undefined || _.gender !== undefined)
  }

  return {
    ...a,
    persons: mapPerson(a),
  }
}

export const DashboardProtHHS2BarChart = <T extends keyof typeof ProtHHS_2_1Options>({
  question,
  data,
  sortBy,
  overrideLabel,
  questionType = 'single',
}: {
  questionType?: 'multiple' | 'single'
  sortBy?: keyof typeof ChartTools.sortBy
  data: _Arr<ProtHHS_2_1>,
  overrideLabel?: Record<keyof (typeof ProtHHS_2_1Options)[T], string>
  question: T
}) => {
  const res = useMemo(() => {
    return chain(ChartTools[questionType]({
      data: Arr(data).map(_ => (_ as any)[question]).compact() as any,
    }))
      .map(ChartTools.setLabel((ProtHHS_2_1Options as any)[question]))
      .map(ChartTools.sortBy.value)
      .get
  }, [data])
  return (
    <HorizontalBarChartGoogle data={res}/>
  )
}

export const DashboardProtHHS2 = () => {
  const {api} = useConfig()
  const {m} = useI18n()
  const [filter, setFilters] = useState<DashboardProtHHS2Filters>({
    start: new Date(2022, 0, 1),
    end: new Date(2022, 0, 1),
    currentOblast: [],
    originOblast: [],
  })

  const _form = useFetcher(() => api.koboApi.getForm(koboServerId.prod, koboFormId.prod.protectionHh2))
  const request = () => api.koboForm.getAnswers<ProtHHS_2_1>({
    formId: koboFormId.prod.protectionHh2,
    fnMap: mapProtHHS_2_1
  })
    .then(_ => _.data)
    .then(_ => _.map(enrichProtHHS_2_1)
    )
  const _answers = useFetcher(request)

  useEffect(() => {
    _form.fetch()
    _answers.fetch()
  }, [])

  const getChoices = (questionName: keyof ProtHHS2Enrich) => {
    if (_form.entity && _answers.entity) {
      const listName = _form.entity?.content.survey.find(_ => _.name === questionName)?.select_from_list_name
      if (listName)
        return _form.entity?.content.choices.filter(_ => _.list_name === listName)
          .map(_ => ({
            name: _.name,
            label: _.label[0]
          }))
    }
    return []
  }
  const data = useMemo(() => {
    if (_answers.entity) {
      return Arr(multipleFilters(_answers.entity, [
        filter?.currentOblast.length > 0 && (_ => filter.currentOblast.includes(_.where_are_you_current_living_oblast)),
        filter?.originOblast.length > 0 && (_ => filter.currentOblast.includes(_.what_is_your_area_of_origin_oblast)),
      ]))
    }
  }, [_answers.entity, filter])
  const computed = useProtHHS2Data({data})

  return (
    <DashboardLayout
      title={m.ukraine}
      subTitle={m.protectionMonitoringDashboard}
      header={
        <Box sx={{'& > :not(:last-child)': {mr: 1}}}>
          <DashboardFilterOptions
            value={filter.currentOblast}
            label={m.currentOblast}
            options={getChoices('where_are_you_current_living_oblast')}
            onChange={currentOblast => setFilters(prev => ({...prev, currentOblast}))}
          />
          <DashboardFilterOptions
            value={filter.originOblast}
            label={m.originOblast}
            options={getChoices('what_is_your_area_of_origin_oblast')}
            onChange={originOblast => setFilters(prev => ({...prev, originOblast}))}
          />
        </Box>
      }
      sections={(() => {
        if (!data || !computed) return []
        const panelProps: DashboardPageProps = data && computed && {
          filters: filter,
          data,
          computed,
        }
        return [
          {name: 'sample', title: m.sample, component: () => <DashboardProtHHS2Sample {...panelProps}/>},
          {name: 'displacement', title: m.displacement, component: () => <DashboardProtHHS2Displacement {...panelProps}/>},
          {name: 'specificNeeds', title: m.specificNeeds, component: () => <DashboardProtHHS2Needs {...panelProps}/>},
          {name: 'document', title: m.documentation, component: () => <DashboardProtHHS2Document {...panelProps}/>},
          {name: 'livelihood', title: m.livelihood, component: () => <DashboardProtHHS2Livelihood {...panelProps}/>},
        ]
      })()}/>
  )
}

