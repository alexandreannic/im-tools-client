import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {Period, UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Box, FormControlLabel, Switch, useTheme} from '@mui/material'
import {_Arr, Arr, Enum, map, sleep} from '@alexandreannic/ts-utils'
import {Fender, Txt} from 'mui-extension'
import {Pdf} from 'shared/PdfLayout/PdfLayout'
import {UseProtectionSnapshotData, useProtectionSnapshotData} from './useProtectionSnapshotData'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {useI18n} from '../../core/i18n'
import {ItSelect} from '../../shared/Select/Select'
import {ProtSnapshotDocument} from './ProtSnapshotDocument'
import {ProtSnapshotSafety} from './ProtSnapshotSafety'
import {OblastISO} from '../../shared/UkraineMap/ukraineSvgPath'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {ProtSnapshotLivelihood} from './ProtSnapshotLivelihood'
import {ProtSnapshotNeeds} from './ProtSnapshotNeeds'
import {ProtSnapshotDisplacement} from './ProtSnapshotDisplacement'
import {ProtSnapshotSample} from './ProtSnapshotSample'
import {ProtSnapshotHome} from './ProtSnapshotHome'
import {Btn} from '../../shared/Btn/Btn'
import Answer = KoboFormProtHH.Answer
import {initGoogleMaps} from './initGoogleMaps'
import {SlidePanelTitle} from '../../shared/PdfLayout/Slide'

interface Data {
  data: _Arr<Answer>
  computed: UseProtectionSnapshotData
  period: Period
}

export interface ProtSnapshotSlideProps {
  current: Data
  previous: Data
  onFilterOblast: (key: '_12_1_What_oblast_are_you_from_001_iso' | '_4_What_oblast_are_you_from_iso') => (oblast: OblastISO) => void
  filters: Partial<ProtSnapshotFilters>
  onFilter: Dispatch<SetStateAction<Partial<ProtSnapshotFilters>>>
}

export type ProtSnapshotCustomFilters = {
  hohh60?: boolean
  hohhFemale?: boolean
}

export type ProtSnapshotFilters = {
  _12_Do_you_identify_as_any_of: NonNullable<Answer['_12_Do_you_identify_as_any_of']>[]
  _12_1_What_oblast_are_you_from_001_iso: NonNullable<Answer['_12_1_What_oblast_are_you_from_001_iso']>[]
  _4_What_oblast_are_you_from_iso: NonNullable<Answer['_4_What_oblast_are_you_from_iso']>[]
  _12_7_1_Do_you_plan_to_return_to_your_: NonNullable<Answer['_12_7_1_Do_you_plan_to_return_to_your_']>[]
  _40_1_What_is_your_first_priorty: NonNullable<Answer['_40_1_What_is_your_first_priorty']>[]
  C_Vulnerability_catergories_that: Answer['C_Vulnerability_catergories_that']
}


