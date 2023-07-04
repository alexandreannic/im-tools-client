import {Box} from '@mui/material'
import React from 'react'

export const TableImg = ({
  url,
}: {
  url: string
}) => {
  return url ? (
    <a href={url} target="_blank">
      <Box component="span" sx={{
        '&:hover': {
          transform: 'scale(1.1)'
          // height: 32,
          // width: 32,
        },
        verticalAlign: 'middle',
        display: 'inline-block',
        transition: t => t.transitions.create('all'),
        backgroundColor: t => t.palette.divider,
        backgroundImage: `url(${url})`,
        height: 30,
        width: 30,
        borderRadius: '4px',
        backgroundSize: 'cover'
      }}/>
    </a>
  ) : (
    <></>
  )
}
