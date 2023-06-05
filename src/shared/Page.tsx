import * as React from 'react'
import {ReactNode} from 'react'
import {BoxProps, LinearProgress} from '@mui/material'
import {Page as MxPage} from 'mui-extension'

export interface PageProps extends BoxProps {
  width?: number | 'xs' | 'md' | 'lg' | 'full'
  animated?: boolean
  className?: any
  style?: object
  loading?: boolean
  children: ReactNode
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
