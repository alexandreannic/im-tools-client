import React from 'react'
import {Icon, Tooltip} from '@mui/material'
import {AnswerTable} from './AnswerTable'
import {ItBtn} from '../../../shared/Btn/ItBtn'
import {Confirm} from 'mui-extension/lib/Confirm'
import {useI18n} from '../../../core/i18n'
import {IconBtn} from 'mui-extension'

export const ActivityInfoActions = <T extends Record<string, any>, >({
  answers,
  activity,
  requestBody,
}: {
  activity: any
  requestBody: any,
  answers: T[]
}) => {
  return (
    <>
      <AIViewAnswers answers={answers}/>
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
    <Confirm
      maxWidth={'lg'}
      title={m.koboData}
      PaperProps={{}}
      content={<AnswerTable answers={answers}/>}>
      <Tooltip title="Kobo data">
        <ItBtn icon="table_view" variant="outlined" size="small">{m.viewDate}</ItBtn>
      </Tooltip>
    </Confirm>
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
    <Confirm title={title} content={
      <pre>{JSON.stringify(request, null, 2)}</pre>
    }>
      <Tooltip title={title}>
        <IconBtn color="primary">
          <Icon>{icon}</Icon>
        </IconBtn>
      </Tooltip>
    </Confirm>
  )
}