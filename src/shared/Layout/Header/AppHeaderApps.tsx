import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'
import React, {useState} from 'react'
import {useSession} from '@/core/context/SessionContext'
import {Box, Popover} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {appFeatures} from '@/features/appFeatureId'
import {FeatureLogo} from '@/features/FeatureLogo'

export const AppHeaderApps = (props: Omit<AAIconBtnProps, 'icon'>) => {
  const session = useSession()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = (!!anchorEl)
  const {m} = useI18n()
  return (
    <>
      <AAIconBtn
        icon="apps"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        {...props}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={open}
      >
        <Box sx={{width: 300, p: .5}}>
          {appFeatures.map(_ =>
            <FeatureLogo iconSize={40} key={_.id} feature={_} sx={{
              display: 'inline-block',
              height: 80,
              width: 80,
              maxWidth: 80,
              margin: 1,
              padding: 1
            }}/>
          )}
        </Box>
      </Popover>
    </>
  )
}