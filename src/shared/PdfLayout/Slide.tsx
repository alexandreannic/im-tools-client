import {Box, BoxProps, Icon} from '@mui/material'
import logo from '../../core/img/drc-logo.png'
import {Txt, TxtProps} from 'mui-extension'
import React from 'react'
import {usePdfContext} from './PdfLayout'
import {Property} from 'csstype'
import logoEu from '../../core/img/eu.png'

export const Slide = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        background: t => t.palette.background.default,
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
        ...props.sx,
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
      ...sx,
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
      px: 2,
      py: 1,
      borderBottom: t => `1px solid ${t.palette.divider}`,
      mb: 0,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box sx={{fontSize: '1.4em'}}>{children}</Box>
      <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
        <Box component="img" src={logoEu} sx={{mr: 1, height: 30}}/>
        <Box component="img" src={logo} sx={{height: 22}}/>
      </Box>
    </Box>
  )
}

export const SlideBody = (props: BoxProps) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box {...props} sx={{p: pdfTheme.slidePadding, pb: 0, ...props.sx}}/>
  )
}

export const SlidePanelTitle = (props: TxtProps) => {
  return <Txt block size="big" bold sx={{display: 'flex', alignItems: 'center', mb: .75, lineHeight: 1.15, mr: -1}} uppercase color="hint" {...props}/>
}

export const SlidePanel = ({children, title, sx, noBackground, ...props}: BoxProps & {noBackground?: boolean}) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box
      {...props}
      sx={{
        ...sx,
        mb: pdfTheme.slidePadding,
        p: 1.5,
        background: t => noBackground ? undefined : t.palette.background.paper,
        borderRadius: pdfTheme.slideRadius,
        // border: t => `1px solid ${t.palette.divider}`
      }}
    >
      {title && <SlidePanelTitle>{title}</SlidePanelTitle>}
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
      p: 1.25,
      width: '100%',
      background: t => t.palette.background.paper,
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
