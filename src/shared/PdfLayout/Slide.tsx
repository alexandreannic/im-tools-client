import {Box, BoxProps, Icon} from '@mui/material'
import logo from '../../core/drc-logo.png'
import {Txt, TxtProps} from 'mui-extension'
import React from 'react'
import {usePdfContext} from './PdfLayout'
import {Property} from 'csstype'

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

export const SlideH1 = ({children, sx, ...props}: BoxProps) => {
  return (
    <Box {...props} sx={{
      fontSize: '1.25em',
      fontWeight: t => t.typography.fontWeightBold,
      lineHeight: 1,
      ...sx
    }}>
      {children}
    </Box>
  )
}

export const SlideTxt = ({children, sx, textAlign = 'justify', ...props}: TxtProps) => {
  return (
    <Txt {...props} textAlign={textAlign} sx={{
      lineHeight: 1.5,
    }}>
      {(typeof children === 'string') ? (
        <div dangerouslySetInnerHTML={{__html: children}}/>
      ) : children}
    </Txt>
  )
}

export const SlideContainer = ({
  flexDirection,
  children,
  sx,
  title,
  ...props
}: BoxProps & {
  flexDirection?: Property.FlexDirection,
}) => {
  const {pdfTheme: t} = usePdfContext()
  return (
    <Box {...props} sx={{
      display: 'flex',
      flex: 1,
      flexDirection,
      '& > :not(:last-child)': flexDirection === 'column' ? {mb: t.slidePadding} : {mr: t.slidePadding},
      ...sx,
    }}>
      {children}
    </Box>
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

export const SlidePanel = ({children, title, sx, noBackground, ...props}: BoxProps & {noBackground?: boolean}) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box
      {...props}
      sx={{
        ...sx,
        mb: pdfTheme.slidePadding,
        p: 1,
        background: noBackground ? undefined : '#f8f9fa',
        borderRadius: pdfTheme.slideRadius,
      }}
    >
      {title && <Txt block bold sx={{fontSize: '1.15em', mb: .5}}>{title}</Txt>}
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
        mr: pdfTheme.slidePadding,
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
