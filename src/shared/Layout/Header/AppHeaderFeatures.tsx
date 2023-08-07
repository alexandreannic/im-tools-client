import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'
import React from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Box, Popover} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {AppFeature, appFeatures} from '@/features/appFeatureId'
import {FeatureLogo} from '@/features/FeatureLogo'

const iconSize = 92

export const AppHeaderFeatures = (props: Omit<AAIconBtnProps, 'children'>) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const {session, accesses} = useSession()
  const open = (!!anchorEl)
  const {m} = useI18n()
  const features: AppFeature[] = appFeatures.filter(_ => !_.showIf || _.showIf(session, accesses))
  return (
    <>
      <AAIconBtn
        children="apps"
        size="medium"
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
        <Box sx={{width: (iconSize + 8) * 3, p: .5}}>
          {features.map(_ =>
            <FeatureLogo iconSize={40} key={_.id} feature={_} sx={{
              display: 'inline-block',
              height: iconSize,
              width: iconSize,
              maxWidth: iconSize,
              margin: .25,
              py: 1,
              px: .5,
            }}/>
          )}
        </Box>
      </Popover>
    </>
  )
}