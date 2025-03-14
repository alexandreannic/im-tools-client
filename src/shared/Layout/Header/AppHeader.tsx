import {alpha, BoxProps, Icon} from '@mui/material'
import {IconBtn, Txt} from 'mui-extension'
import {layoutConfig} from '../index'
import React from 'react'
import {useLayoutContext} from '../LayoutContext'
import {AppHeaderMenu} from '@/shared/Layout/Header/AppHeaderMenu'
import {AppHeaderFeatures} from '@/shared/Layout/Header/AppHeaderFeatures'
import {IpIconBtn} from '@/shared/IconBtn'
import Link from 'next/link'
import {AppHeaderContainer} from '@/shared/Layout/Header/AppHeaderContainer'

interface Props extends BoxProps {
}


export const AppHeader = ({children, sx, id = 'aa-header-id', ...props}: Props) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen, title} = useLayoutContext()

  return (
    <AppHeaderContainer
      component="header"
      sx={{
        minHeight: layoutConfig.headerHeight,
        px: layoutConfig.headerPx,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        // position: 'fixed',
        // top: 0,
        // right: 0,
        // left: 0,
        // boxShadow: t => t.shadows[3],
        // background: t => t.palette.background.paper,
        // borderBottom: t => '1px solid ' + t.palette.divider,
        ...sx,
      }}
      id={id}
      {...props}
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
            size="small"
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
        <Txt sx={{ml: 1}} size="title" bold dangerouslySetInnerHTML={{__html: title ?? ''}}/>
        {children}
      </div>
      <Link href="/">
        <IpIconBtn children="home"/>
      </Link>
      <AppHeaderFeatures sx={{mr: 1}}/>
      <AppHeaderMenu/>
    </AppHeaderContainer>
  )
}
