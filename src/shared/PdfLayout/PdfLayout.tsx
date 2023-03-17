import {Box, BoxProps, GlobalStyles} from '@mui/material'
import React, {ReactNode, useContext} from 'react'

const generalStyles = <GlobalStyles
  styles={{
    '@media print': {
      '.gm-fullscreen-control': {
        display: 'none',
      },
      '.noprint': {
        display: 'none',
      },
      '[role="tooltip"]': {
        display: 'none',
      },
    },
  }}
/>


const PdfContext = React.createContext({
  pdfTheme: {
    slidePadding: 2,
    slideRadius: 4,
    fontSize: 15,
  }
})

export const usePdfContext = () => useContext(PdfContext)

export const Pdf = ({children, ...props}: BoxProps) => {
  return (
    <>
      {generalStyles}
      <Box sx={{
        fontSize: 15,
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
        >
          {children}
        </Box>
      </Box>
    </>
  )
}

