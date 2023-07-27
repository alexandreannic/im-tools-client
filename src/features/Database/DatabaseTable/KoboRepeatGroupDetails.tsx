import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React, {useMemo} from 'react'
import {Popover} from '@mui/material'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Enum} from '@alexandreannic/ts-utils'

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
  console.log('-----------', group, form.content.survey)
  useMemo(() => {
    // return Enum.keys(group).map(questionName => questionName.spl)

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