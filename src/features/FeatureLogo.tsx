import {AppFeature} from '@/features/appFeatureId'
import React from 'react'
import {ButtonBase, ButtonBaseProps, Icon} from '@mui/material'
import {Txt} from 'mui-extension'
import Link from 'next/link'

export const FeatureLogo = ({
  feature,
  sx,
  iconSize = 80,
  ...props
}: {
  feature: AppFeature
  iconSize?: number
} & ButtonBaseProps) => {

  return (
    <Link href={feature.path} key={feature.path}>
      <ButtonBase sx={{
        width: 240,
        display: 'inline-block',
        textAlign: 'center',
        overflow: 'hidden',
        // flexDirection: 'column',
        // justifyContent: 'center',
        borderRadius: t => t.shape.borderRadius + 'px',
        padding: 2,
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