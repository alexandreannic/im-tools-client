import {appConfig} from '@/conf/AppConfig'
import {kobo} from '@/koboDrcUaFormId'
import {TableImg} from '@/shared/TableImg/TableImg'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {useMemo} from 'react'

export const getUnsecureKoboImgUrl = (url: string, serverId: string = kobo.drcUa.server.prod): string => {
  return appConfig.apiURL + `/kobo-api/${serverId}/attachment?path=${url}`
  // return appConfig.apiURL + `/kobo-api/${koboServerId.prod}/attachment?path=${url.split('api')[1]}`
}

export const getKoboPath = (attachments: KoboAttachment[], fileName?: string) => {
  return fileName ? attachments.find(_ => _.filename.includes(fileName))?.download_small_url.split('api')[1] : undefined
}

export const KoboAttachedImg = ({
  fileName,
  serverId,
  attachments,
  size,
}: {
  size?: number
  fileName?: string
  serverId?: string
  attachments: KoboAttachment[]
}) => {
  const fileUrl = useMemo(() => getKoboPath(attachments, fileName), [attachments, fileName])
  return (
    <TableImg size={size} url={(fileUrl ? getUnsecureKoboImgUrl(fileUrl, serverId) : '') ?? ''}/>
  )
}