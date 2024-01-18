import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React, {useMemo} from 'react'
import {Popover} from '@mui/material'
import {Sheet} from '@/shared/Sheet/Sheet'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useI18n} from '@/core/i18n'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'

export const DatabaseKoboTableGroupModal = ({
  groupData,
  name,
  onClose,
  anchorEl,
}: {
  groupData: KoboAnswer[],
  name: string
  onClose: () => void
  anchorEl: any,
}) => {
  const {m} = useI18n()
  const ctxSchema = useKoboSchemaContext()

  const columns = useMemo(() => {
    return getColumnBySchema({
      data: groupData,
      m,
      schema: ctxSchema.schemaHelper.groupSchemas[name],
      translateQuestion: ctxSchema.translate.question,
      translateChoice: ctxSchema.translate.choice,
      choicesIndex: ctxSchema.schemaHelper.choicesIndex,
      groupSchemas: ctxSchema.schemaHelper.groupSchemas,
    })
  }, [ctxSchema.schemaUnsanitized])

  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{ctxSchema.translate.question(name)}</Txt>
      </PanelHead>
      <PanelBody>
        <Sheet columns={columns} data={groupData} id={name}/>
      </PanelBody>
    </Popover>
  )
}