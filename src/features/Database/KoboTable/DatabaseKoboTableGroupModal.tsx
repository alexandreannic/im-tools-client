import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React, {useMemo} from 'react'
import {Box, Popover} from '@mui/material'
import {KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Sheet} from '@/shared/Sheet/Sheet'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useI18n} from '@/core/i18n'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'

export const DatabaseKoboTableGroupModal = ({
  anchorEl,
  title,
  onClose,
  schema,
  groupData,
}: {
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  schema: KoboQuestionSchema[]
  groupData: Record<string, any>[]
  title?: string
  onClose: () => void
  anchorEl: any,
}) => {
  const {m} = useI18n()
  const columns = useMemo(() => {
    return getColumnBySchema({
      schema: schema,
      data: groupData,
      m,
      translateQuestion,
      translateChoice,
      choicesIndex,
    })
  }, [])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{title}</Txt>
      </PanelHead>
      <PanelBody>
        <Sheet columns={}
        <Box component="pre" sx={{width: 300,}}>
          {JSON.stringify(groupData, null, 2)}
        </Box>
      </PanelBody>
    </Popover>
  )
}