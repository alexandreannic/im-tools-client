import {Box, BoxProps} from '@mui/material'
import {Txt} from 'mui-extension'
import React, {useEffect} from 'react'

export const Layout = ({
  width = 680,
  children,
  sx,
  ...props
}: BoxProps & {width?: number}) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])
  return (
    <Box sx={sx}>
      <Box component="main" sx={{
        mx: 'auto',
        maxWidth: width,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pt: 3,
        pb: 2,
        px: 2,
      }} {...props}>
        <Box sx={{
          flex: 1,
        }}>
          {children}
        </Box>

        <Box component="footer" sx={{
          borderTop: t => `1px solid ${t.palette.divider}`,
          pt: 1,
          mt: 3,
          color: t => t.palette.text.disabled
        }}>
          <Txt block>© 2023&nbsp;<b>DRC</b>&nbsp;Danish Refugee Council</Txt>
        </Box>
      </Box>
    </Box>
  )
}
