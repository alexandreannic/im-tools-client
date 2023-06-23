import * as React from 'react'
import {ReactNode} from 'react'
import {Box, BoxProps, LinearProgress} from '@mui/material'
import {Page as MxPage} from 'mui-extension'

export interface PageProps extends BoxProps {
  width?: number | 'xs' | 'md' | 'lg' | 'full'
  animated?: boolean
  className?: any
  style?: object
  loading?: boolean
  children: ReactNode
}

export const PageHeader = ({
  children,
  action,
  ...props
}: {
  action?: ReactNode
} & BoxProps) => {
  return (
    <Box {...props} sx={{display: 'flex', alignItems: 'center',}}>
      <PageTitle>{children}</PageTitle>
      {action && (
        <Box sx={{marginLeft: 'auto'}}>{action}</Box>
      )}
    </Box>
  )
}
export const PageTitle = ({action, children, sx, ...props}: BoxProps & {action?: ReactNode}) => {
  return (
    <Box component="h2" sx={{display: 'flex', alignItems: 'center', ...sx}}>
      {children}
      {action && (
        <Box sx={{ml: 'auto'}}>{action}</Box>
      )}
    </Box>
  )
}

export const Page = ({loading, children, sx, ...props}: PageProps) => {
  const width = typeof props.width === 'string' ? ({
    xs: 780,
    md: 1000,
    lg: 1200,
    full: 3000,
  })[props.width] : props.width
  return (
    <>
      {loading && (
        <LinearProgress/>
      )}
      <MxPage {...props} width={width} sx={{...sx, my: 2, px: 2}}>
        {children}
      </MxPage>
    </>
  )
}
