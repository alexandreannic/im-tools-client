import React from 'react'
import {styleUtils} from '../../../core/theme'
import {Btn} from '../../Btn/Btn'

export const HeaderItem = ({children, href}: {children: any; href?: string}) => {
  return (
    <Btn
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
    </Btn>
  )
}
