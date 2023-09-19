import React from 'react'
import {makeStyles} from 'tss-react/mui'

const useStyles = makeStyles<{size: number}>()((t, {size}) => ({
  root: {
    '&:hover': {
      transform: 'scale(1.2)',
      boxShadow: t.shadows[4],
    },
    verticalAlign: 'middle',
    display: 'inline-block',
    transition: t.transitions.create('all'),
    backgroundColor: t.palette.divider,
    // backgroundImage: `url(${url})`,
    height: size,
    width: size,
    borderRadius: '6px',
    backgroundSize: 'cover'
  }
}))

export const TableImg = ({
  url,
  size = 30,
}: {
  size?: number
  url: string
}) => {
  const {classes} = useStyles({size})
  return url ? (
    <a href={url} target="_blank">
      <div className={classes.root} style={{backgroundImage: `url(${url})`,}}/>
    </a>
  ) : (
    <></>
  )
}
