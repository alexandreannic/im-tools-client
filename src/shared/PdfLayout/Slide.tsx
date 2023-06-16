import {Box, BoxProps, Icon} from '@mui/material'
import {Txt, TxtProps} from 'mui-extension'
import React, {ReactNode, useEffect, useRef} from 'react'
import {usePdfContext} from './PdfLayout'
import {Panel, PanelBody} from '../Panel'
import {PanelProps} from '../Panel/Panel'
import {DRCLogo, EULogo} from '../logo/logo'
import {uppercaseHandlingAcronyms} from '@/utils/utils'

export const Slide = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        background: t => t.palette.background.paper,
        overflow: 'hidden',
        width: '29.7cm',
        height: '21.0cm',
        '@media screen': {
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
    <Txt {...props} size="big" textAlign={textAlign} sx={{
      // borderLeft: t => `2px solid ${t.palette.divider}`,
      // pl: 1,
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
  children,
  sx,
  column,
  title,
  ...props
}: Omit<BoxProps, 'flexDirection'> & {
  column?: boolean
}) => {
  return (
    <Box {...props} sx={{
      display: 'flex',
      flex: 1,
      ...column && {
        flexDirection: 'column',
        // '& > *': {
        //   flex: 1
        // },
      },

      '& > :not(:last-child)': column ? {mb: 2} : {mr: 2},
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
      <Txt bold sx={{fontSize: '1.42em'}}>{children}</Txt>
      <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
        <EULogo height={30}/>
        <DRCLogo height={22}/>
      </Box>
    </Box>
  )
}

export const SlideBody = (props: BoxProps) => {
  const {pdfTheme} = usePdfContext()
  return (
    <Box {...props} sx={{p: 2, pb: 0, ...props.sx}}/>
  )
}

export const SlidePanelTitle = ({icon, uppercase = true, dangerouslySetInnerHTML, sx, children, ...props}: {icon?: string} & TxtProps) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (ref.current)
      ref.current.innerHTML = uppercaseHandlingAcronyms(ref.current.innerHTML)
  }, [children])

  return <Txt
    ref={ref}
    block
    // size="big"
    bold
    sx={{display: 'flex', alignItems: 'center', mb: .5, fontSize: '1.05em', lineHeight: 1.15, mr: -1, ...sx}}
    color="hint"
    {...props}
  >
    {icon && <Icon color="disabled" sx={{mr: 1}}>{icon}</Icon>}
    {dangerouslySetInnerHTML ? <div dangerouslySetInnerHTML={dangerouslySetInnerHTML}/> : children}
  </Txt>
}

export const SlidePanel = ({savableAsImg = true, expendable = true, children, sx, ...props}: PanelProps) => {
  return (
    <Panel {...props} savableAsImg={savableAsImg} expendable={expendable} sx={{
      ...sx,
      m: 0,
    }}>
      <PanelBody>{children}</PanelBody>
    </Panel>
  )
}
/** @deprecated*/
export const SlidePanelDepreacted = ({children, title, sx, noBackground, ...props}: Omit<BoxProps, 'title'> & {
  title?: ReactNode,
  noBackground?: boolean
}) => {
  return (
    <Box
      {...props}
      sx={{
        ...sx,
        p: 1.5,
        background: t => noBackground ? undefined : t.palette.background.default,
        borderRadius: t => t.shape.borderRadius,
        '&:last-child': {
          mb: 0
        },
      }}
    >
      {title && (typeof title === 'string' ? (
        <SlidePanelTitle dangerouslySetInnerHTML={{__html: title}}/>
      ) : (
        <SlidePanelTitle>{title}</SlidePanelTitle>
      ))}
      {children}
    </Box>
  )
}

export const SlideWidget = ({
  sx,
  children,
  title,
  icon,
  ...props
}: Omit<PanelProps, 'title' | 'expendable' | 'savableAsImg'> & {
  icon?: string | ReactNode
  title: string
}) => {
  return (
    <SlidePanel
      {...props}
      expendable={false}
      savableAsImg={false}
      sx={{
        width: '100%',
        textAlign: 'center',
        '&:last-child': {
          mr: 0,
        },
        ...sx,
      }}>
      <Txt block color="hint" bold>
        {uppercaseHandlingAcronyms(title)}
      </Txt>
      <Box sx={{
        fontWeight: t => t.typography.fontWeightBold,
        fontSize: '1.7em',
        display: 'inline-flex',
        alignItems: 'center'
      }}>
        {icon && (typeof icon === 'string' ? <Icon color="disabled" sx={{mr: 1}} fontSize="large">{icon}</Icon> : icon)}
        {children}
      </Box>
    </SlidePanel>
  )
}
