import {AppFeature} from '@/features/appFeatureId'
import React from 'react'
import {ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {Txt} from 'mui-extension'
import Link from 'next/link'
import {useTab} from '@mui/base'

export const FeatureLogo = ({
  feature,
  sx,
  iconSize = 80,
  ...props
}: {
  feature: AppFeature
  iconSize?: number
} & ButtonBaseProps) => {
  const t = useTheme()
  return (
    <Link href={feature.path} key={feature.path}>
      <ButtonBase sx={{
        width: 240,
        display: 'inline-block',
        textAlign: 'center',
        overflow: 'hidden',
        // flexDirection: 'column',
        // justifyContent: 'center',
        borderRadius: t.shape.borderRadius + 'px',
        padding: 2,
        transition: t.transitions.create('background'),
        '&:hover': {
          background: t.palette.action.hover,
        },
        ...sx,
      }} {...props}>
        <Icon sx={{color: feature.color, fontSize: iconSize + 'px !important'}}>
          {feature.materialIcons}
        </Icon>
        <Txt block fontSize="big" bold sx={{mt: 1}} truncate>{feature.name}</Txt>
      </ButtonBase>
    </Link>
  )
}