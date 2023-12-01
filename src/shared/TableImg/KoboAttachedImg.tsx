import {AppConfig, appConfig} from '@/conf/AppConfig'
import {kobo} from '@/koboDrcUaFormId'
import {TableImg} from '@/shared/TableImg/TableImg'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {useMemo} from 'react'
import {SxProps, Theme} from '@mui/material'

export const koboImgHelper = ({
  fileName,
  serverId = kobo.drcUa.server.prod,
  attachments,
  conf = appConfig,
}: {
  fileName?: string,
  serverId?: string
  attachments: KoboAttachment[]
  conf?: AppConfig
}) => {
  const path = fileName ? attachments.find(_ => _.filename.includes(fileName))?.download_small_url.split('api')[1] : undefined
  return {
    path,
    fullUrl: path ? conf.apiURL + `/kobo-api/${serverId}/attachment?path=${path}` : undefined,
  }
}

export const KoboAttachedImg = ({
  fileName,
  serverId,
  attachments,
  size,
  tooltipSize = 450,
}: {
  size?: number
  tooltipSize?: number | null
  fileName?: string
  serverId?: string
  attachments: KoboAttachment[]
}) => {
  const fileUrl = useMemo(() => koboImgHelper({attachments, fileName}), [attachments, fileName])
  return (
    <TableImg size={size} tooltipSize={tooltipSize} url={fileUrl.fullUrl ?? ''}/>
  )
}