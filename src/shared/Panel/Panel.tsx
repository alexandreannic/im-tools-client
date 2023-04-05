import * as React from 'react'
import {forwardRef, ReactNode, useState} from 'react'
import {Box, Card, CardProps, Icon, LinearProgress} from '@mui/material'
import {PanelHead} from './PanelHead'
import {IconBtn} from 'mui-extension'

export interface PanelProps extends Omit<CardProps, 'title'> {
  loading?: boolean
  hoverable?: boolean
  stretch?: boolean
  elevation?: number
  title?: ReactNode
  expendable?: boolean
}

export const Panel = forwardRef(({
  elevation = 1,
  hoverable,
  loading,
  children,
  stretch,
  sx,
  title,
  expendable,
  ...other
}: PanelProps, ref: any) => {
  const [expended, setExpended] = useState(false)
  return (
    <Card
      ref={ref}
      elevation={elevation}
      sx={{
        background: t => t.palette.background.paper,
        ...expended ? {
          zIndex: 1,
          position: 'fixed',
          fontSize: 17,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        } : {},
        borderRadius: t => t.shape.borderRadius + 'px',
        mb: 2,
        ...(hoverable && {
          cursor: 'pointer',
          transition: t => t.transitions.create('all'),
          '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: t => t.shadows[4],
          },
        }),
        ...(stretch && {
          display: 'flex',
          flexDirection: 'column',
          height: t => `calc(100% - ${t.spacing(2)})`,
        }),
        ...(elevation === 0 && {
          border: t => `1px solid ${t.palette.divider}`,
        }),
        ...sx,
      }}
      {...other}
    >
      {(title || expendable) && (
        <PanelHead>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {title}
            {expendable && (
              <IconBtn size="small" sx={{marginLeft: 'auto', color: t => t.palette.text.disabled}} onClick={() => setExpended(_ => !_)}>
                <Icon>{expended ? 'fullscreen_exit' : 'fullscreen'}</Icon>
              </IconBtn>
            )}
          </Box>
        </PanelHead>
      )}
      {loading && <LinearProgress sx={{mb: '-4px'}}/>}
      {children}
    </Card>
  )
})
