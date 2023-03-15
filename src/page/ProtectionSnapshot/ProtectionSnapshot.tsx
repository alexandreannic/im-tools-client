import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {_Arr, Arr, Enum, mapFor} from '@alexandreannic/ts-utils'
import {Oblast} from '../../shared/UkraineMap/oblastIndex'
import {useKoboContext} from '../../core/context/KoboContext'
import {Fender, Txt} from 'mui-extension'
import {Slide, SlideBody, SlideCard, SlideHeader, SlidePanel} from 'shared/PdfLayout/Slide'
import {ScLineChart} from '../../shared/Chart/Chart'
import {Pdf, usePdfContext} from 'shared/PdfLayout/PdfLayout'
import {useI18n} from '../../core/i18n'
import {useProtectionSnapshotData} from './useProtectionSnapshotData'
import {format} from 'date-fns'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import LatLngLiteral = google.maps.LatLngLiteral
import Answer = KoboFormProtHH.Answser
import mapAnswers = KoboFormProtHH.mapAnswers
import {Pie, PieChart, ResponsiveContainer} from 'recharts'

const initGoogleMaps = (color: string, bubbles: {loc: [number, number], size: number | undefined}[]) => {
  const ukraineCenter: LatLngLiteral = {lat: 48.96008674231441, lng: 31.702957509661097}
  const map = new google.maps.Map(document.querySelector('#map') as HTMLElement, {
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
  const {api} = useConfig()
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
  data: _Arr<Answer>
  period: [Date, Date]
  previousPeriod: [Date, Date]
  filters: Partial<FormFilters>
  onFilter: Dispatch<SetStateAction<Partial<FormFilters>>>
}) => {
  const theme = useTheme()
  const {pdfTheme} = usePdfContext()
  const {m, formatLargeNumber} = useI18n()
  const computed = useProtectionSnapshotData(data, {start: period[0], end: period[1]})

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

  useEffect(() => {
    initGoogleMaps(
      theme.palette.primary.main,
      data.map(_ => ({loc: _._geolocation, size: _._8_What_is_your_household_size}))
    )
  }, [])

  console.log(computed._8_individuals.persons)
  console.log(computed._8_individuals.byAgeGroup)
  console.log(computed._8_individuals.byGender)
  console.log('---')
  // console.log('_12_7_1_planToReturn,', _12_7_1_planToReturn)
  // console.log('_12_3_1_dateDeparture', _12_3_1_dateDeparture)
  // console.log(new Set(data.map(_ => _._12_7_1_Do_you_plan_to_return_to_your_)))
  // console.log(_answers.entity?.data.map(_ => _['_12_1_What_oblast_are_you_from_001']))
  // console.log(oblastOrigins)
  return (
    <Pdf>
      <Slide>
        <SlideHeader>{m.protectionHHSnapshot.title}: {m.protectionHHSnapshot.subTitle}</SlideHeader>
        <SlideBody>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <Box sx={{flex: 1, mr: pdfTheme.slidePadding}}>
              <Txt size="big" color="hint" block sx={{mb: 1}}>
                {format(period[0], 'LLLL yyyy')} - {format(period[0], 'LLLL yyyy')}
              </Txt>
              <Box sx={{textAlign: 'justify'}}>{m.protectionHHSnapshot.disclaimer}</Box>
              <Box sx={{display: 'flex'}}>
                <SlideCard title={m.hhs} icon="home">
                  {formatLargeNumber(data.length)}
                </SlideCard>
                <SlideCard title={m.individuals} icon="person">
                  {formatLargeNumber(computed.totalMembers)}
                </SlideCard>
                <SlideCard title={m.hhSize} icon="group">
                  {(computed.totalMembers / data.length).toFixed(1)}
                </SlideCard>
              </Box>

              <Box sx={{display: 'flex'}}>
                <SlidePanel>
                  <Box sx={{height: 200, width: 200}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={200} height={200}>
                        <Pie
                          data={computed._8_individuals.byGender}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          label
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </SlidePanel>
                <SlidePanel>
                <HorizontalBarChartGoogle
                  data={computed._8_individuals.byAgeGroup}
                />
                </SlidePanel>
              </Box>

            </Box>
            <Box sx={{flex: 1}}>
              <Box id="map" sx={{height: 400, borderRadius: pdfTheme.slideRadius}}/>
            </Box>
          </Box>
        </SlideBody>
      </Slide>
      <Slide>
        <SlideHeader>{m.displacement}</SlideHeader>
        <SlideBody sx={{display: 'flex'}}>
          <SlidePanel
            sx={{flex: 1, mr: pdfTheme.slidePadding}}
            title={m.displacement}
          >
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <UkraineMap
                total={data.length}
                values={computed.oblastOrigins}
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
                values={computed.oblastCurrent}
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
              {/*  value={+computed._12_7_1_planToReturn.toFixed(1)}*/}
              {/*  sx={{fontSize: '1.4rem'}}*/}
              {/*/>*/}
            </SlidePanel>
            <SlidePanel>
              <ScLineChart height={200} hideLabelToggle curves={[
                {label: m.departureFromAreaOfOrigin, key: 'dateOfDeparture', curve: computed._12_3_1_dateDeparture},
              ]}/>
            </SlidePanel>
            <SlidePanel title={m.decidingFactorsToReturn}>
              <HorizontalBarChartGoogle barHeight={3} data={computed._12_8_1_What_would_be_the_deciding_fac} base={data.length}/>
            </SlidePanel>
          </Box>
        </SlideBody>
      </Slide>
    </Pdf>
  )
}
