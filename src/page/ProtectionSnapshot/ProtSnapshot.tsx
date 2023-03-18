import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {Period, UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Box, FormControlLabel, Icon, Switch, useTheme} from '@mui/material'
import {_Arr, Arr, Enum, map, sleep} from '@alexandreannic/ts-utils'
import {Fender, IconBtn} from 'mui-extension'
import {Pdf} from 'shared/PdfLayout/PdfLayout'
import {UseProtectionSnapshotData, useProtectionSnapshotData} from './useProtectionSnapshotData'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {ProtSnapshotHome} from './ProtSnapshotHome'
import {ProtSnapshotDisplacement} from './ProtSnapshotDisplacement'
import {KoboAnswer} from '../../core/sdk/kobo/KoboType'
import {useI18n} from '../../core/i18n'
import {AaSelect} from '../../shared/Select/Select'
import {ProtSnapshotNeeds} from './ProtSnapshotNeeds'
import {HorizontalBarChartGoogle, HorizontalBarChartGoogleData} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import LatLngLiteral = google.maps.LatLngLiteral
import Answer = KoboFormProtHH.Answer
import mapAnswers = KoboFormProtHH.mapAnswers
import Status = KoboFormProtHH.Status
import {ChartDataObjValue} from '../../core/chartTools'

const initGoogleMaps = async (mapId: string, color: string, bubbles: {loc: [number, number], size: number | undefined}[]) => {
  let trys = 0
  while (!google) {
    await sleep(200 + (100 * trys))
    trys++
    if (trys > 40) break
  }
  const ukraineCenter: LatLngLiteral = {lat: 48.96008674231441, lng: 31.702957509661097}
  const map = new google.maps.Map(document.querySelector('#map') as HTMLElement, {
    mapId: mapId,
    center: ukraineCenter,
    zoom: 5.2,
  })
  bubbles.forEach(_ => {
    if (!_.loc?.[0]) return
    const circle = new google.maps.Circle({
      clickable: true,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.25,
      map,
      center: {lat: _.loc[0], lng: _.loc[1]},
      radius: Math.sqrt(_.size ?? 1) * 5500,
    })
    google.maps.event.addListener(circle, 'mouseover', function () {
      map.getDiv().setAttribute('title', _.size + '')
    })
  })
}

interface Data {
  data: _Arr<Answer>
  computed: UseProtectionSnapshotData
  period: Period
}

export interface ProtSnapshotSlideProps {
  current: Data
  previous: Data
  filters: Partial<ProtSnapshotFilters>
  onFilter: Dispatch<SetStateAction<Partial<ProtSnapshotFilters>>>
}

export type ProtSnapshotCustomFilters = {
  hohh60?: boolean
  hohhFemale?: boolean
}

export type ProtSnapshotFilters = {
  _12_Do_you_identify_as_any_of: NonNullable<Answer['_12_Do_you_identify_as_any_of']>[]
  _12_1_What_oblast_are_you_from_001: NonNullable<Answer['_12_1_What_oblast_are_you_from_001']>[]
  _4_What_oblast_are_you_from: NonNullable<Answer['_4_What_oblast_are_you_from']>[]
  _12_7_1_Do_you_plan_to_return_to_your_: NonNullable<Answer['_12_7_1_Do_you_plan_to_return_to_your_']>[]
  _40_1_What_is_your_first_priorty: NonNullable<Answer['_40_1_What_is_your_first_priorty']>[]
  C_Vulnerability_catergories_that: Answer['C_Vulnerability_catergories_that']
}


