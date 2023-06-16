import React, {ReactNode, useEffect, useState} from 'react'
import {Box, darken, GlobalStyles, LinearProgress, ThemeProvider, Typography} from '@mui/material'
import {combineSx, muiTheme} from '../../core/theme'
import {set} from 'lodash'
import {DashboardProvider} from './DashboardContext'
import {makeSx} from 'mui-extension'
import {DRCLogo} from '../../shared/logo/logo'

const dashboardMw = 1100
const headerId = 'aa-sidebar-id'
const headerStickyClass = 'sticky-header'

let header$: HTMLElement | null = null

const style = makeSx({
  menuItem: {
    py: 1,
    px: 2,
    pr: 2,
    display: 'flex',
    color: t => t.palette.text.secondary,
    alignItems: 'center',
    fontWeight: t => t.typography.fontWeightBold,
    borderRight: t => `1px solid ${t.palette.divider}`,
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 40,
    transition: t => t.transitions.create('background'),
    ':hover': {
      borderWidth: 2,
      background: t => t.palette.action.hover,
      borderColor: t => darken(t.palette.action.hover, .9),
    },
  },
  menuItemActive: {
    borderWidth: 2,
    color: t => t.palette.primary.main,
    background: t => t.palette.action.focus,
    borderColor: t => t.palette.primary.main,
  },
  sidebar: {
    maxWidth: 270,
    minWidth: 270,
  },
  sidebarContent: {
    maxWidth: 270,
    position: 'fixed',
    p: 2,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    px: 2,
    maxWidth: dashboardMw,
    marginLeft: 'auto',
    marginRight: 'auto',
    mb: 2,
  },
  header: {
    transition: t => t.transitions.create('all'),
    zIndex: 2,
    background: t => t.palette.background.default,
    py: 2,
    mb: 2,
    borderBottom: t => `1px solid ${t.palette.divider}`,
  },
  sectionTitle: {
    background: t => t.palette.background.default,
    pt: 1,
  }
})
const stickHeader = () => {
  if (!header$) {
    header$ = document.getElementById(headerId)!
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
    background: t.palette.background.paper,
    padding: `${t.spacing(1)} ${t.spacing(2)} ${t.spacing(1)} ${t.spacing(2)}`,
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
  }
})}/>

const spyTitles = (sections: string[], fn: (sectionName: string) => void) => {
  const sections$ = sections.map(_ => document.getElementById(_))
  const set = () => {
    const index = sections$.findIndex(_ => window.scrollY >= (_?.offsetTop ?? -1) - 140)
    fn(sections[index])
  }
  window.addEventListener('scroll', set)
  set()
}

export const DashboardLayout = ({
  sections,
  header,
  action,
  loading,
  title,
  beforeSection,
  subTitle,
}: {
  action?: ReactNode
  loading?: boolean
  title: string
  subTitle?: string
  header?: ReactNode
  beforeSection?: ReactNode
  sections: {
    name: string
    title: ReactNode
    component: () => JSX.Element
  }[]
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.name)
  useEffect(() => {
    window.addEventListener('scroll', stickHeader)
    if (sections.length === 0) return
    spyTitles(sections.map(_ => _.name).reverse(), (s: string) => {
      if (s && s !== activeSection) {
        setActiveSection(s)
      }
    })
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        // e.preventDefault()
        // @ts-ignore
        document.querySelector(this.getAttribute('href')).scrollIntoView({behavior: 'smooth'})
      })
    })
  }, [sections])
  return (
    <DashboardProvider>
      {/*{generalStyles}*/}
      <ThemeProvider theme={(() => {
        const t = muiTheme()
        t.palette.background.default = '#f8f9fa'
        t.shape.borderRadius = 8
        set(t, 'components.MuiCard.styleOverrides.root', () => ({
          // border: `1px solid ${t.palette.divider}`,
          border: 'none',
          boxShadow: 'none',
        }))
        return t
      })()}>
        <Box sx={t => ({minHeight: '100vh', display: 'flex', background: t.palette.background.default})}>
          {loading && <LinearProgress sx={{position: 'fixed', top: 0, right: 0, left: 0}}/>}
          <Box sx={style.sidebar}>
            <Box sx={style.sidebarContent}>
              <Box>
                {sections.map(s => (
                  <Box key={s.name} component="a" href={'#' + s.name}>
                    <Box key={s.name} sx={combineSx(
                      style.menuItem,
                      activeSection === s.name && style.menuItemActive,
                    )}>
                      {s.title}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={style.body}>
            <Box sx={style.header} id={headerId}>
              <Box className="header_content">
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                  <Box className="header_title" sx={{mb: 2, flex: 1}}>
                    <Typography className="header_title_main" variant="h1">{title}&nbsp;</Typography>
                    <Typography className="header_title_sub" variant="subtitle1" sx={{color: t => t.palette.text.secondary}}>{subTitle}</Typography>
                  </Box>
                  <Box sx={{ml: 'auto', mr: 2}}>
                    {action}
                  </Box>
                  <DRCLogo height={20}/>
                </Box>
                {header}
              </Box>
            </Box>
            {beforeSection}
            {sections.map(s => (
              <Box key={s.name}>
                <Typography id={s.name} variant="h2" sx={{...style.sectionTitle, background: 'none', marginTop: '-60px', paddingTop: '120px', mb: 2}}>
                  {s.title}
                </Typography>
                <Box>
                  {s.component()}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    </DashboardProvider>
  )
}
