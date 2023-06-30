import React from 'react'
import {styleUtils} from '../../../core/theme'
import {AaBtn} from '../../Btn/AaBtn'

export const AppHeaderItem = ({children, href}: {children: any; href?: string}) => {
  return (
    <AaBtn
      color="primary"
      href={href}
      sx={{
        textTransform: 'initial',
        fontSize: t => styleUtils(t).fontSize.normal,
        py: 0,
        px: 2,
      }}
    >
      {children}
    </AaBtn>
  )
}
