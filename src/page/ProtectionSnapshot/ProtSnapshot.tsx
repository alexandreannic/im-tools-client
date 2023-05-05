import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {Period, UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Box, useTheme} from '@mui/material'
import {_Arr, Arr, Enum, map} from '@alexandreannic/ts-utils'
import {Fender} from 'mui-extension'
import {Pdf} from 'shared/PdfLayout/PdfLayout'
import {UseProtectionSnapshotData, useProtectionSnapshotData} from './useProtectionSnapshotData'
import {KoboFormProtHH} from '../../core/koboModel/koboFormProtHH'
import {ProtSnapshotDocument} from './ProtSnapshotDocument'
import {ProtSnapshotSafety} from './ProtSnapshotSafety'
import {OblastISOSVG} from '../../shared/UkraineMap/ukraineSvgPath'
import {ProtSnapshotNeeds} from './ProtSnapshotNeeds'
import {ProtSnapshotDisplacement} from './ProtSnapshotDisplacement'
import {ProtSnapshotSample} from './ProtSnapshotSample'
import {initGoogleMaps} from './initGoogleMaps'
import {ProtSnapshotFilters} from './ProtSnapshotFilters'
import {ProtSnapshotLivelihood} from './ProtSnapshotLivelihood'
import Answer = KoboFormProtHH.Answer

export interface ProtSSData {
  data: _Arr<Answer>
  computed: UseProtectionSnapshotData
}

export interface ProtSnapshotSlideProps {
  current: ProtSSData
  previous: ProtSSData
  filters: Partial<ProtSnapshotFilter>
  onFilter: Dispatch<SetStateAction<Partial<ProtSnapshotFilter>>>
  customFilters: ProtSnapshotCustomFilters
  onCustomFilters: Dispatch<SetStateAction<ProtSnapshotCustomFilters>>
  onFilterOblast: (key: '_12_1_What_oblast_are_you_from_001_iso' | '_4_What_oblast_are_you_from_iso') => (oblast: OblastISOSVG) => void
}

export type ProtSnapshotCustomFilters = {
  hohh60?: boolean
  hohhFemale?: boolean
  start: Date
  end: Date
  previousPeriodStart: Date
  previousPeriodEnd: Date
}

export type ProtSnapshotFilter = {
  _12_Do_you_identify_as_any_of: NonNullable<Answer['_12_Do_you_identify_as_any_of']>[]
  _12_1_What_oblast_are_you_from_001_iso: NonNullable<Answer['_12_1_What_oblast_are_you_from_001_iso']>[]
  _4_What_oblast_are_you_from_iso: NonNullable<Answer['_4_What_oblast_are_you_from_iso']>[]
  _12_7_1_Do_you_plan_to_return_to_your_: NonNullable<Answer['_12_7_1_Do_you_plan_to_return_to_your_']>[]
  _40_1_What_is_your_first_priorty: NonNullable<Answer['_40_1_What_is_your_first_priorty']>[]
  C_Vulnerability_catergories_that: Answer['C_Vulnerability_catergories_that']
}

export const protSnapshotInitialFilters = {
  start: new Date(2023, 0, 1),
  end: new Date(2023, 3, 1),
  previousPeriodStart: new Date(2022, 9, 1),
  previousPeriodEnd: new Date(2023, 0, 1)
}

