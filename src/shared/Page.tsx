import * as React from 'react'
import {ReactNode} from 'react'
import {BoxProps, LinearProgress} from '@mui/material'
import {Page as MxPage} from 'mui-extension'

export interface PageProps extends BoxProps {
  width?: number
  animated?: boolean
  className?: any
  style?: object
  loading?: boolean
  children: ReactNode
}

export const Page = ({loading, children, ...props}: PageProps) => {
  return (
    <MxPage {...props}>
      {loading && (
        <LinearProgress/>
      )}
      {children}
    </MxPage>
  )
}
