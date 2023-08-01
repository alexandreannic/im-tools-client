import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React, {useMemo} from 'react'
import {Popover} from '@mui/material'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'

export const KoboRepeatGroupDetails = ({
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
  useMemo(() => {
  }, [group, form])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{title}</Txt>
      </PanelHead>
      <PanelBody>
        {JSON.stringify(group)}
      </PanelBody>
    </Popover>
  )
}