export const ProtSnapshot = ({
  formId,
  // period = {start: new Date(2023, 0, 1), end: new Date()},
  // period = {start: new Date(2023, 0, 4), end: new Date(2023, 0, 5)},
  // period = {start: new Date(2023, 0, 1), end: new Date(2023, 3, 1)},
  // previousPeriod = {start: new Date(2022, 9, 1), end: new Date(2023, 0, 1)},
}: {
  formId: UUID,
  // period?: Period
  // previousPeriod?: Period
}) => {
  const {api} = useConfig()
  const fetch = (period: Period) => api.koboApi.getAnswersFromLocalForm({
    formId,
    filters: period,
    fnMap: KoboFormProtHH.mapAnswers
  }).then(_ => Arr(_.data))
  const _hhCurrent = useFetcher(fetch)
  const _hhPrevious = useFetcher(fetch)
  const [filters, setFilters] = useState<Partial<ProtSnapshotFilter>>({})
  const [customFilters, setCustomFilters] = useState<ProtSnapshotCustomFilters>(protSnapshotInitialFilters)

  const filterValues = (data: Answer[]): _Arr<Answer> => {
    return Arr(data).filter(row => {
      const filtered = Enum.keys(filters).every(filterProperty => {
        const filterValues = filters[filterProperty] ?? []
        return filterValues.length === 0
          || !!map(row[filterProperty], rowValue => [rowValue].flat().find(a => (filterValues as any).find((b: any) => a === b)))
      })
      if (!filtered) return false
      return Enum.entries({
        hohh60: (value: ProtSnapshotCustomFilters['hohh60']) => !value || KoboFormProtHH.filterByHoHH60(row),
        hohhFemale: (value: ProtSnapshotCustomFilters['hohhFemale']) => !value || KoboFormProtHH.filterByHoHHFemale(row),
      }).every(([k, condition]) => {
        if (customFilters[k] === undefined) return true
        return condition(customFilters[k])
      })
    })
  }

  useEffect(() => {
    _hhCurrent.fetch({}, {
      start: customFilters.start,
      end: customFilters.end,
    })
  }, [
    customFilters.start,
    customFilters.end,
  ])

  useEffect(() => {
    _hhPrevious.fetch({}, {
      start: customFilters.previousPeriodStart,
      end: customFilters.previousPeriodEnd,
    })
  }, [
    customFilters.previousPeriodStart,
    customFilters.previousPeriodEnd,
  ])

  const currentFilteredData = useMemo(() => {
    return map(_hhCurrent.entity, filterValues)
  }, [_hhCurrent.entity, filters, customFilters])

  const previousFilteredData = useMemo(() => {
    return map(_hhPrevious.entity, filterValues)
  }, [_hhPrevious.entity, filters, customFilters])

  const currentComputedData = useProtectionSnapshotData(currentFilteredData ?? Arr(), {
    start: customFilters.previousPeriodStart,
    end: customFilters.previousPeriodEnd,
  })
  const previousComputedData = useProtectionSnapshotData(previousFilteredData ?? Arr(), {
    start: customFilters.previousPeriodStart,
    end: customFilters.previousPeriodEnd,
  })

  const updateOblastFilters = (key: '_12_1_What_oblast_are_you_from_001_iso' | '_4_What_oblast_are_you_from_iso') => (oblastISO: OblastISOSVG) => {
    setFilters(f => {
      const value = f[key] as string[]
      if (value?.includes(oblastISO)) {
        return {
          ...f,
          [key]: value?.filter(_ => _ !== oblastISO)
        }
      }
      if (!value) {
        return {...f, [key]: [oblastISO]}
      }
      return {
        ...f, [key]: [...value, oblastISO]
      }
    })
  }

  const _4_What_oblast_are_you_from_iso = useMemo(() => {
    return _hhCurrent.entity?.map(_ => _._4_What_oblast_are_you_from_iso).distinct(_ => _).compact() ?? Arr([])
  }, [_hhCurrent.entity])

  const selectedCurrentOblastISOs = useMemo(() => {
    return _4_What_oblast_are_you_from_iso.distinct(_ => _).compact()
  }, [_4_What_oblast_are_you_from_iso])

  useEffect(() => {
    document.title = 'DRC-UA-PM_Snapshot-2023_Jan_Mar'
    // console.log('data', currentFilteredData?.map(_ => [_.persons, _._12_Do_you_identify_as_any_of]).get)
    // console.log('here',
    //   currentFilteredData
    //     ?.filter(x => x._12_Do_you_identify_as_any_of === 'idp')
    //     ?.filter(x => !!x.persons.flatMap(_ => _.age).find(_ => _ && _ >= 18))
    //     ?.map(_ => _.persons.filter(_ => _.age && _.gender && _.age >= 18 && _.gender === 'female'))
    //     .map(_ => _.map(_ => [_.age, _.gender, _.statusDoc?.join(',')].join(' - ')))
    //     .get
    // )
  }, [currentFilteredData])
  // console.log(currentFilteredData?.flatMap(_ => _.persons.map(_ => _.age)).filter(_ => _ && _ < 18))

  // return (
  //   <SlidePanelTitle>IDPs</SlidePanelTitle>
  // )
  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{display: 'flex'}}>
        <ProtSnapshotFilters
          className="noprint"
          current={{
            data: currentFilteredData ?? Arr([]),
            computed: currentComputedData,
          }}
          previous={{
            data: previousFilteredData ?? Arr([]),
            computed: previousComputedData
          }}
          filters={filters}
          onFilter={setFilters}
          customFilters={customFilters}
          onCustomFilters={setCustomFilters}
          onFilterOblast={updateOblastFilters}
        />
        <Box sx={{flex: 1}}>
          {currentFilteredData && previousFilteredData ? (
            <Pdf>
              <_ProtectionSnapshot
                current={{
                  data: currentFilteredData,
                  computed: currentComputedData,
                }}
                previous={{
                  data: previousFilteredData,
                  computed: previousComputedData
                }}
                filters={filters}
                customFilters={customFilters}
                onFilter={setFilters}
                onCustomFilters={setCustomFilters}
                onFilterOblast={updateOblastFilters}
              />
            </Pdf>
          ) : (_hhCurrent.loading || _hhPrevious.loading) && (
            <Fender type="loading"/>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export const _ProtectionSnapshot = (props: ProtSnapshotSlideProps) => {
  const theme = useTheme()
  const {conf} = useConfig()

  useEffect(() => {
    initGoogleMaps(
      conf.gooogle.mapId,
      theme.palette.primary.main,
      props.current.data.map(_ => ({loc: _.geolocation!, size: _._8_What_is_your_household_size}))
    )
  }, [])

  return (
    <>
      {/*<Box sx={{display: 'flex', mb: 1}}>*/}
      {/*  <Box sx={{flex: 1, mx: 3}}>*/}
      {/*    <HorizontalBarChartGoogle*/}
      {/*      base={props.current.data.length}*/}
      {/*      data={props.current.computed._28_Do_you_have_acce_current_accomodation}*/}
      {/*    />*/}
      {/*    <HorizontalBarChartGoogle*/}
      {/*      base={props.current.data.length}*/}
      {/*      data={props.current.computed.C_Vulnerability_catergories_that}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*  <Box sx={{flex: 1, mx: 3}}>*/}
      {/*    1st<br/>*/}
      {/*    <HorizontalBarChartGoogle*/}
      {/*      base={props.current.data.length}*/}
      {/*      data={props.current.computed._40_1_What_is_your_first_priorty}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*  <Box sx={{flex: 1, mx: 3}}>*/}
      {/*    2nd<br/>*/}
      {/*    <HorizontalBarChartGoogle*/}
      {/*      base={props.current.data.length}*/}
      {/*      data={props.current.computed._40_2_What_is_your_second_priority}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*</Box>*/}

      {/*<ProtSnapshotHome {...props}/>*/}
      <ProtSnapshotSample {...props}/>
      <ProtSnapshotDisplacement {...props}/>
      <ProtSnapshotSafety {...props}/>
      <ProtSnapshotDocument {...props}/>
      <ProtSnapshotLivelihood {...props}/>
      <ProtSnapshotNeeds {...props}/>
    </>
  )
}

