import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useApi} from '../../core/context/ApiContext'
import {UUID} from '../../core/type'
import React, {useEffect} from 'react'
import {Box, BoxProps, GlobalStyles} from '@mui/material'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'

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
  )
}

const Slide = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        '@media screen': {
          overflow: 'hidden',
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

export const ProtectionSnapshot = ({formId}: {formId: UUID}) => {
  const api = useApi()
  const _answers = useFetcher(api.kobo.getAnswers)

  useEffect(() => {
    console.log('fetch')
    _answers.fetch({}, formId, {start: new Date(2022, 11, 1), end: new Date(2023, 3, 1)})
  }, [formId])

  return (
    <Box sx={{
      padding: 2,
      background: '#f6f7f9',
    }}>
      {generalStyles}
      <div className="noprint">
        <button onClick={() => window.print()}>Download</button>
      </div>
      <Pdf>
        <Slide>
          Holalal
          <h1>Grey h1 element</h1>
          <HorizontalBarChartGoogle data={[{label: 'A', value: 1}, {label: 'B', value: 10}]}/>
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
    </Box>
  )
}
