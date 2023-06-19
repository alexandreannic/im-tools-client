import React, {ReactNode, useEffect, useState} from 'react'
import {Box, Collapse, GlobalStyles, LinearProgress, ThemeProvider, Typography} from '@mui/material'
import {muiTheme} from '../../core/theme'
import {set} from 'lodash'
import {DashboardProvider} from './DashboardContext'
import {makeSx, Page} from 'mui-extension'
import {AAIconBtn} from '@/shared/IconBtn'
import {useSetState} from '@alexandreannic/react-hooks-lib'
import {Layout} from '@/shared/Layout'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {DashboardHeader, dashboardHeaderId} from '@/features/Dashboard/DashboardHeader'

const style = makeSx({
  // menuItem: {
  //   py: 1,
  //   px: 2,
  //   pr: 2,
  //   display: 'flex',
  //   color: t => t.palette.text.secondary,
  //   alignItems: 'center',
  //   fontWeight: t => t.typography.fontWeightBold,
  //   borderRight: t => `1px solid ${t.palette.divider}`,
  //   borderBottomLeftRadius: 40,
  //   borderTopLeftRadius: 40,
  //   transition: t => t.transitions.create('background'),
  //   ':hover': {
  //     borderWidth: 2,
  //     background: t => t.palette.action.hover,
  //     borderColor: t => darken(t.palette.action.hover, .9),
  //   },
  // },
  // menuItemActive: {
  //   borderWidth: 2,
  //   color: t => t.palette.primary.main,
  //   background: t => t.palette.action.focus,
  //   borderColor: t => t.palette.primary.main,
  // },
  // sidebar: {
  //   maxWidth: 284,
  //   minWidth: 284,
  // },
  // sidebarContent: {
  //   maxWidth: 284,
  //   position: 'fixed',
  //   p: 1,
  //   pr: .5,
  //   top: 0,
  //   bottom: 0,
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  // body: {
  //   flex: 1,
  //   px: 2,
  //   maxWidth: dashboardMw,
  //   marginLeft: 'auto',
  //   marginRight: 'auto',
  //   mb: 2,
  // },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    background: t => t.palette.background.default,
    pt: 1,
  }
})


// const generalStyles = <GlobalStyles styles={t => ({
//   body: {
//     background: t.palette.background.default,
//   },
// })}/>

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
    icon?: string
    name: string
    title: ReactNode
    component: () => JSX.Element
  }[]
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.name)
  const hiddenSections = useSetState()
  useEffect(() => {
    if (sections.length === 0) return
    spyTitles(sections.map(_ => _.name).reverse(), (s: string) => {
      if (s && s !== activeSection) {
        setActiveSection(s)
      }
    })
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        // @ts-ignore
        document.querySelector(this.getAttribute('href')).scrollIntoView({behavior: 'smooth'})
      })
    })
  }, [sections])
  return (
    <DashboardProvider>
      <Layout
        header={
          <DashboardHeader
            action={action}
            header={header}
            title={title}
            subTitle={subTitle}
            id={dashboardHeaderId}
          />
        }
        sidebar={
          <Sidebar headerId={dashboardHeaderId}>
            {sections.map(s => (
              <SidebarItem
                icon={s.icon}
                key={s.name}
                component="a"
                href={'#' + s.name}
                active={activeSection === s.name}
              >
                {/*<Box key={s.name} sx={combineSx(*/}
                {/*  style.menuItem,*/}
                {/*  activeSection === s.name && style.menuItemActive,*/}
                {/*)}>*/}
                {/*  <Icon sx={{mr: 1.5}}>{s.icon}</Icon>*/}
                {s.title}
                {/*</Box>*/}
              </SidebarItem>
            ))}
          </Sidebar>
        }>
        <Page width={1100} sx={{mb: 2}}>
          {loading && <LinearProgress sx={{position: 'fixed', top: 0, right: 0, left: 0}}/>}
          {beforeSection}
          {sections.map(s => (
            <Box key={s.name}>
              <Typography id={s.name} variant="h2" sx={{...style.sectionTitle, background: 'none', marginTop: '-50px', paddingTop: '110px', mb: 2}}>
                {s.title}
                <AAIconBtn
                  icon={hiddenSections.has(s.name) ? 'expand_less' : 'expand_more'}
                  sx={{ml: 1, color: t => t.palette.text.disabled}}
                  onClick={() => hiddenSections.toggle(s.name)}
                />
              </Typography>
              <Collapse in={!hiddenSections.has(s.name)}>
                {s.component()}
              </Collapse>
            </Box>
          ))}
        </Page>
      </Layout>
    </DashboardProvider>
  )
}
