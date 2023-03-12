import * as React from 'react'
import {ReactNode} from 'react'
import {BoxProps} from '@mui/material'
import {Page as MxPage} from 'mui-extension'

export interface PageProps extends BoxProps {
  width?: number
  animated?: boolean
  className?: any
  style?: object
  children: ReactNode
}

export const Page = ({...props}: PageProps) => {
  return (
      <MxPage {...props}/>
  )
}
