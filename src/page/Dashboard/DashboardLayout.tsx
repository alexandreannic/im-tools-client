import React, {ReactNode, useEffect} from 'react'
import {Box, GlobalStyles, ThemeProvider, Typography} from '@mui/material'
import {muiTheme} from '../../core/theme'
import {set} from 'lodash'
import {DashboardProvider} from './DashboardContext'
import {makeSx} from 'mui-extension'
import {DRCLogo} from '../../shared/logo'


const dashboardMw = 1100
const headerId = 'aa-sidebar-id'
const headerStickyClass = 'sticky-header'

let header$: HTMLElement | null = null

const stickHeader = () => {
  if (!header$) {
    header$ = document.getElementById(headerId)!
  }
  if (window.scrollY > header$.offsetHeight) {
    if (!header$.classList.contains(headerStickyClass))
      header$.classList.add(headerStickyClass)
  } else {
    header$.classList.remove(headerStickyClass)
  }
}

/**
 * Don't do it the React way to improve perfs
 */
// const stickSidebarToHeader = () => {
//   if (!sidebar) {
//     sidebar = document.getElementById(sidebarId)
//   }
//   if (sidebar) {
//     sidebar.style.top = Math.max(layoutConfig.headerHeight - window.scrollY, 0) + 'px'
//   }
// }
const style = makeSx({
  sidebar: {
    position: 'fixed',
    p: 2,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    transition: t => t.transitions.create('all'),
    zIndex: 2,
    background: t => t.palette.background.default,
    py: 2,
    mb: 2,
    borderBottom: t => `1px solid ${t.palette.divider}`,
    // position: 'sticky',
    // top: 0,
  },
  sectionTitle: {
    background: t => t.palette.background.default,
    pt: 1,
    // zIndex: 1,
    // position: 'sticky',
    // top: 150
  }
})

const generalStyles = <GlobalStyles styles={t => ({
  [`.${headerStickyClass} .header_content`]: {
    maxWidth: dashboardMw,
    margin: 'auto',
  },
  [`.${headerStickyClass} .header_title_main`]: {
    fontSize: '1.2em',
  },
  [`.${headerStickyClass} .header_title_sub`]: {
    fontSize: '1.2em',
    '&:before': {
      content: '" - "',
    }
  },
  [`.${headerStickyClass} .header_title`]: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: t.spacing(1),
  },
  [`#${headerId}.${headerStickyClass}`]: {
    border: 'none',
    boxShadow: t.shadows[4],
    padding: `${t.spacing(1)} ${t.spacing(2)} ${t.spacing(1.5)} ${t.spacing(2)}`,
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
  }
})}/>

export const DashboardLayout = ({
  steps,
  header,
  title,
  subTitle,
}: {
  title: string
  subTitle?: string
  header?: ReactNode
  steps: {
    name: string
    title: ReactNode
    component: () => JSX.Element
  }[]
}) => {
  useEffect(() => {
    window.addEventListener('scroll', stickHeader)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        // @ts-ignore
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  }, [])
  return (
    <DashboardProvider>
      {generalStyles}
      <ThemeProvider theme={(() => {
        const t = muiTheme()
        t.palette.background.default = 'white'
        t.shape.borderRadius = 8
        set(t, 'components.MuiCard.styleOverrides.root', () => ({
          border: `1px solid ${t.palette.divider}`,
          boxShadow: 'none',
        }))
        return t
      })()}>
        <Box sx={t => ({display: 'flex', background: t.palette.background.default})}>
          <Box sx={style.sidebar}>
            <Box>
              {steps.map(step => (
                <Box sx={{mb: 2}} key={step.name}>
                  <Box component="a" href={'#' + step.name}>{step.title}</Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{width: dashboardMw, maxWidth: dashboardMw, margin: 'auto', mb: 2,}}>
            <Box sx={style.header} id={headerId}>
              <Box className="header_content">
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Box className="header_title" sx={{mb: 2, flex: 1}}>
                    <Typography className="header_title_main" variant="h1">{title}&nbsp;</Typography>
                    <Typography className="header_title_sub" variant="subtitle1" sx={{color: t => t.palette.text.secondary}}>{subTitle}</Typography>
                  </Box>
                  <DRCLogo height={20} sx={{ml: 'auto'}}/>
                </Box>
                {header}
              </Box>
            </Box>
            {steps.map(step => (
              <Box key={step.name}>
                <Typography variant="h2" id={step.name} sx={{...style.sectionTitle, mt: 3, mb: 2}}>
                  {step.title}
                </Typography>
                <Box>
                  {step.component()}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    </DashboardProvider>
  )
}
