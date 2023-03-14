import {Box, BoxProps, GlobalStyles} from '@mui/material'
import React from 'react'

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

export const Pdf = (props: BoxProps) => {
  return (
    <>
      {generalStyles}
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
              width: '29.7cm',
            }
          }}
        />
      </Box>
    </>
  )
}

export const Slide = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        background: 'white',
        overflow: 'hidden',
        '@media screen': {
          width: '29.7cm',
          height: '21.0cm',
          // aspectRatio: (297 / 210) + '',
          mb: 2,
          borderRadius: '6px',
          boxShadow: t => t.shadows[1],
        },
        pageBreakAfter: 'always',
      }}
    />
  )
}
