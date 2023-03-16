import {useFetcher, useMemoFn} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {Period, UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {useTheme} from '@mui/material'
import {_Arr, Arr, Enum, map, sleep} from '@alexandreannic/ts-utils'
import {Fender} from 'mui-extension'
import {Pdf, usePdfContext} from 'shared/PdfLayout/PdfLayout'
import {useI18n} from '../../core/i18n'
import {UseProtectionSnapshotData, useProtectionSnapshotData} from './useProtectionSnapshotData'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {ProtSnapshotHome} from './ProtSnapshotHome'
import {ProtSnapshotDisplacement} from './ProtSnapshotDisplacement'
import {koboFormId} from '../../core/img/koboFormId'
import LatLngLiteral = google.maps.LatLngLiteral
import Answer = KoboFormProtHH.Answser
import mapAnswers = KoboFormProtHH.mapAnswers
import {KoboAnswer} from '../../core/sdk/kobo/KoboType'

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
  filters: Partial<ProtSnapshotFormFilters>
  onFilter: Dispatch<SetStateAction<Partial<ProtSnapshotFormFilters>>>
}

export interface ProtSnapshotFormFilters {
  _12_1_What_oblast_are_you_from_001: string[]
  _4_What_oblast_are_you_from: string[]
  _12_7_1_Do_you_plan_to_return_to_your_: string[]
}

export const ProtSnapshot = ({
  formId,
  period = {start: new Date(2023, 0, 1), end: new Date(2023, 2, 1)},
  previousPeriod = {start: new Date(2022, 10, 1), end: new Date(2023, 0, 1)},
}: {
  formId: UUID,
  period?: Period
  previousPeriod?: Period
}) => {
  const {api} = useConfig()
  const _hhCurrent = useFetcher(() => api.kobo.getAnswers(formId, period))
  const _hhPrevious = useFetcher(() => api.kobo.getAnswers(formId, previousPeriod))
  const [filters, setFilters] = useState<Partial<ProtSnapshotFormFilters>>({})

  const filterValues = (data: KoboAnswer[]): _Arr<Answer> => {
    return Arr(data).filter(_ => {
      return Enum.keys(filters).every(k => {
        const filterValues = filters[k] ?? []
        // TODO handle multiple choices
        return filterValues.length === 0 || filterValues.includes(_[k]!)
      })
    }).map(mapAnswers)
  }

  const currentFilteredData = useMemo(() => {
    return map(_hhCurrent.entity?.data, filterValues)
  }, [_hhCurrent.entity?.data, filters])
  
  const previousFilteredData = useMemo(() => {
    return map(_hhPrevious.entity?.data, filterValues)
  }, [_hhPrevious.entity?.data, filters])

  const currentComputedData = useProtectionSnapshotData(currentFilteredData ?? Arr(), period)
  const previousComputedData = useProtectionSnapshotData(previousFilteredData ?? Arr(), period)

  useEffect(() => {
    _hhCurrent.fetch({})
    _hhPrevious.fetch({})
  }, [])

  return (
    <>
      <div className="noprint">
        <button onClick={() => window.print()}>Download</button>
      </div>
      {JSON.stringify(filters)}
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
    </>
  )
}

export const _ProtectionSnapshot = (props: ProtSnapshotSlideProps) => {
  const theme = useTheme()
  const {conf} = useConfig()

  console.log(props.current.data)
  console.log(new Set(props.current.data.flatMap(_ => _._12_Do_you_identify_as_any_of?.split(' '))))
  console.log('--')
  useEffect(() => {
    // initGoogleMaps(
    //   conf.google.mapId,
    //   theme.palette.primary.main,
    //   props.current.data.map(_ => ({loc: _._geolocation, size: _._8_What_is_your_household_size}))
    // )
  }, [])

  return (
    <Pdf>
      <ProtSnapshotHome {...props}/>
      <ProtSnapshotDisplacement {...props}/>
    </Pdf>
  )
}
