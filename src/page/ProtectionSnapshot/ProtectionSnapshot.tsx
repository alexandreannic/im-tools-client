import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useApi} from '../../core/context/ApiContext'
import {UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Box, BoxProps, CircularProgress, GlobalStyles, Icon} from '@mui/material'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {Oblast, OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {useKoboContext} from '../../core/context/KoboContext'
import {KoboAnswer} from '../../core/sdk/kobo/KoboType'
import {Fender} from 'mui-extension'
import {ProtectionSnapshotBody, ProtectionSnapshotHeader} from './ProtectionShapshotHeader'

const generalStyles = <GlobalStyles
  styles={{
    '@media print': {
      '.noprint': {
        display: 'none',
      },
      '[role="tooltip"]': {
        display: 'none',
      },
    },
  }}
/>

const Pdf = (props: BoxProps) => {
  return (
    <Box sx={{
      '@media screen': {
        background: '#f6f7f9',
        padding: 2,
      }
    }}>

      <Box
        {...props}
        sx={{
          size: 'landscape',
          '@media screen': {
            my: 2,
            mx: 'auto',
            maxWidth: 900,
          }
        }}
      />
    </Box>
  )
}

const Slide = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        background: 'white',
        overflow: 'hidden',
        '@media screen': {
          aspectRatio: (297 / 210) + '',
          mb: 2,
          borderRadius: '6px',
          // border: t => '1px solid ' + t.palette.divider,
          boxShadow: t => t.shadows[1],
        },
        pageBreakAfter: 'always',
      }}
    />
  )
}

interface FormFilters {
  _12_1_What_oblast_are_you_from_001: string[]
  _4_What_oblast_are_you_from: string[]
}


export const ProtectionSnapshot = ({formId}: {formId: UUID}) => {
  const api = useApi()
  const _hh = useKoboContext().hh
  const _form = useFetcher(api.kobo.getForm)
  const [filters, setFilters] = useState<Partial<FormFilters>>({})

  const filteredValues = useMemo(() => {
    return _hh.entity?.data.filter(_ => {
      return Enum.keys(filters).every(k => {
        const filterValues = filters[k] ?? []
        // TODO handle multiple choices
        return filterValues.length === 0 || filterValues.includes(_[k])
      })
    })
  }, [_hh.entity, filters])

  useEffect(() => {
    _hh.fetch({}, {start: new Date(2023, 0, 1), end: new Date(2023, 2, 1)})
  }, [])

  return (
    <>
      {generalStyles}
      <div className="noprint">
        <button onClick={() => window.print()}>Download</button>
      </div>
      {filteredValues ? (
        <_ProtectionSnapshot data={filteredValues} filters={filters} onFilter={setFilters}/>
      ) : _hh.loading && (
        <Fender type="loading"/>
      )}
    </>
  )
}

export const _ProtectionSnapshot = ({data, filters, onFilter}: {
  data: KoboAnswer[],
  filters: Partial<FormFilters>,
  onFilter: Dispatch<SetStateAction<Partial<FormFilters>>>
}) => {

  const oblastOrigins = useMemo(() => {
    const _ = Arr(data.map(_ => _['_12_1_What_oblast_are_you_from_001']) ?? []).groupBy((_: string) => _)
    return Object.entries(_).reduce<Record<string, number>>((acc, [k, v]) => ({...acc, [OblastIndex.findByKoboKey(k)?.iso!]: v.length}), {})
  }, [data])

  const oblastCurrent = useMemo(() => {
    const _ = Arr(data.map(_ => _['_4_What_oblast_are_you_from']) ?? []).groupBy((_: string) => _)
    return Object.entries(_).reduce<Record<string, number>>((acc, [k, v]) => ({...acc, [OblastIndex.findByKoboKey(k)?.iso!]: v.length}), {})
  }, [data])

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

  // console.log(_answers.entity?.data.map(_ => _['_12_1_What_oblast_are_you_from_001']))
  // console.log(oblastOrigins)
  return (
    <>
      <Pdf>
        <Slide>
          <ProtectionSnapshotHeader>Displacement 1234567890 1234567890 1234567890</ProtectionSnapshotHeader>
          <ProtectionSnapshotBody sx={{display: 'flex'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '40%', alignItems: 'center'}}>
              <UkraineMap total={data.length} values={oblastOrigins} onSelect={updateOblastFilters('_12_1_What_oblast_are_you_from_001')}/>
              <Box sx={{my: 1}}>
                <Icon color="disabled" fontSize="large" >arrow_downward</Icon>
                <Icon color="disabled" fontSize="large">arrow_downward</Icon>
                <Icon color="disabled" fontSize="large">arrow_downward</Icon>
              </Box>
              <UkraineMap total={data.length} values={oblastCurrent} onSelect={updateOblastFilters('_4_What_oblast_are_you_from')}/>
            </Box>
            <Box sx={{flex: 1}}>
              aa
            </Box>
          </ProtectionSnapshotBody>
        </Slide>
        <Slide>
          Holalal
          <h1>P22</h1>
          <HorizontalBarChartGoogle data={[
            {label: 'C', value: 12},
            {label: '1', value: 10},
            {label: '2', value: 10},
            {label: '3', value: 10},
            {label: '4', value: 10},
            {label: '5', value: 10},
            {label: '6', value: 10},
            {label: '7', value: 10},
            {label: '8', value: 10},
            {label: '9', value: 10},
            {label: '1C', value: 12},
            {label: '11', value: 10},
            {label: '12', value: 10},
            {label: '13', value: 10},
            {label: '14', value: 10},
            {label: '15', value: 10},
            {label: '16', value: 10},
            {label: '17', value: 10},
            {label: '18', value: 10},
            {label: '19', value: 10},
          ]}/>
        </Slide>
      </Pdf>
    </>
  )
}
