import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React, {useMemo} from 'react'
import {Box, Popover} from '@mui/material'
import {KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Sheet} from '@/shared/Sheet/Sheet'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useI18n} from '@/core/i18n'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'

export const DatabaseKoboTableGroupModal = ({
  anchorEl,
  name,
  onClose,
  groupData,
}: {
  groupData: KoboAnswer[],
  name: string
  onClose: () => void
  anchorEl: any,
}) => {
  const {m} = useI18n()
  const ctx = useDatabaseKoboTableContext()
  const columns = useMemo(() => {
    return getColumnBySchema({
      schema: ctx.schemaHelper.groupSchemas[name],
      data: groupData,
      m,
      translateQuestion: ctx.translate.question,
      translateChoice: ctx.translate.choice,
      choicesIndex: ctx.schemaHelper.choicesIndex,
      groupSchemas: ctx.schemaHelper.groupSchemas,
    })
  }, [ctx.schema])

  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{ctx.translate.question(name)}</Txt>
      </PanelHead>
      <PanelBody>
        <Sheet columns={columns} data={groupData}/>
      </PanelBody>
    </Popover>
  )
}