export const ProtSnapshot = ({
  formId,
  // period = {start: new Date(2023, 1, 15), end: new Date()},
  period = {start: new Date(2023, 0, 1), end: new Date(2023, 2, 1)},
  previousPeriod = {start: new Date(2022, 10, 1), end: new Date(2023, 0, 1)},
}: {
  formId: UUID,
  period?: Period
  previousPeriod?: Period
}) => {
  const {m} = useI18n()
  const {api} = useConfig()
  const _hhCurrent = useFetcher(() => api.kobo.getAnswers(formId, period))
  const _hhPrevious = useFetcher(() => api.kobo.getAnswers(formId, previousPeriod))
  const [filters, setFilters] = useState<Partial<ProtSnapshotFilters>>({})
  const [customFilters, setCustomFilters] = useState<Partial<ProtSnapshotCustomFilters>>({})

  const filterValues = (data: KoboAnswer[]): _Arr<Answer> => {
    return Arr(data).map(mapAnswers).filter(row => {
      const filtered = Enum.keys(filters).every(k => {
        const filterValues = filters[k] ?? []
        return filterValues.length === 0
          || !!map(row[k], rowValue => [rowValue].flat().find(a => filterValues.find(b => a === b)))
      })
      if (!filtered) return filtered
      return Enum.entries<Record<keyof ProtSnapshotCustomFilters, (_: any) => boolean>>({
        hohh60: (value: ProtSnapshotCustomFilters['hohh60']) => !value || KoboFormProtHH.filterByHoHH60(row),
        hohhFemale: (value: ProtSnapshotCustomFilters['hohhFemale']) => !value || KoboFormProtHH.filterByHoHHFemale(row),
      }).every(([k, condition]) => {
        if (customFilters[k] === undefined) return true
        return condition(customFilters[k])
      })
    })
  }

  const currentFilteredData = useMemo(() => {
    return map(_hhCurrent.entity?.data, filterValues)
  }, [_hhCurrent.entity?.data, filters, customFilters])

  const previousFilteredData = useMemo(() => {
    return map(_hhPrevious.entity?.data, filterValues)
  }, [_hhPrevious.entity?.data, filters, customFilters])

  const currentComputedData = useProtectionSnapshotData(currentFilteredData ?? Arr(), period)
  const previousComputedData = useProtectionSnapshotData(previousFilteredData ?? Arr(), period)

  useEffect(() => {
    _hhCurrent.fetch({})
    _hhPrevious.fetch({})
  }, [])

  console.log(currentFilteredData)

  return (
    <Pdf>
      <Box className="noprint" sx={{margin: 'auto', maxWidth: '30cm', mb: 2}}>
        <Box sx={{display: 'flex', alignItems: 'center',}}>
          <AaSelect<KoboFormProtHH.Vulnerability>
            multiple
            label={m.vulnerabilities}
            value={filters.C_Vulnerability_catergories_that ?? []}
            onChange={_ => setFilters(prev => ({...prev, C_Vulnerability_catergories_that: _}))}
            options={Enum.values(KoboFormProtHH.Vulnerability).map(v =>
              ({value: v, children: m.protectionHHSnapshot.vulnerability[v]})
            )}
          />
          <AaSelect<KoboFormProtHH.Status>
            multiple
            label={m.status}
            value={filters._12_Do_you_identify_as_any_of ?? []}
            onChange={_ => setFilters(prev => ({...prev, _12_Do_you_identify_as_any_of: _}))}
            options={Enum.values(KoboFormProtHH.Status).map(v =>
              ({value: v, children: m.statusType[v]})
            )}
          />
          <div>
            {period.start.toDateString()}<br/>
            {period.end.toDateString()}
          </div>
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
          <IconBtn sx={{marginLeft: 'auto'}} color="primary" onClick={() => window.print()}><Icon>download</Icon></IconBtn>
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
          onFilter={setFilters}/>
      ) : (_hhCurrent.loading || _hhPrevious.loading) && (
        <Fender type="loading"/>
      )}
    </Pdf>
  )
}

export const _ProtectionSnapshot = (props: ProtSnapshotSlideProps) => {
  const theme = useTheme()
  const {conf} = useConfig()
  
  // console.log(props.current.data)
  // console.log('>>', new Set(props.current.data.flatMap(_ => (_ as any)._29_Which_NFI_do_you_need?.split(' '))))
  // console.log('--')
  useEffect(() => {
    // initGoogleMaps(
    //   conf.google.mapId,
    //   theme.palette.primary.main,
    //   props.current.data.map(_ => ({loc: _._geolocation, size: _._8_What_is_your_household_size}))
    // )
  }, [])
  // console.log(props.current.data.map(_ => _._40_1_What_is_your_first_priorty))


  return (
    <>
      <Box sx={{display: 'flex', mb: 1}}>
        <Box sx={{flex: 1, mx: 3}}>
          <HorizontalBarChartGoogle
            base={props.current.data.length}
            data={props.current.computed._28_Do_you_have_acce_current_accomodation}
          />
          <HorizontalBarChartGoogle
            base={props.current.data.length}
            data={props.current.computed.C_Vulnerability_catergories_that}
          />
        </Box>
        <Box sx={{flex: 1, mx: 3}}>
          1st<br/>
          <HorizontalBarChartGoogle
            base={props.current.data.length}
            data={props.current.computed._40_1_What_is_your_first_priorty}
          />
        </Box>
        <Box sx={{flex: 1, mx: 3}}>
          2nd<br/>
          <HorizontalBarChartGoogle
            base={props.current.data.length}
            data={props.current.computed._40_2_What_is_your_second_priority}
          />
        </Box>
      </Box>

      <ProtSnapshotNeeds {...props}/>
      <ProtSnapshotHome {...props}/>
      <ProtSnapshotDisplacement {...props}/>
    </>
  )
}
