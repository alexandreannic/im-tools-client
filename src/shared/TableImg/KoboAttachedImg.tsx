import {AppConfig, appConfig} from '@/conf/AppConfig'
import {kobo} from '@/core/KoboIndex'
import {TableImg} from '@/shared/TableImg/TableImg'
import {KoboAttachment} from '@/core/sdk/server/kobo/Kobo'
import {useMemo} from 'react'

export const proxyKoboImg = ({
  url,
  serverId = kobo.drcUa.server.prod,
  conf = appConfig,
}: {
  url?: string
  serverId?: string
  conf?: AppConfig
}) => {
  const path = url?.split('api')[1]
  return {
    path,
    fullUrl: path ? conf.apiURL + `/kobo-api/${serverId}/attachment?path=${path}` : undefined
  }
}

const parseKoboFileName = (fileName?: string) => fileName ? fileName.replaceAll(' ', '_').replaceAll(/[^0-9a-zA-Z-_.]/g, '') : undefined

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
  const parsedFileName = parseKoboFileName(fileName)
  const url = parsedFileName ? attachments.find(_ => _.filename.includes(parsedFileName))?.download_small_url : undefined
  if (parsedFileName) console.log(parsedFileName, attachments.map(_ => _.filename), url)
  return proxyKoboImg({
    url,
    serverId,
    conf,
  })
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
  const file = useMemo(() => koboImgHelper({attachments, fileName}), [attachments, fileName])
  return (
    <TableImg size={size} tooltipSize={tooltipSize} url={file.fullUrl ?? ''}/>
  )
}

export const AllAttachements = ({
  attachments,
}: {
  attachments: KoboAttachment[]
}) => {
  return attachments?.map((a: KoboAttachment, i: number) =>
    <TableImg key={i} size={100} tooltipSize={100} url={proxyKoboImg({url: a.download_url}).fullUrl ?? ''}/>
  )
}
