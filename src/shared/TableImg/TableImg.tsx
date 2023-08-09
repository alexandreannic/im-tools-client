import {Box} from '@mui/material'
import React from 'react'

export const TableImg = ({
  url,
  size = 30,
}: {
  size?: number
  url: string
}) => {
  return url ? (
    <a href={url} target="_blank">
      <Box component="span" sx={{
        '&:hover': {
          transform: 'scale(1.2)'
          // height: 32,
          // width: 32,
        },
        verticalAlign: 'middle',
        display: 'inline-block',
        transition: t => t.transitions.create('all'),
        backgroundColor: t => t.palette.divider,
        backgroundImage: `url(${url})`,
        height: size,
        width: size,
        borderRadius: '6px',
        backgroundSize: 'cover'
      }}/>
    </a>
  ) : (
    <></>
  )
}
