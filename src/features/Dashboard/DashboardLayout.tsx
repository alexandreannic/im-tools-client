import React, {ReactNode, useEffect, useState} from 'react'
import {Box, Collapse, LinearProgress, Typography} from '@mui/material'
import {combineSx} from '../../core/theme'
import {DashboardProvider} from './DashboardContext'
import {makeSx} from 'mui-extension'
import {AAIconBtn} from '@/shared/IconBtn'
import {useSetState} from '@alexandreannic/react-hooks-lib'
import {Layout} from '@/shared/Layout'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {DashboardHeader, dashboardHeaderId} from '@/features/Dashboard/DashboardHeader'
import {Page} from '@/shared/Page'
import {map} from '@alexandreannic/ts-utils'

const style = makeSx({
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    pt: 1,
    background: 'none',
    marginTop: '-50px',
    paddingTop: '110px',
    mb: 2,
    transition: t => t.transitions.create('all'),
  },
  sectionShrinked: {
    mb: 0,
  },
  iconExpand: {
    transition: t => t.transitions.create('all'),
    ml: 1, color: t => t.palette.text.disabled
  },
  iconExpendShrinked: {
    transform: 'rotate(180deg)',
  }
})


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
  loading = false,
  title,
  pageWidth = 1100,
  beforeSection,
  subTitle,
}: {
  pageWidth?: number
  action?: ReactNode
  loading: boolean
  title: string
  subTitle?: string
  header?: ReactNode
  beforeSection?: ReactNode
  sections?: {
    icon?: string
    name: string
    title: ReactNode
    component: () => JSX.Element
  }[]
}) => {
  const [activeSection, setActiveSection] = useState(sections?.[0]?.name ?? '')
  const hiddenSections = useSetState()
  useEffect(() => {
    if (!sections) return
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
      {loading && (
        <LinearProgress sx={{position: 'fixed', top: 0, right: 0, left: 0}}/>
      )}
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
        sidebar={map(sections, _ => (
          <Sidebar headerId={dashboardHeaderId}>
            {_.map(s => (
              <SidebarItem
                icon={s.icon}
                key={s.name}
                component="a"
                href={'#' + s.name}
                active={activeSection === s.name}
              >
                {s.title}
              </SidebarItem>
            ))}
          </Sidebar>
        ))}>
        <Page width={pageWidth} disableAnimation sx={{mb: 2}}>
          {beforeSection}
          {sections?.map(s => (
            <Box key={s.name}>
              <Typography id={s.name} variant="h2" sx={combineSx(style.sectionTitle, hiddenSections.has(s.name) && style.sectionShrinked)}>
                {s.title}
                <AAIconBtn
                  icon="expand_less"
                  sx={combineSx(style.iconExpand, hiddenSections.has(s.name) && style.iconExpendShrinked)}
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
