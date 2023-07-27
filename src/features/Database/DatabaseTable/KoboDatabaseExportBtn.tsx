import {useAsync} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray} from '@/shared/Sheet/generateXLSFile'
import {Utils} from '@/utils/utils'
import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {getKoboPath} from '@/shared/TableImg/KoboAttachedImg'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import {getKoboLabel} from '@/features/Database/DatabaseTable/KoboDatabase'
import {KoboDatabaseBtn} from '@/features/Database/DatabaseTable/koboDatabaseShared'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'

export const KoboDatabaseExportBtn = <T, >({
  data,
  langIndex,
  form,
}: {
  langIndex?: number
  form: KoboApiForm
  data: T[] | undefined
}) => {
  const {m} = useI18n()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)

  const exportToCSV = () => {
    if (data) {
      _generateXLSFromArray.call({
        filename: Utils.slugify(form.name),
        data: data,
        schema: form.content.survey.map(q => {
          return {
            name: q.name,
            render: (row: any) => fnSwitch(q.type, {
              start: () => row.start,
              end: () => row.start,
              date: () => row.end,
              image: () => map(getKoboPath(row[q.name]), getKoboImagePath),
              select_one: () => getKoboLabel(row, langIndex),
              select_multiple: () => getKoboLabel(row, langIndex),
              calculate: () => map(row[q.name], _ => isNaN(_) ? _ : +_),
              integer: () => map(row[q.name], _ => +_),
            }, () => row[q.name])
          }
        })
      })
    }
  }
  return (
    <KoboDatabaseBtn tooltip={m.downloadAsXLS} loading={_generateXLSFromArray.getLoading()} onClick={exportToCSV} icon="download"/>
  )
}