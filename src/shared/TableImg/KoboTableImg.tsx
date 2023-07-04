import {appConfig} from '@/conf/AppConfig'
import {koboServerId} from '@/koboFormId'
import {TableImg} from '@/shared/TableImg/TableImg'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {useMemo} from 'react'

const getKoboImagePath = (url: string, serverId: string = koboServerId.prod): string => {
  return appConfig.apiURL + `/kobo-api/${serverId}/attachment?path=${url}`
  // return appConfig.apiURL + `/kobo-api/${koboServerId.prod}/attachment?path=${url.split('api')[1]}`
}

export const KoboTableImg = ({
  fileName,
  serverId,
  attachments,
}: {
  fileName?: string
  serverId?: string
  attachments: KoboAttachment[]
}) => {
  const fileUrl = useMemo(
    () => fileName ? attachments.find(_ => _.filename.includes(fileName))?.download_small_url.split('api')[1] : undefined,
    [attachments, fileName]
  )
  return (
    <TableImg url={fileUrl ? getKoboImagePath(fileUrl, serverId) : ''}/>
  )
}