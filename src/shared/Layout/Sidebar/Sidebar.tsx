import * as React from 'react'
import {useEffect} from 'react'
import {Box, BoxProps, Icon, SwipeableDrawer, Switch} from '@mui/material'
import {useLayoutContext} from '../LayoutContext'
import {layoutConfig} from '../index'
import {SidebarFooter} from './SidebarFooter'
import {SidebarItem} from './SidebarItem'
import {SidebarBody} from './SidebarBody'
import {SidebarHeader} from './SidebarHeader'
import {stopPropagation} from 'mui-extension'
import {useI18n} from '../../../core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'

let sidebar: HTMLElement | null = null
let header: HTMLElement | null = null

/**
 * Don't do it the React way to improve perfs
 */
const stickSidebarToHeader = (sidebarId: string, headerId: string) => {
  if (!sidebar) {
    sidebar = document.getElementById(sidebarId)
  }
  if (!header) {
    header = document.getElementById(headerId)
  }
  setTimeout(() => {
    if (sidebar && header) {
      sidebar.style.top = Math.max(header.offsetHeight < window.scrollY ? header.offsetHeight : header.offsetHeight - window.scrollY, 0) + 'px'
    }
  }, 0)
}

export const Sidebar = ({
  children,
  sx,
  id = 'app-sidebar-id',
  headerId = 'app-header',
  ...props
}: BoxProps & {
  headerId?: string
}) => {
  const {isMobileWidth, sidebarOpen, setSidebarOpen, sidebarPinned, setSidebarPinned} = useLayoutContext()
  const {m} = useI18n()
  const {darkTheme, setDarkTheme} = useAppSettings()

  useEffect(() => {
    // Element has been re-created by SwipeableDrawer, thus variable point to nothing.
    sidebar = null
    header = null
    if (headerId)
      stickSidebarToHeader(id, headerId)
    setSidebarOpen(_ => !isMobileWidth)
  }, [isMobileWidth, sidebarPinned])

  useEffect(() => {
    if (headerId)
      window.addEventListener('scroll', () => stickSidebarToHeader(id, headerId))
  }, [])

  const isTemporary = isMobileWidth || !sidebarPinned

  return (
    <SwipeableDrawer
      ModalProps={{
        disableScrollLock: true,
      }}
      PaperProps={{
        id,
        sx: {
          background: 'transparent',
          position: 'fixed',
          border: 'none',
          bottom: 0,
          height: 'auto',
          ...(isTemporary && {
            top: '0 !important',
          }),
        },
      }}
      open={sidebarOpen}
      onOpen={() => setSidebarOpen(true)}
      onClose={() => setSidebarOpen(false)}
      variant={isTemporary ? 'temporary' : 'persistent'}
    >
      <Box
        sx={{
          background: isTemporary ? t => t.palette.background.default : undefined,
          width: layoutConfig.sidebarWith,
          height: '100%',
          transition: t => t.transitions.create('width'),
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          ...sx,
        }}
        {...props}
      >
        <SidebarHeader hidden={!isTemporary}/>
        <SidebarBody>{children}</SidebarBody>
        {/*<Icon onClick={() => setDarkTheme(_ => !_)}>{darkTheme ? 'light_mode' : 'dark_mode'}</Icon>*/}
        <SidebarFooter>
          <SidebarItem onClick={stopPropagation(() => setDarkTheme(_ => !_))} icon="dark_mode" sx={{mr: 0, pr: 0}}>
            {m.theme}
            <Switch color="primary" sx={{ml: 'auto'}} checked={darkTheme}/>
          </SidebarItem>
          {!isMobileWidth && (
            <SidebarItem onClick={stopPropagation(() => setSidebarPinned(_ => !_))} icon="push_pin" sx={{mr: 0, pr: 0}}>
              {m.pin}
              <Switch color="primary" sx={{ml: 'auto'}} checked={sidebarPinned}/>
            </SidebarItem>
          )}
        </SidebarFooter>
      </Box>
    </SwipeableDrawer>
  )
}
