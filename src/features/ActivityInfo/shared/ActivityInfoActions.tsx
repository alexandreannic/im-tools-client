import React from 'react'
import {Icon, Tooltip} from '@mui/material'
import {AnswerTable} from './AnswerTable'
import {Modal} from 'mui-extension/lib/Modal'
import {useI18n} from '@/core/i18n'
import {IconBtn} from 'mui-extension'
import {AAIconBtn} from '@/shared/IconBtn'
import {AiBundle} from '@/features/ActivityInfo/shared/AiType'

export const ActivityInfoActions = ({
  data,
  activity,
  requestBody,
}: AiBundle) => {
  return (
    <>
      <AIViewAnswers answers={data}/>
      {activity && <AIPreviewActivity activity={activity}/>}
      {requestBody && <AIPreviewRequest request={requestBody}/>}
    </>
  )
}

export const AIViewAnswers = <T extends Record<string, any>, >({
  answers
}: {
  answers: T[]
}) => {
  const {m} = useI18n()
  return (
    <Modal
      maxWidth={'lg'}
      title={m.koboData}
      PaperProps={{}}
      cancelLabel={m.close}
      content={<AnswerTable answers={answers}/>}
    >
      <AAIconBtn tooltip="View related Kobo data" children="table_view" color="primary"/>
    </Modal>
  )
}

export const AIPreviewActivity = ({
  activity
}: {
  activity: any
}) => {
  const {m} = useI18n()
  return (
    <AIPreviewJSON
      request={activity}
      title={m.previewActivity}
      icon="preview"
    />
  )
}

export const AIPreviewRequest = ({
  request
}: {
  request: any
}) => {
  const {m} = useI18n()
  return (
    <AIPreviewJSON
      request={request}
      title={m.previewRequestBody}
      icon="data_object"
    />
  )
}

const AIPreviewJSON = ({
  request,
  title,
  icon,
}: {
  title: string
  icon: string
  request: any
}) => {
  return (
    <Modal title={title} content={
      <pre>{JSON.stringify(request, null, 2)}</pre>
    }>
      <Tooltip title={title}>
        <IconBtn color="primary">
          <Icon>{icon}</Icon>
        </IconBtn>
      </Tooltip>
    </Modal>
  )
}