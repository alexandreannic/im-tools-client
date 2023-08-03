import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React from 'react'
import {Box, Popover} from '@mui/material'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {useKoboDatabaseContext} from '@/features/Database/DatabaseTable/Context/KoboDatabaseContext'

export const KoboRepeatGroupDetailsPopover = ({
  anchorEl,
  title,
  onClose,
  form,
  group,
}: {
  form: KoboApiForm
  group: Record<string, any>[]
  title?: string
  onClose: () => void
  anchorEl: any,
}) => {
  const {schema, langIndex} = useKoboDatabaseContext()
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{title}</Txt>
      </PanelHead>
      <PanelBody>
        <Box component="pre" sx={{width: 300,}}>
          {JSON.stringify(group, null, 2)}
        </Box>
      </PanelBody>
    </Popover>
  )
}