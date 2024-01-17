import React from 'react'
import {Icon, Tooltip} from '@mui/material'
import {AnswerTable} from './AnswerTable'
import {Modal} from 'mui-extension/lib/Modal'
import {useI18n} from '@/core/i18n'
import {IconBtn} from 'mui-extension'
import {AAIconBtn} from '@/shared/IconBtn'
import {AiBundle} from '@/features/ActivityInfo/shared/AiType'
import exp from 'constants'
import {IpBtnProps} from '@/shared/Btn/IpBtn'

export const ActivityInfoActions = ({
  data,
  activity,
  requestBody,
}: AiBundle) => {
  return (
    <>
      <AiViewAnswers answers={data}/>
      {activity && <AiPreviewActivity activity={activity}/>}
      {requestBody && <AiPreviewRequest request={requestBody}/>}
    </>
  )
}

export const AiViewAnswers = <T extends Record<string, any>, >({
  answers,
  tooltip,
}: {
  tooltip?: string
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
      <AAIconBtn size="small" tooltip={tooltip ?? "View related Kobo data"} children="table_view" color="primary"/>
    </Modal>
  )
}

export const AiPreviewActivity = ({
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

export const AiPreviewRequest = ({
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
      <AAIconBtn tooltip={title} size="small" color="primary" children={icon}/>
    </Modal>
  )
}

export const AiSendBtn = (props: IpBtnProps) => {
  return (
    <AAIconBtn
      tooltip="Submit 🚀"
      size="small"
      sx={{mr: .5}}
      color="primary"
      {...props}
    >send</AAIconBtn>
  )
}