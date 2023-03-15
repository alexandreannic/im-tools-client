import {Box, BoxProps, Icon} from '@mui/material'
import logo from '../../core/drc-logo.png'
import {Txt} from 'mui-extension'
import React from 'react'
import {usePdfContext} from './PdfLayout'

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

export const SlideHeader = ({children}: BoxProps) => {
  return (
    <Box sx={{
      p: 2,
      borderBottom: t => `1px solid ${t.palette.divider}`,
      mb: 0,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box sx={{fontSize: '1.4em'}}>{children}</Box>
      <Box component="img" src={logo} sx={{height: 22, marginLeft: 'auto'}}/>
    </Box>
  )
}

export const SlideBody = (props: BoxProps) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box {...props} sx={{p: pdfTheme.slidePadding, ...props.sx}}/>
  )
}

export const SlidePanel = ({children, title, sx, ...props}: BoxProps) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box
      {...props}
      sx={{
        ...sx,
        mb: pdfTheme.slidePadding,
        p: 1,
        background: '#f8f9fa',
        borderRadius: pdfTheme.slideRadius,
      }}
    >
      <Txt bold block sx={{fontSize: '1.3em', mb: .5}}>{title}</Txt>
      {children}
    </Box>
  )
}

export const SlideCard = ({
  sx,
  children,
  title,
  icon,
  ...props
}: BoxProps & {
  icon?: string
}) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box {...props} sx={{
      '&:not(:last-of-type)': {
        mr: 1,
      },
      p: 1,
      width: '100%',
      background: '#f8f9fa',
      borderRadius: pdfTheme.slideRadius,
      textAlign: 'center',
      ...sx,
    }}>
      <Box sx={{
        fontSize: '1.5em',
        display: 'inline-flex', 
        alignItems: 'center'
      }}>
        {icon && <Icon color="disabled" sx={{mr: 1}}>{icon}</Icon>}
        {children}
      </Box>
      <Txt block color="hint">
        {title}
      </Txt>
    </Box>
  )
}
