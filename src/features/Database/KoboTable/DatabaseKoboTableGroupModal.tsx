import {PanelHead} from '@/shared/Panel'
import {PanelBody, Txt} from 'mui-extension'
import React, {useMemo} from 'react'
import {Popover} from '@mui/material'
import {KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Sheet} from '@/shared/Sheet/Sheet'
import {getColumnBySchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useI18n} from '@/core/i18n'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {DatabaseKoboContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {KoboAnswer, KoboId} from '@/core/sdk/server/kobo/Kobo'

export const DatabaseKoboTableGroupModal = ({
  schema,
  translateQuestion,
  translateChoice,
  choicesIndex,
  groupSchemas,
  groupData,
  name,
  onClose,
  formId,
  anchorEl,
}: {
  formId: KoboId
  schema: KoboQuestionSchema[]
  translateQuestion: KoboTranslateQuestion
  translateChoice: KoboTranslateChoice
  choicesIndex: DatabaseKoboContext['schemaHelper']['choicesIndex']
  groupSchemas: DatabaseKoboContext['schemaHelper']['groupSchemas']
  groupData: KoboAnswer[],
  name: string
  onClose: () => void
  anchorEl: any,
}) => {
  const {m} = useI18n()
  const columns = useMemo(() => {
    return getColumnBySchema({
      data: groupData,
      m,
      schema: schema,
      translateQuestion: translateQuestion,
      translateChoice: translateChoice,
      choicesIndex: choicesIndex,
      groupSchemas: groupSchemas,
    })
  }, [schema])

  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{translateQuestion(name)}</Txt>
      </PanelHead>
      <PanelBody>
        <Sheet columns={columns} data={groupData} id={name}/>
      </PanelBody>
    </Popover>
  )
}