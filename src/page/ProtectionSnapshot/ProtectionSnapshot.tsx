import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useApi} from '../../core/context/ApiContext'
import {UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Box, Icon} from '@mui/material'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {_Arr, Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {Oblast} from '../../shared/UkraineMap/oblastIndex'
import {useKoboContext} from '../../core/context/KoboContext'
import {KoboAnswerMetaData} from '../../core/sdk/kobo/KoboType'
import {Fender} from 'mui-extension'
import {ProtectionSnapshotBody, ProtectionSnapshotHeader, slidePadding, SlidePanel} from './ProtectionShapshotHeader'
import {ScLineChart} from '../../shared/Chart/Chart'
import {Pdf, Slide} from 'shared/PdfLayout/PdfLayout'
import {useI18n} from '../../core/i18n'
import {useProtectionSnapshotData} from './useProtectionSnapshotData'
import { format } from 'date-fns'

const padding = 4

type FactorsToReturn =
  'shelter_is_repaired'
  | 'improvement_in_security_situat'
  | 'increased_service_availability'
  | 'infrastructure__including_heat'
  | 'cessation_of_hostilities'
  | 'health_facilties_are_accessibl'
  | 'government_regains_territory_f'
  | 'other219'
  | 'education_facilities__schools_'

type T_12_7_1_Do_you_plan_to_return_to_your_ = 'yes21' | 'don_t21' | 'don_t_know21' | 'yes_but_no_clear_timeframe' | 'prefer_not_to_answer21'

const mapAnswers = (a: KoboAnswerMetaData & Record<string, string | undefined>) => {
  return {
    ...a,
    _8_What_is_your_household_size: map(a._8_What_is_your_household_size, _ => +_),
    _12_1_What_oblast_are_you_from_001: a._12_1_What_oblast_are_you_from_001,
    _4_What_oblast_are_you_from: a._4_What_oblast_are_you_from,
    _12_8_1_What_would_be_the_deciding_fac: (a._12_8_1_What_would_be_the_deciding_fac?.split(' ') as FactorsToReturn[] | undefined)
      ?.map(_ => _ === 'government_regains_territory_f' ? 'improvement_in_security_situat' : _),
    _12_7_1_Do_you_plan_to_return_to_your_: a._12_7_1_Do_you_plan_to_return_to_your_ as T_12_7_1_Do_you_plan_to_return_to_your_,
    _12_3_1_When_did_you_your_area_of_origin: a._12_3_1_When_did_you_your_area_of_origin,
  }
}

export type ProtectionHHAnswer = ReturnType<typeof mapAnswers>

interface FormFilters {
  _12_1_What_oblast_are_you_from_001: string[]
  _4_What_oblast_are_you_from: string[]
  _12_7_1_Do_you_plan_to_return_to_your_: string[]
}

export const ProtectionSnapshot = ({
  formId,
  period = [new Date(2023, 0, 1), new Date(2023, 2, 1)],
  previousPeriod = [new Date(2022, 10, 1), new Date(2023, 0, 1)],
}: {
  formId: UUID,
  period?: [Date, Date]
  previousPeriod?: [Date, Date]
}) => {
  const api = useApi()
  const _hh = useKoboContext().hh
  const _form = useFetcher(api.kobo.getForm)
  const [filters, setFilters] = useState<Partial<FormFilters>>({})

  const filteredValues = useMemo(() => {
    return _hh.entity?.data.filter(_ => {
      return Enum.keys(filters).every(k => {
        const filterValues = filters[k] ?? []
        // TODO handle multiple choices
        return filterValues.length === 0 || filterValues.includes(_[k]!)
      })
    }).map(mapAnswers)
  }, [_hh.entity, filters])

  useEffect(() => {
    _hh.fetch({}, {start: previousPeriod[0], end: period[1]})
  }, [])

  return (
    <>
      <div className="noprint">
        <button onClick={() => window.print()}>Download</button>
      </div>
      {JSON.stringify(filters)}
      {filteredValues ? (
        <_ProtectionSnapshot
          period={period}
          previousPeriod={previousPeriod}
          data={Arr(filteredValues)}
          filters={filters}
          onFilter={setFilters
          }/>
      ) : _hh.loading && (
        <Fender type="loading"/>
      )}
    </>
  )
}

export const _ProtectionSnapshot = ({
  data,
  period,
  previousPeriod,
  filters,
  onFilter
}: {
  data: _Arr<ProtectionHHAnswer>
  period: [Date, Date]
  previousPeriod: [Date, Date]
  filters: Partial<FormFilters>
  onFilter: Dispatch<SetStateAction<Partial<FormFilters>>>
}) => {
  const {m, formatLargeNumber} = useI18n()
  const transformed = useProtectionSnapshotData(data, {start: period[0], end: period[1]})

  const updateOblastFilters = (key: keyof typeof filters) => (oblast: Oblast) => {
    onFilter(f => {
      const value = f[key]
      if (value?.includes(oblast.koboKey)) {
        return {
          ...f,
          [key]: value?.filter(_ => _ !== oblast.koboKey)
        }
      }
      if (!value) {
        return {...f, [key]: [oblast.koboKey]}
      }
      return {
        ...f, [key]: [...value, oblast.koboKey]
      }
    })
  }

  const totalMembers = useMemo(() => data.sum(_ => _._8_What_is_your_household_size ?? 0), [data])
  // console.log('_12_7_1_planToReturn,', _12_7_1_planToReturn)
  // console.log('_12_3_1_dateDeparture', _12_3_1_dateDeparture)
  // console.log(new Set(data.map(_ => _._12_7_1_Do_you_plan_to_return_to_your_)))
  // console.log(_answers.entity?.data.map(_ => _['_12_1_What_oblast_are_you_from_001']))
  // console.log(oblastOrigins)
  return (
    <Pdf>
      <Slide>
        <ProtectionSnapshotHeader>{m.protectionHHSnapshot.title}: {m.protectionHHSnapshot.subTitle}</ProtectionSnapshotHeader>
        {format(period[0], 'LLLL yyyy')} - {format(period[0], 'LLLL yyyy')}
        <ProtectionSnapshotBody sx={{display: 'flex'}}>
          <Box>{m.protectionHHSnapshot.disclaimer}</Box>
          <SlidePanel>
            <Box>{formatLargeNumber(data.length)}</Box>
            <Box>{formatLargeNumber(totalMembers)}</Box>
            <Box>{(totalMembers / data.length).toFixed(1)}</Box>
          </SlidePanel>
        </ProtectionSnapshotBody>
      </Slide>
      <Slide>
        <ProtectionSnapshotHeader>Displacement</ProtectionSnapshotHeader>
        <ProtectionSnapshotBody sx={{display: 'flex'}}>
          <SlidePanel
            sx={{flex: 1, mr: slidePadding}}
            title={m.displacement}
          >
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <UkraineMap
                total={data.length}
                values={transformed.oblastOrigins}
                onSelect={updateOblastFilters('_12_1_What_oblast_are_you_from_001')}
                legend={m.origin}
                sx={{mb: 2, width: '100%'}}
              />
              <Box sx={{my: 1, alignSelf: 'center'}}>
                {mapFor(3, () => (
                  <Icon color="disabled" fontSize="large">arrow_downward</Icon>
                ))}
              </Box>
              <UkraineMap
                total={data.length}
                values={transformed.oblastCurrent}
                onSelect={updateOblastFilters('_4_What_oblast_are_you_from')}
                legend={m.current}
                sx={{width: '100%'}}
              />
            </Box>
          </SlidePanel>
          <Box sx={{flex: 2}}>
            <SlidePanel>
              {/*<ChartIndicator*/}
              {/*  percent*/}
              {/*  value={+transformed._12_7_1_planToReturn.toFixed(1)}*/}
              {/*  sx={{fontSize: '1.4rem'}}*/}
              {/*/>*/}
            </SlidePanel>
            <SlidePanel>
              <ScLineChart height={200} hideLabelToggle curves={[
                {label: m.departureFromAreaOfOrigin, key: 'dateOfDeparture', curve: transformed._12_3_1_dateDeparture},
              ]}/>
            </SlidePanel>
            <SlidePanel title={m.decidingFactorsToReturn}>
              <HorizontalBarChartGoogle barHeight={3} data={transformed._12_8_1_What_would_be_the_deciding_fac} base={data.length}/>
            </SlidePanel>
          </Box>
        </ProtectionSnapshotBody>
      </Slide>
    </Pdf>
  )
}
