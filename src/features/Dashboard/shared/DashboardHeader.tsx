import {IconBtn} from 'mui-extension'
import {alpha, Box, BoxProps, GlobalStyles, Icon, Slide, Typography} from '@mui/material'
import {DRCLogo, EULogo} from '@/shared/logo/logo'
import React, {ReactNode, useEffect} from 'react'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'

export const dashboardHeaderId = 'aa-sidebar-id'
const headerStickyClass = 'sticky-header'
let header$: HTMLElement | null = null

const stickHeader = () => {
  if (!header$) {
    header$ = document.getElementById(dashboardHeaderId)!
  }
  if (window.scrollY > header$.offsetHeight) {
    if (!header$.classList.contains(headerStickyClass)) {
      header$.classList.add(headerStickyClass)
    }
  } else {
    header$.classList.remove(headerStickyClass)
  }
}

const generalStyles = <GlobalStyles styles={t => ({
  '.header_content': {
    flex: 1,
  },
  [`.${headerStickyClass} .header_content`]: {},
  [`.${headerStickyClass} .header_title_main`]: {
    fontSize: '1.4em',
  },
  [`.${headerStickyClass} .header_title_sub`]: {
    fontSize: '1.1em',
    // '&:before': {
    //   content: '" - "',
    // }
  },
  [`.${headerStickyClass} .header_title`]: {
    // display: 'flex',
    // alignItems: 'center',
    marginBottom: t.spacing(0),
  },
  [`#${dashboardHeaderId}.${headerStickyClass}`]: {
    border: 'none',
    boxShadow: t.shadows[4],
    background: t.palette.background.paper,
    padding: `${t.spacing(1)} ${t.spacing(0)} ${t.spacing(0)} ${t.spacing(2)}`,
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
  }
})}/>

export const DashboardHeader = ({
  title,
  subTitle,
  action,
  hideEuLogo,
  header,
  id,
  ...props
}: Omit<BoxProps, 'title'> & {
  hideEuLogo?: boolean
  title: ReactNode
  subTitle: ReactNode
  action?: ReactNode
  header?: ReactNode
}) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen} = useLayoutContext()

  useEffect(() => {
    header$ = null
    window.addEventListener('scroll', stickHeader)
  }, [])

  return (
    <>
      {generalStyles}
      <Box
        id={id}
        sx={{
          transition: t => t.transitions.create('all'),
          zIndex: 2,
          background: t => t.palette.background.default,
          pt: 2,
          pl: 2,
          width: '100%',
          mb: 2,
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }}
        {...props}
      >
        <Box className="header_content">
          <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
            {showSidebarButton && (
              <IconBtn
                size="small"
                sx={{
                  alignSelf: 'start',
                  mr: 2,
                  border: t => `2px solid ${t.palette.primary.main}`,
                  background: t => (sidebarOpen ? 'none' : alpha(t.palette.primary.main, 0.1)),
                  color: t => t.palette.primary.main,
                  '&:hover': {
                    background: t => alpha(t.palette.primary.main, 0.1),
                  },
                }}
                onClick={() => setSidebarOpen(_ => !_)}
              >
                <Icon>menu</Icon>
              </IconBtn>
            )}
            <Box className="header_title" sx={{mb: 1, flex: 1, whiteSpace: 'nowrap'}}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography className="header_title_main" variant="h1" sx={{flex: 1}}>{title}</Typography>
                {!hideEuLogo && (
                  <EULogo height={26} sx={{mr: 1}}/>
                )}
                <DRCLogo height={24}/>
              </Box>
              <Typography className="header_title_sub" variant="subtitle1" sx={{color: t => t.palette.text.secondary}}>{subTitle}</Typography>
            </Box>
            <Box sx={{ml: 'auto', mr: 2}}>
              {action}
            </Box>
          </Box>
          {header}
        </Box>
      </Box>
    </>
  )
}
