import React from 'react'
import {styleUtils} from '../../../core/theme'
import {ItBtn} from '../../Btn/ItBtn'

export const HeaderItem = ({children, href}: {children: any; href?: string}) => {
  return (
    <ItBtn
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
    </ItBtn>
  )
}
