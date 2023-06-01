import {alpha, Box, BoxProps, Icon, Slide} from '@mui/material'
import {IconBtn} from 'mui-extension'
import {layoutConfig} from '../index'
import React from 'react'
import {useLayoutContext} from '../LayoutContext'
import {HeaderItem} from './HeaderItem'
import {NavLink} from 'react-router-dom'

interface Props extends BoxProps {
}

export const Header = ({children}: Props) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen} = useLayoutContext()

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Box
        component="header"
        sx={{
          minHeight: layoutConfig.headerHeight,
          px: layoutConfig.headerPx,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          background: t => t.palette.background.paper,
          borderBottom: t => '1px solid ' + t.palette.divider,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {showSidebarButton && (
            <IconBtn
              sx={{
                mr: 1,
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
          <HeaderItem>
            <NavLink to="/activity-info">
              Activity-Info
            </NavLink>
          </HeaderItem>
          <HeaderItem>
            <NavLink to="/snapshot">
              Snapshots
            </NavLink>
          </HeaderItem>
          <HeaderItem>
            <NavLink to="/kobo">
              Database
            </NavLink>
          </HeaderItem><HeaderItem>
            <NavLink to="/dashboard">
              Dashboards
            </NavLink>
          </HeaderItem>
          <HeaderItem>
            <NavLink to="/mpca">
              MPCA
            </NavLink>
          </HeaderItem>
          <HeaderItem>
            <NavLink to="/map">
              Map
            </NavLink>
          </HeaderItem>
          <HeaderItem>
            <NavLink to="/playground">
              Playground
            </NavLink>
          </HeaderItem>

          {children}
        </div>
      </Box>
    </Slide>
  )
}
