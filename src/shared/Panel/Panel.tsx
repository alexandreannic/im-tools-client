import * as React from 'react'
import {forwardRef, ReactNode, useRef, useState} from 'react'
import {Box, Card, CardProps, Icon, LinearProgress} from '@mui/material'
import {PanelHead} from './PanelHead'
import {IconBtn} from 'mui-extension'
import html2canvas from 'html2canvas'

export interface PanelProps extends Omit<CardProps, 'title'> {
  loading?: boolean
  hoverable?: boolean
  stretch?: boolean
  elevation?: number
  title?: ReactNode
  expendable?: boolean
  savableAsImg?: boolean
}

export const Panel = forwardRef(({
  elevation,
  hoverable,
  loading,
  children,
  stretch,
  sx,
  title,
  expendable,
  savableAsImg,
  ...other
}: PanelProps, ref: any) => {
  const [expended, setExpended] = useState(false)
  const content = useRef<HTMLDivElement>(null)

  const openImageNewTag = (canvas: HTMLCanvasElement, name: string) => {
    const w = window.open()!
    // canvas.height = canvas.height * .5
    // canvas.width = canvas.width * .5
    w.document.write('<img src="' + canvas.toDataURL() + '" />')
    w.document.title = name
  }

  const saveAsImg = () => {
    html2canvas(content.current!, {}).then(_ => openImageNewTag(_, 'imaa-tools-img'))
  }

  return (
    <Card
      ref={ref}
      // elevation={elevation}
      sx={{
        position: 'relative',
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
        '&:hover .panel-actions': {
          display: 'block',
        },
        ...sx,
      }}
      {...other}
    >
      {(expendable || savableAsImg) && (
        <Box className="panel-actions" sx={{
          p: 1,
          position: 'absolute',
          display: 'none',
          top: 0,
          right: 0,
        }}>
          {expendable && (
            <IconBtn size="small" sx={{marginLeft: 'auto', p: 0, color: t => t.palette.text.disabled}} onClick={() => setExpended(_ => !_)}>
              <Icon>{expended ? 'fullscreen_exit' : 'fullscreen'}</Icon>
            </IconBtn>
          )}
          {savableAsImg && (
            <IconBtn size="small" sx={{ml: 1, p: 0, color: t => t.palette.text.disabled}} onClick={saveAsImg}>
              <Icon>download</Icon>
            </IconBtn>
          )}
        </Box>
      )}

      {(title) && (
        <PanelHead>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {title}
          </Box>
        </PanelHead>
      )}
      {loading && <LinearProgress sx={{mb: '-4px'}}/>}
      <Box ref={content}>
        {children}
      </Box>
    </Card>
  )
})