export const ProtSnapshot = ({
  formId,
  // period = {start: new Date(2023, 0, 1), end: new Date()},
  // period = {start: new Date(2023, 0, 4), end: new Date(2023, 0, 5)},
  period = {start: new Date(2023, 0, 1), end: new Date(2023, 3, 1)},
  previousPeriod = {start: new Date(2022, 9, 1), end: new Date(2023, 0, 1)},
}: {
  formId: UUID,
  period?: Period
  previousPeriod?: Period
}) => {

  const {m} = useI18n()
  const {api} = useConfig()
  const fetch = (period?: Period) => () => api.koboForm.getAnswers('746f2270-d15a-11ed-afa1-0242ac120002', formId, period).then(_ => Arr(_.data.map(KoboFormProtHH.mapAnswers)))
  const _hhCurrent = useFetcher(fetch(period))
  const _hhPrevious = useFetcher(fetch(previousPeriod))
  const [filters, setFilters] = useState<Partial<ProtSnapshotFilters>>({})
  const [customFilters, setCustomFilters] = useState<Partial<ProtSnapshotCustomFilters>>({})

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

  const currentFilteredData = useMemo(() => {
    return map(_hhCurrent.entity, filterValues)
  }, [_hhCurrent.entity, filters, customFilters])

  const previousFilteredData = useMemo(() => {
    return map(_hhPrevious.entity, filterValues)
  }, [_hhPrevious.entity, filters, customFilters])

  const currentComputedData = useProtectionSnapshotData(currentFilteredData ?? Arr(), period)
  const previousComputedData = useProtectionSnapshotData(previousFilteredData ?? Arr(), period)

  useEffect(() => {
    _hhCurrent.fetch({})
    _hhPrevious.fetch({})
  }, [])

  const updateOblastFilters = (key: '_12_1_What_oblast_are_you_from_001_iso' | '_4_What_oblast_are_you_from_iso') => (oblastISO: OblastISO) => {
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
    <Pdf>
      <Box className="noprint" sx={{margin: 'auto', maxWidth: '30cm', mb: 2}}>
        <Box>
          <Box sx={{display: 'flex'}}>
            <UkraineMap
              legend={false}
              data={currentComputedData.oblastCurrent}
              onSelect={updateOblastFilters('_4_What_oblast_are_you_from_iso')}
              sx={{width: '150px', mr: 2,}}
            />
            <Box>
              <Box sx={{display: 'flex', alignItems: 'center', flex: 1}}>
                <ItSelect<KoboFormProtHH.GetType<'vulnerability'>>
                  multiple
                  label={m.vulnerabilities}
                  value={filters.C_Vulnerability_catergories_that ?? []}
                  onChange={_ => setFilters(prev => ({...prev, C_Vulnerability_catergories_that: _}))}
                  options={Enum.keys(m.protHHSnapshot.enum.vulnerability).map(v =>
                    ({value: v, children: m.protHHSnapshot.enum.vulnerability[v]})
                  )}
                />
                <ItSelect<KoboFormProtHH.Status>
                  multiple
                  label={m.status}
                  value={filters._12_Do_you_identify_as_any_of ?? []}
                  onChange={_ => setFilters(prev => ({...prev, _12_Do_you_identify_as_any_of: _}))}
                  options={Enum.values(KoboFormProtHH.Status).map(v =>
                    ({value: v, children: m.statusType[v]})
                  )}
                />
                <FormControlLabel
                  control={<Switch/>}
                  label={m.hohhOlder}
                  checked={!!customFilters.hohh60}
                  onChange={(e: any) => setCustomFilters(prev => ({...prev, hohh60: e.target.checked}))}
                />
                <FormControlLabel
                  control={<Switch/>}
                  label={m.hohhFemale}
                  checked={!!customFilters.hohhFemale}
                  onChange={(e: any) => setCustomFilters(prev => ({...prev, hohhFemale: e.target.checked}))}
                />
              </Box>
              {/*<Divider/>*/}
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Txt color="hint" sx={{ml: 2}}>
                  {period.start.toDateString()}{' - '}
                  {period.end.toDateString()}
                </Txt>
                <Txt color="hint" bold sx={{ml: 2}}>
                  {currentFilteredData?.length ?? '-'}
                </Txt>
                <Btn
                  sx={{marginLeft: 'auto', mr: 2}}
                  color="primary"
                  variant="contained"
                  icon="download"
                  onClick={() => window.print()}
                >
                  Download PDF
                </Btn>
              </Box>
            </Box>
          </Box>
          {/*<AaSelect<OblastISO>*/}
          {/*  multiple*/}
          {/*  label={m.oblast}*/}
          {/*  value={filters._4_What_oblast_are_you_from_iso ?? []}*/}
          {/*  onChange={_ => setFilters(prev => ({...prev, _4_What_oblast_are_you_from_iso: _}))}*/}
          {/*  options={selectedCurrentOblastISOs.map(iso => ({*/}
          {/*    value: iso,*/}
          {/*    children: map(OblastIndex.findByIso(iso!)?.koboKey, _ => m.protHHSnapshot.enum.oblast[_])*/}
          {/*  }))}*/}
          {/*/>*/}
        </Box>
      </Box>
      {currentFilteredData && previousFilteredData ? (
        <_ProtectionSnapshot
          current={{
            data: currentFilteredData,
            period: period,
            computed: currentComputedData,
          }}
          previous={{
            data: previousFilteredData,
            period: previousPeriod,
            computed: previousComputedData
          }}
          filters={filters}
          onFilter={setFilters}
          onFilterOblast={updateOblastFilters}
        />
      ) : (_hhCurrent.loading || _hhPrevious.loading) && (
        <Fender type="loading"/>
      )}
    </Pdf>
  )
}

export const _ProtectionSnapshot = (props: ProtSnapshotSlideProps) => {
  const theme = useTheme()
  const {conf} = useConfig()

  useEffect(() => {
    initGoogleMaps(
      conf.gooogle.mapId,
      theme.palette.primary.main,
      props.current.data.map(_ => ({loc: _._geolocation, size: _._8_What_is_your_household_size}))
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

